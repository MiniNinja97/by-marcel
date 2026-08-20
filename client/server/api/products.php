<?php

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

$sql = "SELECT * FROM products";
$result = $conn->query($sql);

$products = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {

        $productId = $row["id"];

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

    // Hämta produktens bilder
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

        $variantSql = "
            SELECT id, supplier_id, price, weight, options
            FROM product_variants
            WHERE product_id = ?
        ";

        $stmt = $conn->prepare($variantSql);
        $stmt->bind_param("s", $productId);
        $stmt->execute();

        $variantResult = $stmt->get_result();

        $variants = [];

        while ($variant = $variantResult->fetch_assoc()) {

            $variant["options"] = json_decode(
                $variant["options"],
                true
            );

            $variants[] = $variant;
        }

        $row["variants"] = $variants;

        $products[] = $row;

        $stmt->close();
    }
}

echo json_encode($products);