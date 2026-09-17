<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/../config/db.php";

$sql = "SELECT * FROM products";
$result = $conn->query($sql);

$products = [];

if ($result) {

    while ($row = $result->fetch_assoc()) {

        $productId = $row["id"];


        // =========================================
        // BILDER
        // =========================================

        $imageSql = "
            SELECT image_url
            FROM product_images
            WHERE product_id = ?
            ORDER BY sort_order ASC
        ";

        $imageStmt = $conn->prepare($imageSql);
        $imageStmt->bind_param("s", $productId);
        $imageStmt->execute();

        $imageResult = $imageStmt->get_result();

        $images = [];

        while ($image = $imageResult->fetch_assoc()) {
            $images[] = $image["image_url"];
        }

        $row["images"] = $images;

        $imageStmt->close();


        // =========================================
        // PRODUKTVAL
        // Exempel: storlek, ram, form
        // =========================================

        $optionSql = "
            SELECT id, option_name, display_name, sort_order
            FROM product_options
            WHERE product_id = ?
            ORDER BY sort_order ASC
        ";

        $optionStmt = $conn->prepare($optionSql);
        $optionStmt->bind_param("s", $productId);
        $optionStmt->execute();

        $optionResult = $optionStmt->get_result();

        $options = [];

        while ($option = $optionResult->fetch_assoc()) {

            $optionId = $option["id"];

            $valueSql = "
                SELECT value, display_value, sort_order
                FROM product_option_values
                WHERE option_id = ?
                ORDER BY sort_order ASC
            ";

            $valueStmt = $conn->prepare($valueSql);
            $valueStmt->bind_param("i", $optionId);
            $valueStmt->execute();

            $valueResult = $valueStmt->get_result();

            $values = [];

            while ($value = $valueResult->fetch_assoc()) {
                $values[] = $value;
            }

            $option["values"] = $values;
            $options[] = $option;

            $valueStmt->close();
        }

        $row["options"] = $options;

        $optionStmt->close();


        // =========================================
        // CUSTOM TEXT-FÄLT
        // Exempel: Rad 1, Rad 2, Rad 3...
        // =========================================

        $textFieldSql = "
            SELECT
                id,
                field_name,
                display_name,
                placeholder,
                max_length,
                sort_order
            FROM product_text_fields
            WHERE product_id = ?
            ORDER BY sort_order ASC
        ";

        $textFieldStmt = $conn->prepare($textFieldSql);
        $textFieldStmt->bind_param("s", $productId);
        $textFieldStmt->execute();

        $textFieldResult = $textFieldStmt->get_result();

        $textFields = [];

        while ($textField = $textFieldResult->fetch_assoc()) {
            $textFields[] = $textField;
        }

        $row["text_fields"] = $textFields;

        $textFieldStmt->close();

        // =========================================
// UPPLADDNINGSFÄLT
// Exempel: bilder, skiss, logotyp
// =========================================

$uploadFieldSql = "
    SELECT
        id,
        field_name,
        display_name,
        max_files,
        allowed_extensions,
        sort_order
    FROM product_upload_fields
    WHERE product_id = ?
    ORDER BY sort_order ASC
";

$uploadFieldStmt = $conn->prepare($uploadFieldSql);
$uploadFieldStmt->bind_param("s", $productId);
$uploadFieldStmt->execute();

$uploadFieldResult = $uploadFieldStmt->get_result();

$uploadFields = [];

while ($uploadField = $uploadFieldResult->fetch_assoc()) {
    $uploadField["max_files"] = (int) $uploadField["max_files"];
    $uploadFields[] = $uploadField;
}

$row["upload_fields"] = $uploadFields;

$uploadFieldStmt->close();

        // =========================================
// FÄRGER
// Bakgrundsfärg + tryckfärg
// =========================================

$colorSql = "
    SELECT
        pc.id,
        pc.ral_code,
        pc.name,
        pc.rgb,
        pc.hex,
        pc.category,
        pc.background_code,
        pc.background_price,
        pc.print_code,
        pc.print_price
    FROM product_colors pc
    INNER JOIN product_color_links pcl
        ON pcl.color_id = pc.id
    WHERE pcl.product_id = ?
    ORDER BY pc.id ASC
";

$colorStmt = $conn->prepare($colorSql);
$colorStmt->bind_param("s", $productId);
$colorStmt->execute();

$colorResult = $colorStmt->get_result();

$colors = [];

while ($color = $colorResult->fetch_assoc()) {

    // Priser kommer annars från MySQL som text, t.ex. "70.00".
    // Vi gör dem till riktiga nummer.
    $color["background_price"] = (float) $color["background_price"];
    $color["print_price"] = (float) $color["print_price"];

    $colors[] = $color;
}

$row["colors"] = $colors;

$colorStmt->close();


       // =========================================
// VARIANTER / LEVERANTÖRSARTIKLAR
// =========================================

$variantSql = "
    SELECT id, supplier_id, price, weight, options
    FROM product_variants
    WHERE product_id = ?
";

$variantStmt = $conn->prepare($variantSql);
$variantStmt->bind_param("s", $productId);
$variantStmt->execute();

$variantResult = $variantStmt->get_result();

$variants = [];

while ($variant = $variantResult->fetch_assoc()) {

    // Gör JSON-options till en PHP-array
    $variant["options"] = json_decode(
        $variant["options"],
        true
    );

    $variantId = $variant["id"];


    // =========================================
    // BILDER FÖR DENNA VARIANT
    // =========================================

    $variantImageSql = "
        SELECT image_url
        FROM product_variant_images
        WHERE variant_id = ?
        ORDER BY sort_order ASC
    ";

    $variantImageStmt = $conn->prepare($variantImageSql);
    $variantImageStmt->bind_param("s", $variantId);
    $variantImageStmt->execute();

    $variantImageResult = $variantImageStmt->get_result();

    $variantImages = [];

    while ($variantImage = $variantImageResult->fetch_assoc()) {
        $variantImages[] = $variantImage["image_url"];
    }

    $variant["images"] = $variantImages;

    $variantImageStmt->close();


    // Lägg till färdig variant
    $variants[] = $variant;
}

$row["variants"] = $variants;

$variantStmt->close();

        $products[] = $row;
    }
}

echo json_encode($products);