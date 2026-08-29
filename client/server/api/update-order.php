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

if (!isset($data["id"]) || !isset($data["status"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Order-ID eller status saknas"
    ]);

    exit;
}

$orderId = $data["id"];
$status = $data["status"];

// Bara dessa tre statusar är tillåtna
$allowedStatuses = [
    "pending",
    "delivered",
    "cancelled"
];

if (!in_array($status, $allowedStatuses, true)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ogiltig orderstatus"
    ]);

    exit;
}

$sql = "
    UPDATE orders
    SET status = ?
    WHERE id = ?
";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ss",
    $status,
    $orderId
);

$stmt->execute();

echo json_encode([
    "success" => true,
    "id" => $orderId,
    "status" => $status
]);

$stmt->close();