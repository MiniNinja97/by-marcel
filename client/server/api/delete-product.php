<?php

header("Content-Type: application/json; charset=UTF-8");

// -----------------------------------------
// CORS
// -----------------------------------------

$allowedOrigins = [
    "https://www.bymarcel.se",
    "https://bymarcel.se",
    "http://localhost:5173"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


// -----------------------------------------
// Preflight från webbläsaren
// -----------------------------------------

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}


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
// Kräv inloggad admin
// -----------------------------------------

require_once __DIR__ . "/auth/require-admin.php";


// -----------------------------------------
// Databas
// -----------------------------------------

require_once __DIR__ . "/../config/db.php";


// -----------------------------------------
// Läs JSON från React
// -----------------------------------------

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!is_array($data)) {
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
        "message" => "Serverfel"
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
        "message" => "Serverfel"
    ]);

    exit;
}

$stmt->bind_param("s", $id);

if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte ta bort produkten"
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