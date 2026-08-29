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
        "message" => "Ingen data skickades"
    ]);

    exit;
}


// -----------------------------------------
// Hämta produkt-ID
// -----------------------------------------

$id = trim($data["id"] ?? "");

if ($id === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Produkt-ID saknas"
    ]);

    exit;
}


// -----------------------------------------
// Kontrollera att produkten finns
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
$checkStmt->execute();

$result = $checkStmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Produkten finns inte"
    ]);

    $checkStmt->close();
    exit;
}

$checkStmt->close();


// -----------------------------------------
// Ta bort produkten
// -----------------------------------------

$stmt = $conn->prepare("
    DELETE FROM products
    WHERE id = ?
");

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte förbereda borttagningen",
        "error" => $conn->error
    ]);

    exit;
}

$stmt->bind_param("s", $id);

if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte ta bort produkten",
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
    "message" => "Produkten togs bort",
    "product_id" => $id
]);