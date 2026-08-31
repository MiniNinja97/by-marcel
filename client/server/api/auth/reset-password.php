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
// DATABAS
// =========================================

require_once __DIR__ . "/../../config/db.php";


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

$token = trim($data["token"] ?? "");
$password = $data["password"] ?? "";


// =========================================
// VALIDERA
// =========================================

if ($token === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Återställningslänken är ogiltig"
    ]);

    exit;
}

if (strlen($password) < 8) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Lösenordet måste innehålla minst 8 tecken"
    ]);

    exit;
}


// =========================================
// HASH AV TOKEN
// =========================================

$tokenHash = hash(
    "sha256",
    $token
);


// =========================================
// HITTA GILTIG TOKEN
// =========================================

$stmt = $conn->prepare("
    SELECT
        id,
        admin_user_id,
        expires_at,
        used_at
    FROM admin_password_resets
    WHERE token_hash = ?
    LIMIT 1
");

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Serverfel"
    ]);

    exit;
}

$stmt->bind_param(
    "s",
    $tokenHash
);

$stmt->execute();

$result = $stmt->get_result();
$reset = $result->fetch_assoc();

$stmt->close();


// =========================================
// TOKEN FINNS INTE
// =========================================

if (!$reset) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Återställningslänken är ogiltig"
    ]);

    exit;
}


// =========================================
// TOKEN REDAN ANVÄND
// =========================================

if ($reset["used_at"] !== null) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Återställningslänken har redan använts"
    ]);

    exit;
}


// =========================================
// TOKEN HAR GÅTT UT
// =========================================

if (strtotime($reset["expires_at"]) < time()) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Återställningslänken har gått ut"
    ]);

    exit;
}


// =========================================
// HASH NYTT LÖSENORD
// =========================================

$passwordHash = password_hash(
    $password,
    PASSWORD_DEFAULT
);

if ($passwordHash === false) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte skapa nytt lösenord"
    ]);

    exit;
}


// =========================================
// UPPDATERA LÖSENORD
// =========================================

$adminId = (int) $reset["admin_user_id"];

$updateStmt = $conn->prepare("
    UPDATE admin_users
    SET password_hash = ?
    WHERE id = ?
");

if (!$updateStmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Serverfel"
    ]);

    exit;
}

$updateStmt->bind_param(
    "si",
    $passwordHash,
    $adminId
);

if (!$updateStmt->execute()) {
    $updateStmt->close();

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte uppdatera lösenordet"
    ]);

    exit;
}

$updateStmt->close();


// =========================================
// MARKERA TOKEN SOM ANVÄND
// =========================================

$resetId = (int) $reset["id"];

$usedStmt = $conn->prepare("
    UPDATE admin_password_resets
    SET used_at = NOW()
    WHERE id = ?
");

if (!$usedStmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Serverfel"
    ]);

    exit;
}

$usedStmt->bind_param(
    "i",
    $resetId
);

$usedStmt->execute();
$usedStmt->close();


// =========================================
// OGILTIGFÖRKLARA ÖVRIGA TOKENS
// =========================================

$invalidateStmt = $conn->prepare("
    UPDATE admin_password_resets
    SET used_at = NOW()
    WHERE admin_user_id = ?
      AND used_at IS NULL
");

if ($invalidateStmt) {
    $invalidateStmt->bind_param(
        "i",
        $adminId
    );

    $invalidateStmt->execute();
    $invalidateStmt->close();
}


// =========================================
// KLART
// =========================================

echo json_encode([
    "success" => true,
    "message" => "Ditt lösenord har ändrats"
]);