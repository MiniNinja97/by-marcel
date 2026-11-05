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
require_once __DIR__ . "/order-number.php";
require_once __DIR__ . "/send-order-email.php";
require_once __DIR__ . "/send-customer-email.php";

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

$allowedSiteOrigins = [
    "https://test.bymarcel.se",
    "https://www.bymarcel.se",
    "https://bymarcel.se",
    "http://localhost:5173"
];

$siteOrigin = $data["site_origin"] ?? "";

if (!in_array($siteOrigin, $allowedSiteOrigins, true)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ogiltig webbplatsadress"
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
// Kundens språkval
// -----------------------------------------

$language = $data["language"] ?? "sv";

if (!in_array($language, ["sv", "en"], true)) {
    $language = "sv";
}

// $customerNotes = $data["customer_notes"] ?? null;
// if ($customerNotes !== null) {
//     if (!is_string($customerNotes)) {
//         throw new InvalidArgumentException("Ogiltigt format för önskemål.");
//     }

//     $customerNotes = trim($customerNotes);

//     if (mb_strlen($customerNotes, "UTF-8") > 1000) {
//         throw new InvalidArgumentException("Önskemålet får innehålla högst 1000 tecken.");
//     }

//     if ($customerNotes === "") {
//         $customerNotes = null;
//     }
// }

$discountCode = strtoupper(
    trim($data["discount_code"] ?? "")
);

$giftCardCode = strtoupper(
    trim($data["gift_card_code"] ?? "")
);


// -----------------------------------------
// Kontrollera kunduppgifter
// -----------------------------------------

$requiredCustomerFields = [
    "first_name",
    "last_name",
    "email",
    "country"
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
// Hjälpfunktion: bestäm fraktregion från land
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
// Hjälpfunktion: hämta fraktpris från DB
// -----------------------------------------

function getShippingRate(
    mysqli $conn,
    string $region,
    float $weightKg
): array {

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

if (
    $productType === "gift_card" &&
    $quantity !== 1
) {
    throw new Exception(
        "Presentkort måste beställas ett i taget"
    );
}

$unitPrice = (float) $product["base_price"];
$weight = (float) $product["weight"];

// -----------------------------------------
// Mängdpriser för KT-produkter
// -----------------------------------------

if ($productType === "KT") {

    $quantityPriceSql = "
        SELECT unit_price
        FROM product_quantity_prices
        WHERE product_id = ?
          AND min_quantity <= ?
          AND (max_quantity IS NULL OR max_quantity >= ?)
        ORDER BY min_quantity DESC
        LIMIT 1
    ";

    $quantityPriceStmt = $conn->prepare($quantityPriceSql);

    $quantityPriceStmt->bind_param(
        "sii",
        $productId,
        $quantity,
        $quantity
    );

    $quantityPriceStmt->execute();

    $quantityPriceResult = $quantityPriceStmt->get_result();
    $quantityPrice = $quantityPriceResult->fetch_assoc();

    $quantityPriceStmt->close();

    if (!$quantityPrice) {
        throw new Exception(
            "Mängdpris saknas för " . $productId
        );
    }

    $unitPrice = (float) $quantityPrice["unit_price"];
}

$supplierId = null;

$selectedSize =
    $item["selected_size"] ?? null;

$selectedShape =
    $item["selected_shape"] ?? null;

$selectedOptions =
    $item["selected_options"] ?? null;

   // -----------------------------------------
// Kontrollera obligatoriska KT-val
// -----------------------------------------

if ($productType === "KT") {

    if (!is_array($selectedOptions)) {
        throw new Exception(
            "Produktval saknas för " . $productId
        );
    }

    $requiredKtOptions = [
        "motiv",
        "material",
        "yta"
    ];

    // Kontrollera att alla val finns
    foreach ($requiredKtOptions as $optionName) {

        if (
            !isset($selectedOptions[$optionName]) ||
            !is_scalar($selectedOptions[$optionName]) ||
            (string) $selectedOptions[$optionName] === ""
        ) {
            throw new Exception(
                "Produktval saknas: " .
                $optionName .
                " för " .
                $productId
            );
        }
    }

    // -----------------------------------------
    // Kontrollera KT-val mot databasen
    // -----------------------------------------

    foreach ($requiredKtOptions as $optionName) {

        $selectedValue = (string) $selectedOptions[$optionName];

        $validOptionSql = "
            SELECT pov.id
            FROM product_option_values pov
            INNER JOIN product_options po
                ON po.id = pov.option_id
            WHERE po.product_id = ?
              AND po.option_name = ?
              AND pov.value = ?
            LIMIT 1
        ";

        $validOptionStmt = $conn->prepare($validOptionSql);

        $validOptionStmt->bind_param(
            "sss",
            $productId,
            $optionName,
            $selectedValue
        );

        $validOptionStmt->execute();

        $validOptionResult = $validOptionStmt->get_result();
        $validOption = $validOptionResult->fetch_assoc();

        $validOptionStmt->close();

        if (!$validOption) {
            throw new Exception(
                "Ogiltigt produktval: " .
                $optionName .
                " för " .
                $productId
            );
        }
    }
}

$isImageEngraving = in_array(
    $productId,
    ["LFG.TRA", "LFG.DEK"],
    true
);

            // -----------------------------------------
// Presentkort
// -----------------------------------------

if ($productType === "gift_card") {

    if (
        !is_array($selectedOptions) ||
        !isset($selectedOptions["amount"])
    ) {
        throw new Exception(
            "Belopp saknas för presentkortet"
        );
    }

    $giftCardAmount =
    (int) $selectedOptions["amount"];

    $allowedGiftCardAmounts = [
        500,
        750,
        1000,
        1250,
        1500,
        1750,
        2000,
        2500
    ];

    if (
        !in_array(
            $giftCardAmount,
            $allowedGiftCardAmounts,
            true
        )
    ) {
        throw new Exception(
            "Ogiltigt presentkortsbelopp"
        );
    }

    $unitPrice += $giftCardAmount;

  
}


        // -----------------------------------------
        // EC måste ha en giltig variant
        // -----------------------------------------

      if ($productType === "EC" || $isImageEngraving) {

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

            if ($productType === "EC") {
    $selectedOptions = $variantOptions;
}

$selectedSize =
    $variantOptions["size"]
    ?? $selectedSize;

$selectedShape =
    $variantOptions["shape"]
    ?? $selectedShape;


if ($isImageEngraving) {

    if (
        !is_array($selectedOptions) ||
        !isset($selectedOptions["shape"]) ||
        !isset($selectedOptions["size"])
    ) {
        throw new Exception(
            "Form eller storlek saknas för " . $productId
        );
    }

    if (
        (string) $selectedOptions["shape"] !==
            (string) ($variantOptions["shape"] ?? "") ||
        (string) $selectedOptions["size"] !==
            (string) ($variantOptions["size"] ?? "")
    ) {
        throw new Exception(
            "Vald form eller storlek stämmer inte med varianten för " .
            $productId
        );
    }

    // Shape och size kommer från den verifierade varianten
    $selectedOptions["shape"] =
        $variantOptions["shape"];

    $selectedOptions["size"] =
        $variantOptions["size"];


    // -----------------------------------------
    // Kontrollera obligatoriska produktval
    // -----------------------------------------

    $requiredWoodOptions = $productId === "LFG.TRA"
    ? [
        "shape",
        "size",
        "surface",
        "wall_mount",
        "wooden_stand"
    ]
    : [
        "shape",
        "size",
        "wall_mount",
        "wooden_stand"
    ];

    if (
        $selectedOptions["shape"] === "rectangle" ||
        $selectedOptions["shape"] === "oval"
    ) {
        $requiredWoodOptions[] = "orientation";
    }


    // -----------------------------------------
    // Kontrollera att alla obligatoriska val finns
    // -----------------------------------------

    foreach ($requiredWoodOptions as $requiredOption) {

        if (
            !isset($selectedOptions[$requiredOption]) ||
            $selectedOptions[$requiredOption] === ""
        ) {
            throw new Exception(
                "Produktval saknas: " .
                $requiredOption .
                " för " .
                $productId
            );
        }
    }


    // -----------------------------------------
    // Kontrollera att valen är giltiga i databasen
    // -----------------------------------------

    foreach ($requiredWoodOptions as $requiredOption) {

        $selectedValue =
            (string) $selectedOptions[$requiredOption];

        $validOptionSql = "
            SELECT pov.id
            FROM product_option_values pov
            INNER JOIN product_options po
                ON po.id = pov.option_id
            WHERE
                po.product_id = ?
                AND po.option_name = ?
                AND pov.value = ?
            LIMIT 1
        ";

        $validOptionStmt =
            $conn->prepare($validOptionSql);

        $validOptionStmt->bind_param(
            "sss",
            $productId,
            $requiredOption,
            $selectedValue
        );

        $validOptionStmt->execute();

        $validOptionResult =
            $validOptionStmt->get_result();

        $validOption =
            $validOptionResult->fetch_assoc();

        $validOptionStmt->close();

        if (!$validOption) {
            throw new Exception(
                "Ogiltigt produktval: " .
                $requiredOption .
                " för " .
                $productId
            );
        }
    }

    // $optionPriceSql = "
    //     SELECT
    //         option_name,
    //         option_value,
    //         price_delta
    //     FROM product_variant_option_prices
    //     WHERE variant_id = ?
    // ";

    // $optionPriceStmt = $conn->prepare($optionPriceSql);
    // $optionPriceStmt->bind_param("s", $variantId);
    // $optionPriceStmt->execute();

    // $optionPriceResult = $optionPriceStmt->get_result();

    // while ($optionPrice = $optionPriceResult->fetch_assoc()) {

    //     $optionName = $optionPrice["option_name"];
    //     $optionValue = $optionPrice["option_value"];
    //     $priceDelta = (float) $optionPrice["price_delta"];

    //     if (
    //         isset($selectedOptions[$optionName]) &&
    //         (string) $selectedOptions[$optionName] ===
    //         (string) $optionValue
    //     ) {
    //         $unitPrice += $priceDelta;
    //     }
    // }

    // $optionPriceStmt->close();
}

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
// Övriga önskemål för produkten
// -----------------------------------------

$additionalRequests = $item["additional_requests"] ?? null;

if ($additionalRequests !== null) {
    if (!is_string($additionalRequests)) {
        throw new Exception("Ogiltigt format för övriga önskemål.");
    }

    $additionalRequests = trim($additionalRequests);

    if (mb_strlen($additionalRequests, "UTF-8") > 1000) {
        throw new Exception(
            "Övriga önskemål får innehålla högst 1000 tecken."
        );
    }

    if ($additionalRequests === "") {
        $additionalRequests = null;
    }
}

// -----------------------------------------
// Validering för KT-produkter
// -----------------------------------------

if ($productType === "KT") {

    // -----------------------------------------
    // Kontrollera textfältens längd
    // -----------------------------------------

    $allowedTextFields = [
        "utskuren_text" => 10,
        "graverad_text" => 35
    ];

    if (
        isset($item["custom_texts"]) &&
        !is_array($item["custom_texts"])
    ) {
        throw new Exception(
            "Ogiltigt format för kundens texter."
        );
    }

    foreach ($customTexts ?? [] as $fieldName => $text) {

        if (!array_key_exists($fieldName, $allowedTextFields)) {
            throw new Exception(
                "Ogiltigt textfält för " . $productId
            );
        }

        if (!is_string($text)) {
            throw new Exception(
                "Ogiltig text för " . $fieldName
            );
        }

        if (
            mb_strlen($text, "UTF-8") >
            $allowedTextFields[$fieldName]
        ) {
            throw new Exception(
                "Texten är för lång för " . $fieldName
            );
        }
    }

    // -----------------------------------------
    // Tillåtna textfält beroende på motiv
    // -----------------------------------------

    $motivValue = $selectedOptions["motiv"] ?? null;

    if (
        !is_scalar($motivValue) ||
        !preg_match('/^(?:[1-9]|1[0-9]|2[0-2])$/', (string) $motivValue)
    ) {
        throw new Exception("Ogiltigt motiv för KT-produkten.");
    }

    $motiv = (int) $motivValue;

    $allowsCutText =
        ($motiv >= 1 && $motiv <= 12) ||
        $motiv === 14 ||
        ($motiv >= 17 && $motiv <= 21);

    $allowsEngravedText =
        in_array($motiv, [13, 15, 16, 21], true);

    // -----------------------------------------
    // Kontrollera otillåtna textfält
    // -----------------------------------------

    if (
        !$allowsCutText &&
        trim($customTexts["utskuren_text"] ?? "") !== ""
    ) {
        throw new Exception(
            "Utskuren text är inte tillåten för motiv " . $motiv
        );
    }

    if (
        !$allowsEngravedText &&
        trim($customTexts["graverad_text"] ?? "") !== ""
    ) {
        throw new Exception(
            "Graverad text är inte tillåten för motiv " . $motiv
        );
    }

    // -----------------------------------------
    // Kontrollera obligatoriska textfält
    // -----------------------------------------

    if (
        $allowsCutText &&
        trim($customTexts["utskuren_text"] ?? "") === ""
    ) {
        throw new Exception(
            "Du måste ange utskuren text för motiv " . $motiv
        );
    }

    if (
        $allowsEngravedText &&
        trim($customTexts["graverad_text"] ?? "") === ""
    ) {
        throw new Exception(
            "Du måste ange graverad text för motiv " . $motiv
        );
    }

    // -----------------------------------------
    // Validera egen design för KT-produkter
    // -----------------------------------------

    $customPhotoUrl = $item["custom_photo_url"] ?? null;

    if ($motiv === 22) {

        // Motiv 22 kräver en uppladdad bild
        if (
            !is_string($customPhotoUrl) ||
            trim($customPhotoUrl) === ""
        ) {
            throw new Exception(
                "Du måste ladda upp en bild för motiv 22."
            );
        }

        // Endast JPG tillåts för motiv 22
        if (
            !preg_match(
                '~^/uploads/customerUploads/[a-f0-9]{32}\.jpg$~i',
                $customPhotoUrl
            )
        ) {
            throw new Exception(
                "Egen design för KT-produkter måste vara en JPG-bild."
            );
        }

    } else {

        // Övriga motiv får inte ha en egen design
        if (
            $customPhotoUrl !== null &&
            $customPhotoUrl !== ""
        ) {
            throw new Exception(
                "Egen design är endast tillåten för motiv 22."
            );
        }
    }
}

// -----------------------------------------
// Validera bilder för gravyrprodukter
// -----------------------------------------

$customPhotoUrls = null;

if ($isImageEngraving) {

    $customPhotoUrls = $item["custom_photo_urls"] ?? null;

    if (
        !is_array($customPhotoUrls) ||
        !array_is_list($customPhotoUrls) ||
        count($customPhotoUrls) < 1 ||
        count($customPhotoUrls) > 3
    ) {
        throw new Exception(
            "Du måste ladda upp mellan 1 och 3 bilder för " . $productId
        );
    }

    foreach ($customPhotoUrls as $photoUrl) {

        if (
            !is_string($photoUrl) ||
            !preg_match(
                '~^/uploads/customerUploads/[a-f0-9]{32}\.(jpg|png|webp)$~i',
                $photoUrl
            )
        ) {
            throw new Exception(
                "Ogiltig bildadress för " . $productId
            );
        }

        $filename = basename($photoUrl);

        $imagePath = __DIR__ . "/../../uploads/customerUploads/" . $filename;

        if (!is_file($imagePath)) {
            throw new Exception(
                "En uppladdad bild saknas för " . $productId
            );
        }
    }
}


        // -----------------------------------------
        // Spara serverns kontrollerade item
        // -----------------------------------------

        $validatedItems[] = [
            "product_id" =>
                $productId,
                "product_type" =>
    $productType,

            "product_name" =>
                $productName,

            "supplier_id" =>
                $supplierId,
                "gift_card_amount" =>
    $productType === "gift_card"
        ? $giftCardAmount
        : null,

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
    $customTexts,

"additional_requests" =>
    $additionalRequests,

"custom_photo_url" =>
    $item["custom_photo_url"] ?? null,

"custom_photo_urls" =>
    $customPhotoUrls
        ];


        // -----------------------------------------
        // Servern räknar totalsummorna
        // -----------------------------------------

        $subtotal +=
            $unitPrice * $quantity;

        $totalWeight += $weight * $quantity;
    }
// -----------------------------------------
// Validera rabattkod
// -----------------------------------------

$discountAmount = 0;

// -----------------------------------------
// Räkna ut rabattgrundande belopp
// Presentkort ska aldrig kunna rabatteras
// -----------------------------------------

$discountableSubtotal = 0;

foreach ($validatedItems as $item) {
    if ($item["product_type"] !== "gift_card") {
        $discountableSubtotal +=
            $item["unit_price"] *
            $item["quantity"];
    }
}


if ($discountCode !== "") {

    // Rabattkod får inte användas om ordern
    // endast innehåller presentkort.
    if ($discountableSubtotal <= 0) {
        throw new Exception(
            "Rabattkod kan inte användas på presentkort"
        );
    }


    $discountStmt = $conn->prepare("
        SELECT
            code,
            type,
            value,
            active,
            valid_from,
            valid_until,
            minimum_order
        FROM discount_codes
        WHERE code = ?
        LIMIT 1
    ");

    $discountStmt->bind_param(
        "s",
        $discountCode
    );

    $discountStmt->execute();

    $discountResult =
        $discountStmt->get_result();

    $discount =
        $discountResult->fetch_assoc();

    $discountStmt->close();


    if (!$discount) {
        throw new Exception(
            "Rabattkoden finns inte"
        );
    }


    if (!(bool) $discount["active"]) {
        throw new Exception(
            "Rabattkoden är inte aktiv"
        );
    }


    $now = new DateTime();

    if (
        $discount["valid_from"] !== null &&
        $now < new DateTime(
            $discount["valid_from"]
        )
    ) {
        throw new Exception(
            "Rabattkoden gäller inte ännu"
        );
    }


    if (
        $discount["valid_until"] !== null &&
        $now > new DateTime(
            $discount["valid_until"]
        )
    ) {
        throw new Exception(
            "Rabattkoden har gått ut"
        );
    }


    $minimumOrder =
        $discount["minimum_order"] !== null
            ? (float) $discount["minimum_order"]
            : null;


    if (
        $minimumOrder !== null &&
        $discountableSubtotal < $minimumOrder
    ) {
        throw new Exception(
            "Rabattkoden kräver ett rabattgrundande ordervärde på minst " .
            $minimumOrder .
            " SEK"
        );
    }


    $discountValue =
        (float) $discount["value"];


    if ($discount["type"] === "percent") {

        $discountAmount =
            $discountableSubtotal *
            ($discountValue / 100);

    } else {

        $discountAmount =
            $discountValue;
    }


    // Rabatten får aldrig bli större än
    // värdet på de vanliga produkterna.
    $discountAmount = min(
        $discountAmount,
        $discountableSubtotal
    );

    $discountAmount = round(
        $discountAmount,
        2
    );
}
// -----------------------------------------
// Börja databastransaktion
// -----------------------------------------

$conn->begin_transaction();

// -----------------------------------------
// Validera presentkort
// -----------------------------------------

$giftCardBalance = 0;

// -----------------------------------------
// Presentkort får inte användas för att
// köpa ett nytt presentkort
// -----------------------------------------

$containsGiftCardProduct = false;

foreach ($validatedItems as $item) {
    if ($item["product_type"] === "gift_card") {
        $containsGiftCardProduct = true;
        break;
    }
}

if (
    $giftCardCode !== "" &&
    $containsGiftCardProduct
) {
    throw new Exception(
        "Presentkort kan inte användas för att köpa presentkort"
    );
}


// -----------------------------------------
// Validera presentkort som betalningsmedel
// -----------------------------------------

if ($giftCardCode !== "") {

    $giftCardStmt = $conn->prepare("
    SELECT
        id,
        remaining_balance,
        status
    FROM gift_cards
    WHERE code = ?
    LIMIT 1
    FOR UPDATE
");

    $giftCardStmt->bind_param(
        "s",
        $giftCardCode
    );

    $giftCardStmt->execute();

    $giftCardResult =
        $giftCardStmt->get_result();

    $giftCard =
        $giftCardResult->fetch_assoc();

    $giftCardStmt->close();

    if (!$giftCard) {
        throw new Exception(
            "Presentkortskoden finns inte"
        );
    }

    if ($giftCard["status"] !== "active") {
        throw new Exception(
            "Presentkortet är inte aktivt"
        );
    }

    $giftCardId =
    (int) $giftCard["id"];

$giftCardBalance =
    (float) $giftCard["remaining_balance"];

$reservedStmt = $conn->prepare("
    SELECT COALESCE(SUM(amount), 0) AS reserved_amount
    FROM gift_card_redemptions
    WHERE gift_card_id = ?
    AND status = 'reserved'
");

$reservedStmt->bind_param(
    "i",
    $giftCardId
);

$reservedStmt->execute();

$reservedResult =
    $reservedStmt->get_result();

$reservedData =
    $reservedResult->fetch_assoc();

$reservedStmt->close();

$reservedAmount =
    (float) $reservedData["reserved_amount"];

$giftCardBalance = max(
    0,
    $giftCardBalance - $reservedAmount
);

if ($giftCardBalance <= 0) {
    throw new Exception(
        "Presentkortet saknar tillgängligt saldo"
    );
}
}
    // -----------------------------------------
// Beräkna frakt
// -----------------------------------------

if (
    !isset($customer["country"]) ||
    trim($customer["country"]) === ""
) {
    throw new Exception(
        "Land måste anges för att beräkna frakt"
    );
}


// Produktvikterna lagras i gram.
// Frakttabellen använder kilogram.
$totalWeightKg = $totalWeight / 1000;


// Om ordern endast innehåller presentkort
// ska ingen extra frakt tas ut.
if ($totalWeightKg <= 0) {

    $shipping = 0;
    $shippingCarrier = "Included";

} else {

    // Bestäm region från kundens land.
    $shippingRegion =
        getShippingRegion($customer["country"]);


    // Hämta rätt fraktpris från databasen.
    $shippingRate =
        getShippingRate(
            $conn,
            $shippingRegion,
            $totalWeightKg
        );


    $shipping =
        (float) $shippingRate["price"];

    $shippingCarrier =
        $shippingRate["carrier"];
}


$totalBeforeGiftCard =
    $subtotal
    - $discountAmount
    + $shipping;

$giftCardAmount = 0;

if ($giftCardCode !== "") {
    $giftCardAmount = min(
        $giftCardBalance,
        $totalBeforeGiftCard
    );
}

$giftCardAmount = round(
    $giftCardAmount,
    2
);

$totalPrice = max(
    0,
    $totalBeforeGiftCard - $giftCardAmount
);
    // -----------------------------------------
    // Skapa ID:n
    // -----------------------------------------

    $customerId =
        "CUS-" . bin2hex(random_bytes(8));

    $orderId =
        "ORD-" . bin2hex(random_bytes(8));


    


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
        discount_code,
        discount_amount,
        shipping,
        total_weight,
        total_price,
        status,
        stripe_payment_id,
        language
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
";

    $orderStmt =
        $conn->prepare($orderSql);

  $orderStmt->bind_param(
    "ssdsddddsss",
    $orderId,
    $customerId,
    $subtotal,
    $discountCode,
    $discountAmount,
    $shipping,
    $totalWeight,
    $totalPrice,
    $status,
    $stripePaymentId,
    $language
);

    $orderStmt->execute();
    $orderStmt->close();

    // -----------------------------------------
// Reservera presentkort
// -----------------------------------------

if ($giftCardCode !== "" && $giftCardAmount > 0) {

    $giftCardIdStmt = $conn->prepare("
        SELECT id
        FROM gift_cards
        WHERE code = ?
        LIMIT 1
    ");

    $giftCardIdStmt->bind_param(
        "s",
        $giftCardCode
    );

    $giftCardIdStmt->execute();

    $giftCardIdResult =
        $giftCardIdStmt->get_result();

    $giftCardData =
        $giftCardIdResult->fetch_assoc();

    $giftCardIdStmt->close();

    if (!$giftCardData) {
        throw new Exception(
            "Presentkortet kunde inte hittas"
        );
    }

    $giftCardId =
        (int) $giftCardData["id"];

    $redemptionStmt = $conn->prepare("
        INSERT INTO gift_card_redemptions (
            gift_card_id,
            order_id,
            amount,
            status
        )
        VALUES (?, ?, ?, 'reserved')
    ");

    $redemptionStmt->bind_param(
        "isd",
        $giftCardId,
        $orderId,
        $giftCardAmount
    );

    $redemptionStmt->execute();
    $redemptionStmt->close();
}


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
        custom_photo_urls,
        custom_text,
        custom_texts,
        additional_requests
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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


       // Kundens uppladdade bild eller skiss
$customPhotoUrl = $item["custom_photo_url"] ?? null;

if ($customPhotoUrl !== null) {
    if (
        !is_string($customPhotoUrl) ||
        strlen($customPhotoUrl) > 500 ||
        !preg_match(
            '~^/uploads/customerUploads/[a-f0-9]{32}\.(jpg|png|webp)$~',
            $customPhotoUrl
        )
    ) {
        throw new Exception("Ogiltig sökväg för kundbild.");
    }

    $filename = basename($customPhotoUrl);

    $imagePath = __DIR__ . "/../../uploads/customerUploads/" . $filename;

    if (!is_file($imagePath)) {
        throw new Exception("Den uppladdade kundbilden saknas.");
    }
}

// Kundens uppladdade bilder för bildgravyr
$customPhotoUrls = $item["custom_photo_urls"] !== null
    ? json_encode(
        $item["custom_photo_urls"],
        JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
    )
    : null;


        $customText =
            $item["custom_text"];


        $customTexts =
    $item["custom_texts"] !== null
        ? json_encode(
            $item["custom_texts"],
            JSON_UNESCAPED_UNICODE
        )
        : null;

$additionalRequests = $item["additional_requests"] ?? null;


        $itemStmt->bind_param(
    "sssssiddssssssssssss",
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
    $customPhotoUrls,
    $customText,
    $customTexts,
    $additionalRequests
);

        $itemStmt->execute();

        // -----------------------------------------
// Skapa presentkortskod
// -----------------------------------------

if ($item["gift_card_amount"] !== null) {

    $giftCardCode =
        "BM-" .
        strtoupper(bin2hex(random_bytes(2))) .
        "-" .
        strtoupper(bin2hex(random_bytes(2)));

    $giftCardAmount =
    (float) $item["gift_card_amount"];

    $giftCardStmt = $conn->prepare("
        INSERT INTO gift_cards (
            code,
            order_id,
            order_item_id,
            initial_amount,
            remaining_balance,
            status
        )
        VALUES (?, ?, ?, ?, ?, 'pending')
    ");

    $giftCardStmt->bind_param(
        "sssdd",
        $giftCardCode,
        $orderId,
        $itemId,
        $giftCardAmount,
        $giftCardAmount
    );

    $giftCardStmt->execute();
    $giftCardStmt->close();
}
    }

    $itemStmt->close();


    // -----------------------------------------
    // Allt lyckades
    // -----------------------------------------

   
$checkoutSession = null;

if ($totalPrice > 0) {

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

                    "unit_amount" =>
                        (int) round($totalPrice * 100),
                ],

                "quantity" => 1,
            ],
        ],

        "metadata" => [
            "order_id" => $orderId,
        ],

       "success_url" =>
    $siteOrigin . "/#/betalning-klar?session_id={CHECKOUT_SESSION_ID}",

"cancel_url" =>
    $siteOrigin . "/#/payment",
    ]);

} else {

    // -----------------------------------------
    // Presentkortet täcker hela ordern
    // -----------------------------------------

    $paidOrderStmt = $conn->prepare("
        UPDATE orders
        SET status = 'processing'
        WHERE id = ?
        AND status = 'pending'
    ");

    $paidOrderStmt->bind_param(
        "s",
        $orderId
    );

    $paidOrderStmt->execute();
    $paidOrderStmt->close();

    // -----------------------------------------
// Skapa ordernummer vid full presentkortsbetalning
// -----------------------------------------

$orderNumber = generateOrderNumber($conn);

$numberStmt = $conn->prepare("
    UPDATE orders
    SET order_number = ?
    WHERE id = ?
    AND status = 'processing'
    AND order_number IS NULL
");

$numberStmt->bind_param(
    "ss",
    $orderNumber,
    $orderId
);

$numberStmt->execute();

if ($numberStmt->affected_rows !== 1) {
    throw new RuntimeException(
        "Ordernummer kunde inte sparas"
    );
}

$numberStmt->close();


    // -----------------------------------------
    // Slutför presentkortsreservationen
    // -----------------------------------------

    $redemptionStmt = $conn->prepare("
        SELECT
            id,
            gift_card_id,
            amount
        FROM gift_card_redemptions
        WHERE order_id = ?
        AND status = 'reserved'
        FOR UPDATE
    ");

    $redemptionStmt->bind_param(
        "s",
        $orderId
    );

    $redemptionStmt->execute();

    $redemptionResult =
        $redemptionStmt->get_result();

    while (
        $redemption =
            $redemptionResult->fetch_assoc()
    ) {
        $redemptionId =
            (int) $redemption["id"];

        $giftCardId =
            (int) $redemption["gift_card_id"];

        $amount =
            (float) $redemption["amount"];


        // -----------------------------------------
        // Markera reservationen som slutförd först
        // -----------------------------------------

        $completeStmt = $conn->prepare("
            UPDATE gift_card_redemptions
            SET
                status = 'completed',
                completed_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND status = 'reserved'
        ");

        $completeStmt->bind_param(
            "i",
            $redemptionId
        );

        $completeStmt->execute();

        $wasCompleted =
            $completeStmt->affected_rows === 1;

        $completeStmt->close();


        // -----------------------------------------
        // Dra saldot endast om reservationen
        // faktiskt ändrades till completed
        // -----------------------------------------

        if ($wasCompleted) {

            $updateGiftCardStmt = $conn->prepare("
    UPDATE gift_cards
    SET
        status =
            CASE
                WHEN remaining_balance - ? <= 0
                    THEN 'used'
                ELSE 'active'
            END,
        remaining_balance =
            GREATEST(
                0,
                remaining_balance - ?
            )
    WHERE id = ?
");

$updateGiftCardStmt->bind_param(
    "ddi",
    $amount,
    $amount,
    $giftCardId
);

            $updateGiftCardStmt->execute();
            $updateGiftCardStmt->close();
        }
    }

    $redemptionStmt->close();
}


// -----------------------------------------
// Stripe-sessionen skapades korrekt,
// eller ordern betalades helt med presentkort.
// Nu kan ordern sparas permanent.
// -----------------------------------------

$conn->commit();

// -----------------------------------------
// Skicka ordermejl vid full presentkortsbetalning
// -----------------------------------------

if ($totalPrice <= 0) {

    try {
        // Reservera mejlutskicket så att det inte
        // kan startas två gånger för samma order.
        $emailStmt = $conn->prepare("
            UPDATE orders
            SET order_email_status = 'sending',
                order_email_started_at = NOW()
            WHERE id = ?
              AND status = 'processing'
              AND order_email_status = 'pending'
        ");

        $emailStmt->bind_param("s", $orderId);
        $emailStmt->execute();

        $shouldSendEmail = $emailStmt->affected_rows === 1;

        $emailStmt->close();

        if ($shouldSendEmail) {

            $emailSent = sendOrderEmail($conn, $orderId);

            if ($emailSent) {
                $sentStmt = $conn->prepare("
                    UPDATE orders
                    SET order_email_status = 'sent',
                        order_email_sent_at = NOW()
                    WHERE id = ?
                      AND order_email_status = 'sending'
                ");

                $sentStmt->bind_param("s", $orderId);
                $sentStmt->execute();
                $sentStmt->close();

            } else {
                error_log(
                    "Ordermejl kunde inte skickas för order " . $orderId
                );
            }
        }

    } catch (Throwable $emailError) {
        error_log(
            "ORDER EMAIL ERROR: " . $emailError->getMessage()
        );
    }
}

// -----------------------------------------
// Skicka kundens orderbekräftelse vid
// full presentkortsbetalning
// -----------------------------------------

if ($totalPrice <= 0) {

    try {
        // Reservera kundmejlet
        $customerEmailStmt = $conn->prepare("
            UPDATE orders
            SET customer_email_status = 'sending',
                customer_email_started_at = NOW()
            WHERE id = ?
              AND status = 'processing'
              AND customer_email_status = 'pending'
        ");

        $customerEmailStmt->bind_param("s", $orderId);
        $customerEmailStmt->execute();

        $shouldSendCustomerEmail =
            $customerEmailStmt->affected_rows === 1;

        $customerEmailStmt->close();

        if ($shouldSendCustomerEmail) {

            $customerEmailSent = sendCustomerEmail(
                $conn,
                $orderId
            );

            if ($customerEmailSent) {

                $sentStmt = $conn->prepare("
                    UPDATE orders
                    SET customer_email_status = 'sent',
                        customer_email_sent_at = NOW()
                    WHERE id = ?
                      AND customer_email_status = 'sending'
                ");

                $sentStmt->bind_param("s", $orderId);
                $sentStmt->execute();
                $sentStmt->close();

            } else {

                error_log(
                    "Kundmejl kunde inte skickas för order " .
                    $orderId
                );

                // Tillåt ett nytt försök senare
                $resetStmt = $conn->prepare("
                    UPDATE orders
                    SET customer_email_status = 'pending',
                        customer_email_started_at = NULL
                    WHERE id = ?
                      AND customer_email_status = 'sending'
                ");

                $resetStmt->bind_param("s", $orderId);
                $resetStmt->execute();
                $resetStmt->close();
            }
        }

    } catch (Throwable $customerEmailError) {

        error_log(
            "CUSTOMER EMAIL ERROR: " .
            $customerEmailError->getMessage()
        );

        // Behåll 'sending' vid oväntade fel.
    }
}


http_response_code(201);

echo json_encode([
    "success" => true,
    "message" => "Order skapad",
    "currency" => "SEK",
    "order_id" => $orderId,
    "customer_id" => $customerId,
    "subtotal" => $subtotal,
    "discount_code" => $discountCode,
    "discount_amount" => $discountAmount,
    "shipping" => $shipping,
    "total_price" => $totalPrice,
    "checkout_url" =>
        $checkoutSession !== null
            ? $checkoutSession->url
            : null
]);


} catch (Throwable $error) {

    error_log(
        "CREATE ORDER ERROR: " .
        $error->getMessage() .
        " in " . $error->getFile() .
        " on line " . $error->getLine()
    );

    try {
        $conn->rollback();
    } catch (Throwable $rollbackError) {
        error_log(
            "ROLLBACK ERROR: " . $rollbackError->getMessage()
        );
    }

   http_response_code(400);

echo json_encode([
    "success" => false,
    "message" => "Kunde inte skapa order"
]);
}