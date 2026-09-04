<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/db.php";


// -----------------------------------------
// Endast POST
// -----------------------------------------

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Endast POST är tillåtet"
    ]);

    exit;
}


// -----------------------------------------
// Läs JSON från frontend
// -----------------------------------------

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (
    !$data ||
    !isset($data["country"]) ||
    !isset($data["items"]) ||
    !is_array($data["items"]) ||
    count($data["items"]) === 0
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Land eller produkter saknas"
    ]);

    exit;
}


// -----------------------------------------
// Hjälpfunktion: bestäm fraktregion
// -----------------------------------------

function getShippingRegion(string $country): string
{
    $country = strtoupper(trim($country));

    // Sverige
    if (
        $country === "SE" ||
        $country === "SWEDEN" ||
        $country === "SVERIGE"
    ) {
        return "SE";
    }

    // Norge och Island
    if (
        $country === "NO" ||
        $country === "NORWAY" ||
        $country === "NORGE" ||
        $country === "IS" ||
        $country === "ICELAND" ||
        $country === "ISLAND"
    ) {
        return "NO_IS";
    }

    // EU-länder
    $euCountries = [
        "AT", "BE", "BG", "HR", "CY", "CZ", "DK",
        "EE", "FI", "FR", "DE", "GR", "HU", "IE",
        "IT", "LV", "LT", "LU", "MT", "NL", "PL",
        "PT", "RO", "SK", "SI", "ES"
    ];

    if (in_array($country, $euCountries, true)) {
        return "EU";
    }

    throw new Exception(
        "Leverans är inte tillgänglig till valt land"
    );
}


// -----------------------------------------
// Hjälpfunktion: hämta fraktpris
// -----------------------------------------

function getShippingRate(
    mysqli $conn,
    string $region,
    float $weightKg
): array {

    // Bestäm vilken viktklass ordern tillhör.
    //
    // under 1 kg  -> < 1 kg
    // 1-2 kg      -> 1 till och med 2 kg
    // 2-3 kg      -> över 2 till och med 3 kg
    // osv.

    if ($weightKg < 1) {
        $maxWeight = 1;
    } elseif ($weightKg <= 2) {
        $maxWeight = 2;
    } elseif ($weightKg <= 3) {
        $maxWeight = 3;
    } elseif ($weightKg <= 5) {
        $maxWeight = 5;
    } elseif ($weightKg <= 10) {
        $maxWeight = 10;
    } elseif ($weightKg <= 15) {
        $maxWeight = 15;
    } elseif ($weightKg <= 20) {
        $maxWeight = 20;
    } else {
        throw new Exception(
            "Ingen fraktkostnad finns för orderns vikt"
        );
    }

    $sql = "
        SELECT
            carrier,
            price
        FROM shipping_rates
        WHERE
            region = ?
            AND max_weight = ?
        LIMIT 1
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sd",
        $region,
        $maxWeight
    );

    $stmt->execute();

    $result = $stmt->get_result();
    $rate = $result->fetch_assoc();

    $stmt->close();

    if (!$rate) {
        throw new Exception(
            "Ingen fraktkostnad finns för orderns vikt"
        );
    }

    return $rate;

}


// -----------------------------------------
// Räkna ut orderns vikt
// -----------------------------------------

try {

    $country = trim($data["country"]);
    $items = $data["items"];

    $totalWeight = 0;

    foreach ($items as $item) {

        if (
            !isset($item["product_id"]) ||
            trim($item["product_id"]) === ""
        ) {
            throw new Exception("Produkt-ID saknas");
        }

        $productId = trim($item["product_id"]);

        $quantity = isset($item["quantity"])
            ? (int) $item["quantity"]
            : 0;

        if ($quantity < 1) {
            throw new Exception("Ogiltigt antal");
        }


        // -----------------------------------------
        // Hämta produktens vikt
        // -----------------------------------------

        $productSql = "
            SELECT
                product_type,
                weight
            FROM products
            WHERE id = ?
            LIMIT 1
        ";

        $productStmt = $conn->prepare($productSql);

        $productStmt->bind_param(
            "s",
            $productId
        );

        $productStmt->execute();

        $productResult =
            $productStmt->get_result();

        $product =
            $productResult->fetch_assoc();

        $productStmt->close();

        if (!$product) {
            throw new Exception(
                "Produkten finns inte"
            );
        }

        $weight =
            (float) $product["weight"];


        // -----------------------------------------
        // EC-produkt:
        // använd variantens vikt om den finns
        // -----------------------------------------

        if ($product["product_type"] === "EC") {

            if (
                !isset($item["variant_id"]) ||
                trim($item["variant_id"]) === ""
            ) {
                throw new Exception(
                    "Variant saknas"
                );
            }

            $variantId =
                trim($item["variant_id"]);

            $variantSql = "
                SELECT weight
                FROM product_variants
                WHERE
                    id = ?
                    AND product_id = ?
                LIMIT 1
            ";

            $variantStmt =
                $conn->prepare($variantSql);

            $variantStmt->bind_param(
                "ss",
                $variantId,
                $productId
            );

            $variantStmt->execute();

            $variantResult =
                $variantStmt->get_result();

            $variant =
                $variantResult->fetch_assoc();

            $variantStmt->close();

            if (!$variant) {
                throw new Exception(
                    "Ogiltig variant"
                );
            }

            if (
                $variant["weight"] !== null &&
                (float) $variant["weight"] > 0
            ) {
                $weight =
                    (float) $variant["weight"];
            }
        }


        // Antal produkter påverkar totalvikten.
        $totalWeight +=
            $weight * $quantity;
    }


    // -----------------------------------------
    // Gram -> kilogram
    // -----------------------------------------

    $totalWeightKg =
        $totalWeight / 1000;


    // -----------------------------------------
    // Bestäm region
    // -----------------------------------------

    $region =
        getShippingRegion($country);


    // -----------------------------------------
    // Hämta rätt frakt från databasen
    // -----------------------------------------

    $shippingRate =
        getShippingRate(
            $conn,
            $region,
            $totalWeightKg
        );


    // -----------------------------------------
    // Skicka resultatet till frontend
    // -----------------------------------------

    http_response_code(200);

    echo json_encode([
        "success" => true,
        "currency" => "SEK",
        "shipping" =>
            (float) $shippingRate["price"],
        "carrier" =>
            $shippingRate["carrier"],
        "region" =>
            $region,
        "total_weight" =>
            $totalWeight,
        "total_weight_kg" =>
            $totalWeightKg
    ]);


} catch (Throwable $error) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte beräkna frakt"
    ]);
}