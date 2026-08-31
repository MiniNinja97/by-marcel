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
// LÄS E-POST
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

$email = strtolower(trim($data["email"] ?? ""));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ange en giltig e-postadress"
    ]);

    exit;
}


// =========================================
// STANDARDMEDDELANDE
// =========================================

$standardResponse = [
    "success" => true,
    "message" =>
        "Om e-postadressen finns registrerad har ett återställningsmejl skickats."
];


// =========================================
// HITTA ADMIN
// =========================================

$stmt = $conn->prepare("
    SELECT id, email
    FROM admin_users
    WHERE email = ?
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

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
$admin = $result->fetch_assoc();

$stmt->close();


// =========================================
// FINNS INGEN ADMIN?
// =========================================

// Vi skickar ändå samma svar.
// På så sätt avslöjar vi inte vilka
// e-postadresser som är admin-konton.

if (!$admin) {
    echo json_encode($standardResponse);
    exit;
}


// =========================================
// SKAPA TOKEN
// =========================================

$token = bin2hex(random_bytes(32));

$tokenHash = hash(
    "sha256",
    $token
);

$expiresAt = date(
    "Y-m-d H:i:s",
    time() + 1800
);

// Länken gäller i 30 minuter.


// =========================================
// TA BORT GAMLA OANVÄNDA TOKENS
// =========================================

$deleteStmt = $conn->prepare("
    DELETE FROM admin_password_resets
    WHERE admin_user_id = ?
      AND used_at IS NULL
");

if (!$deleteStmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Serverfel"
    ]);

    exit;
}

$adminId = (int) $admin["id"];

$deleteStmt->bind_param(
    "i",
    $adminId
);

$deleteStmt->execute();
$deleteStmt->close();


// =========================================
// SPARA TOKEN-HASH
// =========================================

$insertStmt = $conn->prepare("
    INSERT INTO admin_password_resets (
        admin_user_id,
        token_hash,
        expires_at
    )
    VALUES (?, ?, ?)
");

if (!$insertStmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Serverfel"
    ]);

    exit;
}

$insertStmt->bind_param(
    "iss",
    $adminId,
    $tokenHash,
    $expiresAt
);

if (!$insertStmt->execute()) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Serverfel"
    ]);

    $insertStmt->close();
    exit;
}

$insertStmt->close();


// =========================================
// ÅTERSTÄLLNINGSLÄNK
// =========================================

$resetUrl =
    "https://www.bymarcel.se/#/admin/reset-password?token=" .
    urlencode($token);


// =========================================
// SKICKA MEJL
// =========================================

$subject = "Återställ ditt adminlösenord";

$message =
    "Hej!\n\n" .
    "Vi har fått en begäran om att återställa lösenordet " .
    "för ditt administratörskonto hos By Marcel.\n\n" .
    "Öppna länken nedan för att välja ett nytt lösenord:\n\n" .
    $resetUrl . "\n\n" .
    "Länken gäller i 30 minuter.\n\n" .
    "Om du inte begärde återställningen kan du ignorera detta mejl.\n\n" .
    "By Marcel";

$headers = [
    "From: By Marcel <marcel@bymarcel.se>",
    "Reply-To: marcel@bymarcel.se",
    "Content-Type: text/plain; charset=UTF-8"
];

$mailSent = mail(
    $admin["email"],
    $subject,
    $message,
    implode("\r\n", $headers)
);


// =========================================
// OM MEJLET INTE KUNDE SKICKAS
// =========================================

if (!$mailSent) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte skicka återställningsmejlet"
    ]);

    exit;
}


// =========================================
// KLART
// =========================================

echo json_encode($standardResponse);