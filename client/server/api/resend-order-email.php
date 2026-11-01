<?php

header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = [
    "https://www.bymarcel.se",
    "https://bymarcel.se",
    "https://test.bymarcel.se",
    "http://localhost:5173"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (!in_array($origin, $allowedOrigins, true)) {
    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Otillåtet ursprung"
    ]);

    exit;
}

header("Access-Control-Allow-Origin: " . $origin);
header("Access-Control-Allow-Credentials: true");
header("Vary: Origin");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/auth/session.php";
require_once __DIR__ . "/send-order-email.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Endast POST är tillåtet"
    ]);

    exit;
}

// Tillåt endast JSON-anrop.
$contentType = $_SERVER["CONTENT_TYPE"] ?? "";

if (!preg_match('/^application\/json(?:\s*;|$)/i', $contentType)) {
    http_response_code(415);

    echo json_encode([
        "success" => false,
        "message" => "Endast JSON-anrop är tillåtna"
    ]);

    exit;
}

// Endast administratörer med en aktiv session.
$maxInactiveTime = 300;

if (empty($_SESSION["admin_user_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Du måste vara inloggad som administratör"
    ]);

    exit;
}

if (
    !isset($_SESSION["last_activity"]) ||
    time() - $_SESSION["last_activity"] >= $maxInactiveTime
) {
    $_SESSION = [];
    session_destroy();

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Sessionen har gått ut på grund av inaktivitet"
    ]);

    exit;
}

$_SESSION["last_activity"] = time();

// Läs order-ID från anropet.
$data = json_decode(file_get_contents("php://input"), true);

$orderId = $data["order_id"] ?? null;

if (!is_string($orderId) || trim($orderId) === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Order-ID saknas eller är ogiltigt"
    ]);

    exit;
}

// Kontrollera att ordern finns och är betald.
$stmt = $conn->prepare("
    SELECT
        id,
        status,
        stripe_payment_id,
        order_email_status
    FROM orders
    WHERE id = ?
    LIMIT 1
");

$stmt->bind_param("s", $orderId);
$stmt->execute();

$result = $stmt->get_result();
$order = $result->fetch_assoc();

$stmt->close();

if (!$order) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Ordern hittades inte"
    ]);

    exit;
}

if (
    $order["status"] !== "processing" ||
    empty($order["stripe_payment_id"])
) {
    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "Ordern är inte bekräftad som betald"
    ]);

    exit;
}

// Kontrollera om ordermejlet kan skickas igen.
if ($order["order_email_status"] !== "pending") {
    http_response_code(409);



    echo json_encode([
        "success" => false,
        "message" => "Ordermejlet kan inte skickas igen automatiskt. Nuvarande status: " .
            $order["order_email_status"]
    ]);

    exit;
}


// Reservera ordermejlet innan utskick.
$reserveStmt = $conn->prepare("
    UPDATE orders
    SET
        order_email_status = 'sending',
        order_email_started_at = NOW()
    WHERE id = ?
    AND status = 'processing'
    AND stripe_payment_id IS NOT NULL
    AND stripe_payment_id <> ''
    AND order_email_status = 'pending'
");

$reserveStmt->bind_param("s", $orderId);
$reserveStmt->execute();

$wasReserved = $reserveStmt->affected_rows === 1;

$reserveStmt->close();

if (!$wasReserved) {
    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "Ordermejlet är redan reserverat eller kan inte skickas igen"
    ]);

    exit;
}
try {
    // Försök skicka ordermejlet.
    $emailSent = sendOrderEmail($conn, $orderId);

    if (!$emailSent) {
        // mail() accepterade inte utskicket.
        $resetStmt = $conn->prepare("
            UPDATE orders
            SET
                order_email_status = 'pending',
                order_email_started_at = NULL
            WHERE id = ?
            AND order_email_status = 'sending'
        ");

        $resetStmt->bind_param("s", $orderId);
        $resetStmt->execute();
        $resetStmt->close();

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Ordermejlet kunde inte skickas"
        ]);

        exit;
    }

    // Mejlet accepterades för utskick.
    $updateStmt = $conn->prepare("
        UPDATE orders
        SET
            order_email_status = 'sent',
            order_email_sent_at = NOW()
        WHERE id = ?
        AND order_email_status = 'sending'
    ");

    $updateStmt->bind_param("s", $orderId);
$updateStmt->execute();

$wasUpdated = $updateStmt->affected_rows === 1;

$updateStmt->close();

if (!$wasUpdated) {
    throw new RuntimeException(
        "Ordermejlet accepterades, men mejlstatusen kunde inte uppdateras"
    );
}

    echo json_encode([
        "success" => true,
        "message" => "Ordermejlet har accepterats för utskick",
        "order_email_status" => "sent"
    ]);

} catch (Throwable $e) {
    error_log(
        "Manuellt ordermejl misslyckades för order " .
        $orderId . ": " . $e->getMessage()
    );

    // Behåll sending eftersom vi inte säkert vet
    // om mejlet redan har skickats.
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Utskicket behöver kontrolleras innan nytt försök"
    ]);
}