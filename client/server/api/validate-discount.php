<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = [
    "http://localhost:5173",
    "https://www.bymarcel.se"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config/db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$code = strtoupper(
    trim($data["code"] ?? "")
);

$subtotal = isset($data["subtotal"])
    ? (float) $data["subtotal"]
    : 0;

if ($code === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ange en rabattkod"
    ]);

    exit;
}

$stmt = $conn->prepare("
    SELECT
        id,
        code,
        type,
        value,
        active,
        valid_from,
        valid_until,
        minimum_order
    FROM discount_codes
    WHERE code = ?
    LIMIT 1
");

$stmt->bind_param("s", $code);
$stmt->execute();

$result = $stmt->get_result();
$discount = $result->fetch_assoc();

$stmt->close();

if (!$discount) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Rabattkoden finns inte"
    ]);

    exit;
}

if (!(bool) $discount["active"]) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Rabattkoden är inte aktiv"
    ]);

    exit;
}

$now = new DateTime();

if (
    $discount["valid_from"] !== null &&
    $now < new DateTime($discount["valid_from"])
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Rabattkoden gäller inte ännu"
    ]);

    exit;
}

if (
    $discount["valid_until"] !== null &&
    $now > new DateTime($discount["valid_until"])
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Rabattkoden har gått ut"
    ]);

    exit;
}

$minimumOrder = $discount["minimum_order"] !== null
    ? (float) $discount["minimum_order"]
    : null;

if (
    $minimumOrder !== null &&
    $subtotal < $minimumOrder
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" =>
            "Rabattkoden kräver ett ordervärde på minst " .
            $minimumOrder .
            " SEK"
    ]);

    exit;
}

$value = (float) $discount["value"];

if ($discount["type"] === "percent") {
    $discountAmount = $subtotal * ($value / 100);
} else {
    $discountAmount = $value;
}

// Rabatten får aldrig vara större än produktvärdet.
$discountAmount = min(
    $discountAmount,
    $subtotal
);

$discountAmount = round(
    $discountAmount,
    2
);

echo json_encode([
    "success" => true,

    "discount" => [
        "code" => $discount["code"],
        "type" => $discount["type"],
        "value" => $value,
        "amount" => $discountAmount
    ]
]);