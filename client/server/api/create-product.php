<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Tillåt CORS preflight
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
        "message" => "Ingen produktdata skickades"
    ]);

    exit;
}


// -----------------------------------------
// Hämta produktdata
// -----------------------------------------

$id = trim($data["id"] ?? "");
$name = trim($data["name"] ?? "");
$slug = trim($data["slug"] ?? "");
$type = trim($data["type"] ?? "");
$description = trim($data["description"] ?? "");
$material = trim($data["material"] ?? "");

$basePrice = (float) ($data["base_price"] ?? 0);
$weight = (float) ($data["weight"] ?? 0);

$allowsCustomPhoto = !empty($data["allows_custom_photo"]) ? 1 : 0;
$allowsCustomText = !empty($data["allows_custom_text"]) ? 1 : 0;
$allowsFontSelection = !empty($data["allows_font_selection"]) ? 1 : 0;
$isSeasonal = !empty($data["is_seasonal"]) ? 1 : 0;


// -----------------------------------------
// Kontrollera obligatoriska fält
// -----------------------------------------

if (
    $id === "" ||
    $name === "" ||
    $slug === "" ||
    $type === "" ||
    $description === "" ||
    $material === ""
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Alla obligatoriska fält måste fyllas i"
    ]);

    exit;
}


// -----------------------------------------
// Kontrollera pris och vikt
// -----------------------------------------

if ($basePrice < 0 || $weight < 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Pris och vikt får inte vara negativa"
    ]);

    exit;
}


// -----------------------------------------
// Kontrollera produkttyp
// -----------------------------------------

if (!in_array($type, ["EC", "ES", "OWN"], true)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ogiltig produkttyp"
    ]);

    exit;
}


// -----------------------------------------
// Kontrollera om produkt-ID redan finns
// -----------------------------------------

$checkStmt = $conn->prepare("
    SELECT id
    FROM products
    WHERE id = ?
");

if (!$checkStmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte förbereda kontrollen",
        "error" => $conn->error
    ]);

    exit;
}

$checkStmt->bind_param("s", $id);

if (!$checkStmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte kontrollera produkt-ID",
        "error" => $checkStmt->error
    ]);

    $checkStmt->close();
    exit;
}

$existingProduct = $checkStmt->get_result();

if ($existingProduct->num_rows > 0) {
    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "Det finns redan en produkt med detta ID"
    ]);

    $checkStmt->close();
    exit;
}

$checkStmt->close();


// -----------------------------------------
// Skapa produkten
// -----------------------------------------
// OBS:
// React använder namnet "type".
// Databasen använder kolumnen "product_type".
// -----------------------------------------

$stmt = $conn->prepare("
    INSERT INTO products (
        id,
        name,
        slug,
        description,
        material,
        product_type,
        base_price,
        allows_custom_photo,
        allows_custom_text,
        allows_font_selection,
        is_seasonal,
        weight
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte förbereda INSERT",
        "error" => $conn->error
    ]);

    exit;
}


// -----------------------------------------
// Koppla värden till SQL-frågan
// -----------------------------------------

$stmt->bind_param(
    "ssssssdiiiid",
    $id,
    $name,
    $slug,
    $description,
    $material,
    $type,
    $basePrice,
    $allowsCustomPhoto,
    $allowsCustomText,
    $allowsFontSelection,
    $isSeasonal,
    $weight
);


// -----------------------------------------
// Spara produkten
// -----------------------------------------

if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte skapa produkten",
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
    "message" => "Produkten skapades",
    "product_id" => $id
]);