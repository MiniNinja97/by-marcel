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

// Tillåt bara POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Endast POST är tillåtet"
    ]);

    exit;
}

// Läs JSON från React
$data = json_decode(
    file_get_contents("php://input"),
    true
);

// Kontrollera produkt-ID
if (!isset($data["id"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Produkt-ID saknas"
    ]);

    exit;
}

$productId = $data["id"];


// -----------------------------
// DÖLJ / VISA
// -----------------------------

if (isset($data["is_hidden"])) {

    $value = $data["is_hidden"] ? 1 : 0;

    $sql = "
        UPDATE products
        SET is_hidden = ?
        WHERE id = ?
    ";


// -----------------------------
// I LAGER / EJ I LAGER
// -----------------------------

} elseif (isset($data["is_out_of_stock"])) {

    $value = $data["is_out_of_stock"] ? 1 : 0;

    $sql = "
        UPDATE products
        SET is_out_of_stock = ?
        WHERE id = ?
    ";


// -----------------------------
// UTVALD / INTE UTVALD
// -----------------------------

} elseif (isset($data["is_featured"])) {

    $value = $data["is_featured"] ? 1 : 0;

    $sql = "
        UPDATE products
        SET is_featured = ?
        WHERE id = ?
    ";


// -----------------------------
// INGET GILTIGT FÄLT
// -----------------------------

} else {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ingen giltig ändring skickades"
    ]);

    exit;
}


// Uppdatera databasen
$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "is",
    $value,
    $productId
);

$stmt->execute();


// Skicka svar tillbaka till React
echo json_encode([
    "success" => true,
    "id" => $productId,
    "value" => $value
]);

$stmt->close();
