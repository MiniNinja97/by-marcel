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
require_once __DIR__ . "/../config/stripe.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Endast POST är tillåtet"
    ]);

    exit;
}

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!$data) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ingen giltig JSON skickades"
    ]);

    exit;
}


// -----------------------------------------
// Kontrollera grundläggande data
// -----------------------------------------

if (
    !isset($data["customer"]) ||
    !isset($data["items"]) ||
    !is_array($data["items"]) ||
    count($data["items"]) === 0
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Kund eller produkter saknas"
    ]);

    exit;
}

$customer = $data["customer"];
$items = $data["items"];


// -----------------------------------------
// Kontrollera kunduppgifter
// -----------------------------------------

$requiredCustomerFields = [
    "first_name",
    "last_name",
    "email"
];

foreach ($requiredCustomerFields as $field) {
    if (
        !isset($customer[$field]) ||
        trim($customer[$field]) === ""
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Kunduppgift saknas: " . $field
        ]);

        exit;
    }
}


// -----------------------------------------
// Hjälpfunktion: hämta färg från databasen
// -----------------------------------------

function getProductColor(
    mysqli $conn,
    string $productId,
    int $colorId
): ?array {

    $sql = "
        SELECT
            pc.id,
            pc.ral_code,
            pc.name,
            pc.background_code,
            pc.background_price,
            pc.print_code,
            pc.print_price
        FROM product_colors pc
        INNER JOIN product_color_links pcl
            ON pcl.color_id = pc.id
        WHERE
            pcl.product_id = ?
            AND pc.id = ?
        LIMIT 1
    ";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "si",
        $productId,
        $colorId
    );

    $stmt->execute();

    $result = $stmt->get_result();
    $color = $result->fetch_assoc();

    $stmt->close();

    return $color ?: null;
}


// -----------------------------------------
// Validera och räkna varje produkt
// SERVERN bestämmer pris och vikt
// -----------------------------------------

$validatedItems = [];

$subtotal = 0;
$totalWeight = 0;

