<?php

header("Content-Type: application/json; charset=UTF-8");


// =========================================
// CORS
// =========================================

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


// =========================================
// PREFLIGHT
// =========================================

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}


// =========================================
// ENDAST POST
// =========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Endast POST är tillåtet"
    ]);

    exit;
}


// =========================================
// KRÄV INLOGGAD ADMIN
// =========================================

require_once __DIR__ . "/auth/require-admin.php";


// =========================================
// DATABAS
// =========================================

require_once __DIR__ . "/../config/db.php";


// =========================================
// LÄS DATA
// =========================================

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ogiltig data"
    ]);

    exit;
}

if (!isset($data["id"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Produkt-ID saknas"
    ]);

    exit;
}

$productId = trim($data["id"]);

if ($productId === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Produkt-ID saknas"
    ]);

    exit;
}


// =========================================
// ÄNDRA PRODUKTINFORMATION
// =========================================

if (
    isset($data["name"]) &&
    isset($data["description"]) &&
    isset($data["base_price"]) &&
    isset($data["weight"])
) {

    $name = trim($data["name"]);
    $description = trim($data["description"]);
    $basePrice = (float) $data["base_price"];
    $weight = (float) $data["weight"];

    if ($name === "" || $description === "") {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Namn och beskrivning får inte vara tomma"
        ]);

        exit;
    }

    if ($basePrice < 0 || $weight < 0) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Pris och vikt får inte vara negativa"
        ]);

        exit;
    }

    $sql = "
        UPDATE products
        SET
            name = ?,
            description = ?,
            base_price = ?,
            weight = ?
        WHERE id = ?
    ";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Serverfel"
        ]);

        exit;
    }

    $stmt->bind_param(
        "ssdds",
        $name,
        $description,
        $basePrice,
        $weight,
        $productId
    );

    if (!$stmt->execute()) {
        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Kunde inte uppdatera produkten"
        ]);

        $stmt->close();
        exit;
    }

    echo json_encode([
        "success" => true,
        "id" => $productId,
        "name" => $name,
        "description" => $description,
        "base_price" => $basePrice,
        "weight" => $weight
    ]);

    $stmt->close();
    exit;
}


// =========================================
// DÖLJ / VISA
// =========================================

if (isset($data["is_hidden"])) {

    $value = $data["is_hidden"] ? 1 : 0;

    $sql = "
        UPDATE products
        SET is_hidden = ?
        WHERE id = ?
    ";


// =========================================
// I LAGER / EJ I LAGER
// =========================================

} elseif (isset($data["is_out_of_stock"])) {

    $value = $data["is_out_of_stock"] ? 1 : 0;

    $sql = "
        UPDATE products
        SET is_out_of_stock = ?
        WHERE id = ?
    ";


// =========================================
// UTVALD / INTE UTVALD
// =========================================

} elseif (isset($data["is_featured"])) {

    $value = $data["is_featured"] ? 1 : 0;

    $sql = "
        UPDATE products
        SET is_featured = ?
        WHERE id = ?
    ";


// =========================================
// INGEN GILTIG ÄNDRING
// =========================================

} else {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ingen giltig ändring skickades"
    ]);

    exit;
}


// =========================================
// UTFÖR STATUSÄNDRINGEN
// =========================================

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Serverfel"
    ]);

    exit;
}

$stmt->bind_param(
    "is",
    $value,
    $productId
);

if (!$stmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte uppdatera produkten"
    ]);

    $stmt->close();
    exit;
}

echo json_encode([
    "success" => true,
    "id" => $productId,
    "value" => $value
]);

$stmt->close();