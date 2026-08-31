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

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../../config/db.php";
require_once __DIR__ . "/session.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Endast POST är tillåtet"
    ]);

    exit;
}

try {
    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!is_array($data)) {
        throw new Exception("Ogiltig data");
    }

    $email = strtolower(trim($data["email"] ?? ""));
    $password = $data["password"] ?? "";

    if ($email === "" || $password === "") {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Fyll i e-post och lösenord"
        ]);

        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Ogiltig e-postadress"
        ]);

        exit;
    }

    $stmt = $conn->prepare("
        SELECT
            id,
            email,
            password_hash
        FROM admin_users
        WHERE email = ?
        LIMIT 1
    ");

    if (!$stmt) {
        throw new Exception("Kunde inte förbereda login");
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();

    $stmt->close();

    if (
        !$admin ||
        !password_verify($password, $admin["password_hash"])
    ) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Fel e-post eller lösenord"
        ]);

        exit;
    }

    // Nytt session-ID efter lyckad login.
    session_regenerate_id(true);

    $_SESSION["admin_user_id"] = (int) $admin["id"];
    $_SESSION["admin_email"] = $admin["email"];
    $_SESSION["last_activity"] = time();

    echo json_encode([
        "success" => true,
        "message" => "Inloggningen lyckades",
        "admin" => [
            "email" => $admin["email"]
        ]
    ]);

} catch (Throwable $error) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Serverfel vid inloggning",
        "error" => $error->getMessage()
    ]);
}