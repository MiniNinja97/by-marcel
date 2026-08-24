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

if (!isset($data["id"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Produkt-ID saknas"
    ]);

    exit;
}
if (!isset($data["is_hidden"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "is_hidden saknas"
    ]);

    exit;
}
$productId = $data["id"];

$isHidden = $data["is_hidden"] ? 1 : 0;

$sql = "
    UPDATE products
    SET is_hidden = ?
    WHERE id = ?
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "is",
    $isHidden,
    $productId
);

$stmt->execute();

echo json_encode([
    "success" => true,
    "id" => $productId,
    "is_hidden" => $isHidden
]);

$stmt->close();