try {

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
            throw new Exception(
                "Ogiltigt antal för produkt " . $productId
            );
        }


        // -----------------------------------------
        // Hämta produkten
        // -----------------------------------------

        $productSql = "
            SELECT
                id,
                name,
                product_type,
                base_price,
                weight,
                is_hidden,
                is_out_of_stock
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

        $productResult = $productStmt->get_result();
        $product = $productResult->fetch_assoc();

        $productStmt->close();

        if (!$product) {
            throw new Exception(
                "Produkten finns inte: " . $productId
            );
        }

        if ((int) $product["is_hidden"] === 1) {
            throw new Exception(
                "Produkten är inte tillgänglig: " . $productId
            );
        }

        if ((int) $product["is_out_of_stock"] === 1) {
            throw new Exception(
                "Produkten är slut i lager: " . $productId
            );
        }


        // -----------------------------------------
        // Grundvärden från databasen
        // -----------------------------------------

        $productName = $product["name"];
        $productType = $product["product_type"];

        $unitPrice = (float) $product["base_price"];
        $weight = (float) $product["weight"];

        $supplierId = null;

        $selectedSize =
            $item["selected_size"] ?? null;

        $selectedShape =
            $item["selected_shape"] ?? null;

        $selectedOptions =
            $item["selected_options"] ?? null;


        // -----------------------------------------
        // EC måste ha en giltig variant
        // -----------------------------------------

        if ($productType === "EC") {

            if (
                !isset($item["variant_id"]) ||
                trim($item["variant_id"]) === ""
            ) {
                throw new Exception(
                    "Variant saknas för " . $productId
                );
            }

            $variantId = trim($item["variant_id"]);

            $variantSql = "
                SELECT
                    id,
                    supplier_id,
                    price,
                    weight,
                    options
                FROM product_variants
                WHERE
                    id = ?
                    AND product_id = ?
                LIMIT 1
            ";

            $variantStmt = $conn->prepare(
                $variantSql
            );

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
                    "Ogiltig variant för " .
                    $productId
                );
            }


            // Pris och supplier-ID kommer från DB
            $unitPrice =
                (float) $variant["price"];

            $supplierId =
                $variant["supplier_id"];


            // Variantvikt används om den finns
            // och är större än 0.
            if (
                $variant["weight"] !== null &&
                (float) $variant["weight"] > 0
            ) {
                $weight =
                    (float) $variant["weight"];
            }


            // Variantens options är sanningen.
            $variantOptions = [];

            if (!empty($variant["options"])) {
                $decodedOptions =
                    json_decode(
                        $variant["options"],
                        true
                    );

                if (is_array($decodedOptions)) {
                    $variantOptions =
                        $decodedOptions;
                }
            }

            $selectedOptions =
                $variantOptions;

            $selectedSize =
                $variantOptions["size"]
                ?? $selectedSize;

            $selectedShape =
                $variantOptions["shape"]
                ?? $selectedShape;
        }


        // -----------------------------------------
        // Bakgrundsfärg
        // -----------------------------------------

        $selectedBackgroundColor = null;

        if (
            isset($item["selected_background_color"]) &&
            is_array(
                $item["selected_background_color"]
            )
        ) {

            $backgroundColorId =
                (int) (
                    $item[
                        "selected_background_color"
                    ]["id"] ?? 0
                );

            if ($backgroundColorId <= 0) {
                throw new Exception(
                    "Ogiltig bakgrundsfärg för " .
                    $productId
                );
            }

            $backgroundColor =
                getProductColor(
                    $conn,
                    $productId,
                    $backgroundColorId
                );

            if (!$backgroundColor) {
                throw new Exception(
                    "Bakgrundsfärgen är inte " .
                    "tillgänglig för " .
                    $productId
                );
            }

            $backgroundPrice =
                (float)
                $backgroundColor[
                    "background_price"
                ];

            $unitPrice += $backgroundPrice;

            $selectedBackgroundColor = [
                "name" =>
                    $backgroundColor["name"],

                "ral_code" =>
                    $backgroundColor["ral_code"],

                "supplier_code" =>
                    $backgroundColor[
                        "background_code"
                    ],

                "price" =>
                    $backgroundPrice
            ];
        }


        // -----------------------------------------
        // Tryckfärg
        // -----------------------------------------

        $selectedPrintColor = null;

        if (
            isset($item["selected_print_color"]) &&
            is_array(
                $item["selected_print_color"]
            )
        ) {

            $printColorId =
                (int) (
                    $item[
                        "selected_print_color"
                    ]["id"] ?? 0
                );

            if ($printColorId <= 0) {
                throw new Exception(
                    "Ogiltig tryckfärg för " .
                    $productId
                );
            }

            $printColor =
                getProductColor(
                    $conn,
                    $productId,
                    $printColorId
                );

            if (!$printColor) {
                throw new Exception(
                    "Tryckfärgen är inte " .
                    "tillgänglig för " .
                    $productId
                );
            }

            $printPrice =
                (float)
                $printColor["print_price"];

            $unitPrice += $printPrice;

            $selectedPrintColor = [
                "name" =>
                    $printColor["name"],

                "ral_code" =>
                    $printColor["ral_code"],

                "supplier_code" =>
                    $printColor[
                        "print_code"
                    ],

                "price" =>
                    $printPrice
            ];
        }


        // -----------------------------------------
        // EC med färger måste ha båda färgvalen
        // -----------------------------------------

        if ($productType === "EC") {

            $colorCountSql = "
                SELECT COUNT(*) AS color_count
                FROM product_color_links
                WHERE product_id = ?
            ";

            $colorCountStmt =
                $conn->prepare(
                    $colorCountSql
                );

            $colorCountStmt->bind_param(
                "s",
                $productId
            );

            $colorCountStmt->execute();

            $colorCountResult =
                $colorCountStmt->get_result();

            $colorCountRow =
                $colorCountResult->fetch_assoc();

            $colorCountStmt->close();

            $hasColors =
                (int) $colorCountRow[
                    "color_count"
                ] > 0;

            if (
                $hasColors &&
                (
                    !$selectedBackgroundColor ||
                    !$selectedPrintColor
                )
            ) {
                throw new Exception(
                    "Bakgrundsfärg och " .
                    "tryckfärg måste väljas för " .
                    $productId
                );
            }
        }


        // -----------------------------------------
        // Egna texter
        // -----------------------------------------

        $customTexts =
            isset($item["custom_texts"]) &&
            is_array($item["custom_texts"])
                ? $item["custom_texts"]
                : null;


        // -----------------------------------------
        // Spara serverns kontrollerade item
        // -----------------------------------------

        $validatedItems[] = [
            "product_id" =>
                $productId,

            "product_name" =>
                $productName,

            "supplier_id" =>
                $supplierId,

            "quantity" =>
                $quantity,

            "unit_price" =>
                $unitPrice,

            "weight" =>
                $weight,

            "selected_size" =>
                $selectedSize,

            "selected_shape" =>
                $selectedShape,

            "selected_color" =>
                null,

            "selected_background_color" =>
                $selectedBackgroundColor,

            "selected_print_color" =>
                $selectedPrintColor,

            "selected_font" =>
                $item["selected_font"] ?? null,

            "selected_options" =>
                $selectedOptions,

            "custom_text" =>
                $item["custom_text"] ?? null,

            "custom_texts" =>
                $customTexts
        ];


        // -----------------------------------------
        // Servern räknar totalsummorna
        // -----------------------------------------

        $subtotal +=
            $unitPrice * $quantity;

        $totalWeight +=
            $weight * $quantity;
    }


    // -----------------------------------------
    // Tillfällig frakt
    // Byts senare mot riktig fraktlösning
    // -----------------------------------------

    $shipping =
        $subtotal > 0 ? 79 : 0;

    $totalPrice =
        $subtotal + $shipping;


    // -----------------------------------------
    // Skapa ID:n
    // -----------------------------------------

    $customerId =
        "CUS-" . bin2hex(random_bytes(8));

    $orderId =
        "ORD-" . bin2hex(random_bytes(8));


    // -----------------------------------------
    // Börja databastransaktion
    // -----------------------------------------

    $conn->begin_transaction();


    // -----------------------------------------
    // Skapa kunden
    // -----------------------------------------

    $customerSql = "
        INSERT INTO customers (
            id,
            first_name,
            last_name,
            email,
            phone_number,
            address,
            city,
            state,
            zip_code,
            country
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $customerStmt =
        $conn->prepare($customerSql);

    $phoneNumber =
        $customer["phone_number"] ?? null;

    $address =
        $customer["address"] ?? null;

    $city =
        $customer["city"] ?? null;

    $state =
        $customer["state"] ?? null;

    $zipCode =
        $customer["zip_code"] ?? null;

    $country =
        $customer["country"] ?? null;

    $customerStmt->bind_param(
        "ssssssssss",
        $customerId,
        $customer["first_name"],
        $customer["last_name"],
        $customer["email"],
        $phoneNumber,
        $address,
        $city,
        $state,
        $zipCode,
        $country
    );

    $customerStmt->execute();
    $customerStmt->close();


    // -----------------------------------------
    // Skapa ordern
    // -----------------------------------------

    $status = "pending";

    // Ingen betalningsintegration ännu
    $stripePaymentId = null;

    $orderSql = "
        INSERT INTO orders (
            id,
            customer_id,
            subtotal,
            shipping,
            total_weight,
            total_price,
            status,
            stripe_payment_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $orderStmt =
        $conn->prepare($orderSql);

    $orderStmt->bind_param(
        "ssddddss",
        $orderId,
        $customerId,
        $subtotal,
        $shipping,
        $totalWeight,
        $totalPrice,
        $status,
        $stripePaymentId
    );

    $orderStmt->execute();
    $orderStmt->close();


    // -----------------------------------------
    // Skapa order_items
    // -----------------------------------------

    $itemSql = "
        INSERT INTO order_items (
            id,
            order_id,
            product_id,
            product_name,
            supplier_id,
            quantity,
            unit_price,
            weight,
            selected_size,
            selected_shape,
            selected_color,
            selected_background_color,
            selected_print_color,
            selected_font,
            selected_options,
            custom_photo_url,
            custom_text,
            custom_texts
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $itemStmt =
        $conn->prepare($itemSql);

    foreach ($validatedItems as $item) {

        $itemId =
            "ITEM-" .
            bin2hex(random_bytes(8));

        $productId =
            $item["product_id"];

        $productName =
            $item["product_name"];

        $supplierId =
            $item["supplier_id"];

        $quantity =
            $item["quantity"];

        $unitPrice =
            $item["unit_price"];

        $weight =
            $item["weight"];

        $selectedSize =
            $item["selected_size"];

        $selectedShape =
            $item["selected_shape"];

        $selectedColor =
            $item["selected_color"];


        $selectedBackgroundColor =
            $item[
                "selected_background_color"
            ] !== null
                ? json_encode(
                    $item[
                        "selected_background_color"
                    ],
                    JSON_UNESCAPED_UNICODE
                )
                : null;


        $selectedPrintColor =
            $item[
                "selected_print_color"
            ] !== null
                ? json_encode(
                    $item[
                        "selected_print_color"
                    ],
                    JSON_UNESCAPED_UNICODE
                )
                : null;


        $selectedFont =
            $item["selected_font"];


        $selectedOptions =
            $item["selected_options"] !== null
                ? json_encode(
                    $item["selected_options"],
                    JSON_UNESCAPED_UNICODE
                )
                : null;


        // Bilduppladdning tar vi senare
        $customPhotoUrl = null;


        $customText =
            $item["custom_text"];


        $customTexts =
            $item["custom_texts"] !== null
                ? json_encode(
                    $item["custom_texts"],
                    JSON_UNESCAPED_UNICODE
                )
                : null;


        $itemStmt->bind_param(
            "sssssiddssssssssss",
            $itemId,
            $orderId,
            $productId,
            $productName,
            $supplierId,
            $quantity,
            $unitPrice,
            $weight,
            $selectedSize,
            $selectedShape,
            $selectedColor,
            $selectedBackgroundColor,
            $selectedPrintColor,
            $selectedFont,
            $selectedOptions,
            $customPhotoUrl,
            $customText,
            $customTexts
        );

        $itemStmt->execute();
    }

    $itemStmt->close();


    // -----------------------------------------
    // Allt lyckades
    // -----------------------------------------

    $conn->commit();

    $checkoutSession = \Stripe\Checkout\Session::create([
    "mode" => "payment",

    "customer_email" => $customer["email"],

    "line_items" => [
        [
            "price_data" => [
                "currency" => "sek",

                "product_data" => [
                    "name" => "Order " . $orderId,
                ],

                "unit_amount" => (int) round($totalPrice * 100),
            ],

            "quantity" => 1,
        ],
    ],

    "metadata" => [
        "order_id" => $orderId,
    ],

    "success_url" =>
        "https://www.bymarcel.se/#/betalning-klar?session_id={CHECKOUT_SESSION_ID}",

    "cancel_url" =>
        "https://www.bymarcel.se/#/betalning",
]);

    http_response_code(201);

   echo json_encode([
    "success" => true,
    "message" => "Order skapad",
    "currency" => "SEK",
    "order_id" => $orderId,
    "customer_id" => $customerId,
    "subtotal" => $subtotal,
    "shipping" => $shipping,
    "total_price" => $totalPrice,
    "checkout_url" => $checkoutSession->url
]);


} catch (Throwable $error) {

    // Rollback bara om en transaktion faktiskt är aktiv.
    try {
        $conn->rollback();
    } catch (Throwable $rollbackError) {
        // Ingenting behöver göras här.
    }

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte skapa order",
        "error" => $error->getMessage()
    ]);
}