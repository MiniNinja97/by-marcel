<?php

header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = [
    "https://www.bymarcel.se",
    "https://bymarcel.se",
    "http://localhost:5173"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . "/session.php";

$maxInactiveTime = 300; // 5 minuter

if (!isset($_SESSION["admin_user_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "authenticated" => false
    ]);

    exit;
}

// Kontrollera hur länge admin varit inaktiv
if (
    isset($_SESSION["last_activity"]) &&
    time() - $_SESSION["last_activity"] >= $maxInactiveTime
) {
    $_SESSION = [];
    session_destroy();

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "authenticated" => false,
        "message" => "Sessionen har gått ut på grund av inaktivitet"
    ]);

    exit;
}

// Admin är fortfarande aktiv
$_SESSION["last_activity"] = time();

echo json_encode([
    "success" => true,
    "authenticated" => true,
    "admin" => [
        "email" => $_SESSION["admin_email"] ?? ""
    ]
]);