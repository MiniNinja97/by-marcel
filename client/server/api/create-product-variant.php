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
// Läs JSON från React
// -----------------------------------------

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ingen variantdata skickades"
    ]);

    exit;
}


// -----------------------------------------
// Hämta data
// -----------------------------------------

$id = trim($data["id"] ?? "");
$productId = trim($data["product_id"] ?? "");
$supplierId = trim($data["supplier_id"] ?? "");

$price = (float) ($data["price"] ?? 0);

$weight = isset($data["weight"]) && $data["weight"] !== ""
    ? (float) $data["weight"]
    : null;

$options = $data["options"] ?? [];


// -----------------------------------------
// Validering
// -----------------------------------------

if (
    $id === "" ||
    $productId === "" ||
    $supplierId === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Variant-ID, produkt-ID och leverantörs-ID krävs"
    ]);

    exit;
}

if (!is_array($options)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Produktvalen har fel format"
    ]);

    exit;
}

if ($price < 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Priset får inte vara negativt"
    ]);

    exit;
}


// -----------------------------------------
// Kontrollera att huvudprodukten finns
// -----------------------------------------

$productStmt = $conn->prepare("
    SELECT id
    FROM products
    WHERE id = ?
");

if (!$productStmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte förbereda produktkontrollen",
        "error" => $conn->error
    ]);

    exit;
}

$productStmt->bind_param("s", $productId);
$productStmt->execute();

$productResult = $productStmt->get_result();

if ($productResult->num_rows === 0) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Huvudprodukten finns inte"
    ]);

    $productStmt->close();
    exit;
}

$productStmt->close();


// -----------------------------------------
// Kontrollera Variant-ID
// -----------------------------------------

$variantStmt = $conn->prepare("
    SELECT id
    FROM product_variants
    WHERE id = ?
");

if (!$variantStmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte förbereda variantkontrollen",
        "error" => $conn->error
    ]);

    exit;
}

$variantStmt->bind_param("s", $id);
$variantStmt->execute();

$variantResult = $variantStmt->get_result();

if ($variantResult->num_rows > 0) {
    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "Det finns redan en variant med detta ID"
    ]);

    $variantStmt->close();
    exit;
}

$variantStmt->close();


// -----------------------------------------
// Gör options till JSON
//
// Exempel:
// {
//   "size": "33 x 8 cm",
//   "frame": "true"
// }
// -----------------------------------------

$optionsJson = json_encode(
    $options,
    JSON_UNESCAPED_UNICODE
);

if ($optionsJson === false) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte läsa produktvalen"
    ]);

    exit;
}


// -----------------------------------------
// Skapa varianten
// -----------------------------------------

$stmt = $conn->prepare("
    INSERT INTO product_variants (
        id,
        product_id,
        supplier_id,
        options,
        price,
        weight
    )
    VALUES (?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte förbereda varianten",
        "error" => $conn->error
    ]);

    exit;
}

$stmt->bind_param(
    "ssssdd",
    $id,
    $productId,
    $supplierId,
    $optionsJson,
    $price,
    $weight
);


// -----------------------------------------
// Spara
// -----------------------------------------

if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte skapa varianten",
        "error" => $stmt->error
    ]);

    $stmt->close();
    exit;
}

$stmt->close();


// -----------------------------------------
// Klart
// -----------------------------------------

echo json_encode([
    "success" => true,
    "message" => "Varianten skapades",
    "variant_id" => $id
]);