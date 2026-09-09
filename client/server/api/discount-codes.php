<?php

header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = [
    "http://localhost:5173",
    "https://www.bymarcel.se"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/auth/require-admin.php";

$method = $_SERVER["REQUEST_METHOD"];


// ========================================
// GET - Hämta alla rabattkoder
// ========================================

if ($method === "GET") {

    $result = $conn->query("
        SELECT *
        FROM discount_codes
        ORDER BY created_at DESC
    ");

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Kunde inte hämta rabattkoder."
        ]);
        exit;
    }

    $discountCodes = [];

    while ($row = $result->fetch_assoc()) {
        $discountCodes[] = $row;
    }

    echo json_encode([
        "success" => true,
        "discount_codes" => $discountCodes
    ]);

    exit;
}


// ========================================
// POST - Skapa en ny rabattkod
// ========================================

if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $code = strtoupper(trim($data["code"] ?? ""));
    $type = $data["type"] ?? "";
    $value = (float) ($data["value"] ?? 0);

    $active = !empty($data["active"]) ? 1 : 0;

    $validFrom = !empty($data["valid_from"])
        ? $data["valid_from"]
        : null;

    $validUntil = !empty($data["valid_until"])
        ? $data["valid_until"]
        : null;

    $minimumOrder = (
        isset($data["minimum_order"]) &&
        $data["minimum_order"] !== ""
    )
        ? (float) $data["minimum_order"]
        : null;


    // Grundläggande validering

    if ($code === "") {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Rabattkod måste anges."
        ]);
        exit;
    }

    if (!in_array($type, ["percent", "fixed"], true)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Ogiltig rabattyp."
        ]);
        exit;
    }

    if ($value <= 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Rabatten måste vara större än 0."
        ]);
        exit;
    }

    if ($type === "percent" && $value > 100) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Procentrabatt kan inte vara högre än 100 %."
        ]);
        exit;
    }

    if (
        $validFrom !== null &&
        $validUntil !== null &&
        strtotime($validUntil) < strtotime($validFrom)
    ) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Slutdatum kan inte vara före startdatum."
        ]);
        exit;
    }


    // Lägg till rabattkoden

    $stmt = $conn->prepare("
        INSERT INTO discount_codes
        (
            code,
            type,
            value,
            active,
            valid_from,
            valid_until,
            minimum_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "ssdissd",
        $code,
        $type,
        $value,
        $active,
        $validFrom,
        $validUntil,
        $minimumOrder
    );

    if (!$stmt->execute()) {

        if ($stmt->errno === 1062) {
            http_response_code(409);

            echo json_encode([
                "success" => false,
                "message" => "Rabattkoden finns redan."
            ]);

            exit;
        }

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Kunde inte skapa rabattkoden."
        ]);

        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Rabattkoden skapades.",
        "id" => $stmt->insert_id
    ]);

    exit;
}


// ========================================
// PUT - Uppdatera rabattkod
// ========================================

if ($method === "PUT") {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = (int) ($data["id"] ?? 0);
    $code = strtoupper(trim($data["code"] ?? ""));
    $type = $data["type"] ?? "";
    $value = (float) ($data["value"] ?? 0);

    $active = !empty($data["active"]) ? 1 : 0;

    $validFrom = !empty($data["valid_from"])
        ? $data["valid_from"]
        : null;

    $validUntil = !empty($data["valid_until"])
        ? $data["valid_until"]
        : null;

    $minimumOrder = (
        isset($data["minimum_order"]) &&
        $data["minimum_order"] !== ""
    )
        ? (float) $data["minimum_order"]
        : null;


    if ($id <= 0) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Ogiltigt rabattkods-ID."
        ]);

        exit;
    }

    if ($code === "") {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Rabattkod måste anges."
        ]);

        exit;
    }

    if (!in_array($type, ["percent", "fixed"], true)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Ogiltig rabattyp."
        ]);

        exit;
    }

    if ($value <= 0) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Rabatten måste vara större än 0."
        ]);

        exit;
    }

    if ($type === "percent" && $value > 100) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Procentrabatt kan inte vara högre än 100 %."
        ]);

        exit;
    }

    if (
        $validFrom !== null &&
        $validUntil !== null &&
        strtotime($validUntil) < strtotime($validFrom)
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Slutdatum kan inte vara före startdatum."
        ]);

        exit;
    }


    $stmt = $conn->prepare("
        UPDATE discount_codes
        SET
            code = ?,
            type = ?,
            value = ?,
            active = ?,
            valid_from = ?,
            valid_until = ?,
            minimum_order = ?
        WHERE id = ?
    ");

    $stmt->bind_param(
        "ssdissdi",
        $code,
        $type,
        $value,
        $active,
        $validFrom,
        $validUntil,
        $minimumOrder,
        $id
    );

    if (!$stmt->execute()) {

        if ($stmt->errno === 1062) {
            http_response_code(409);

            echo json_encode([
                "success" => false,
                "message" => "Rabattkoden finns redan."
            ]);

            exit;
        }

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Kunde inte uppdatera rabattkoden."
        ]);

        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Rabattkoden uppdaterades."
    ]);

    exit;
}


// ========================================
// DELETE - Ta bort rabattkod
// ========================================

if ($method === "DELETE") {

    $data = json_decode(file_get_contents("php://input"), true);

    $id = (int) ($data["id"] ?? 0);

    if ($id <= 0) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Ogiltigt rabattkods-ID."
        ]);

        exit;
    }

    $stmt = $conn->prepare("
        DELETE FROM discount_codes
        WHERE id = ?
    ");

    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Kunde inte ta bort rabattkoden."
        ]);

        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Rabattkoden togs bort."
    ]);

    exit;
}

// ========================================
// Övriga HTTP-metoder
// ========================================

http_response_code(405);

echo json_encode([
    "success" => false,
    "message" => "Metoden stöds inte."
]);