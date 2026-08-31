<?php

require_once __DIR__ . "/session.php";

$maxInactiveTime = 300; // 5 minuter

// Ingen admin är inloggad
if (!isset($_SESSION["admin_user_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Du måste vara inloggad som admin"
    ]);

    exit;
}

// Kontrollera inaktivitet
if (
    isset($_SESSION["last_activity"]) &&
    time() - $_SESSION["last_activity"] >= $maxInactiveTime
) {
    $_SESSION = [];

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();

        setcookie(
            session_name(),
            "",
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    session_destroy();

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Sessionen har gått ut. Logga in igen."
    ]);

    exit;
}

// Admin är aktiv – uppdatera tiden
$_SESSION["last_activity"] = time();