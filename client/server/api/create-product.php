<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Endast POST är tillåtet"
    ]);

    exit;
}

try {

    require_once __DIR__ . "/../config/db.php";

    // -----------------------------------------
    // Läs JSON från React
    // -----------------------------------------

    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    if (!is_array($data)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Ingen giltig produktdata skickades"
        ]);

        exit;
    }

    // -----------------------------------------
    // Hämta produktdata
    // -----------------------------------------

    $id = trim($data["id"] ?? "");
    $name = trim($data["name"] ?? "");
    $slug = trim($data["slug"] ?? "");
    $type = trim($data["type"] ?? "");
    $description = trim($data["description"] ?? "");
    $material = trim($data["material"] ?? "");

    $basePrice = (float) ($data["base_price"] ?? 0);
    $weight = (float) ($data["weight"] ?? 0);

    $allowsCustomPhoto =
        !empty($data["allows_custom_photo"]) ? 1 : 0;

    $allowsCustomText =
        !empty($data["allows_custom_text"]) ? 1 : 0;

    $allowsFontSelection =
        !empty($data["allows_font_selection"]) ? 1 : 0;

    $isSeasonal =
        !empty($data["is_seasonal"]) ? 1 : 0;

    // -----------------------------------------
    // Kontrollera obligatoriska fält
    // -----------------------------------------

    if (
        $id === "" ||
        $name === "" ||
        $slug === "" ||
        $type === "" ||
        $description === "" ||
        $material === ""
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Alla obligatoriska fält måste fyllas i"
        ]);

        exit;
    }

    // -----------------------------------------
    // Kontrollera pris och vikt
    // -----------------------------------------

    if ($basePrice < 0 || $weight < 0) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Pris och vikt får inte vara negativa"
        ]);

        exit;
    }

    // -----------------------------------------
    // Kontrollera produkttyp
    // -----------------------------------------

    if (!in_array($type, ["EC", "ES", "OWN"], true)) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Ogiltig produkttyp"
        ]);

        exit;
    }

    // -----------------------------------------
    // Kontrollera om produkt-ID redan finns
    // -----------------------------------------

    $checkStmt = $conn->prepare("
        SELECT id
        FROM products
        WHERE id = ?
        LIMIT 1
    ");

    if (!$checkStmt) {
        throw new Exception(
            "Kunde inte förbereda ID-kontrollen: " . $conn->error
        );
    }

    $checkStmt->bind_param("s", $id);

    if (!$checkStmt->execute()) {
        throw new Exception(
            "Kunde inte kontrollera produkt-ID: " . $checkStmt->error
        );
    }

    /*
     * store_result används i stället för get_result.
     * Det fungerar bättre mellan olika PHP/MySQL-installationer.
     */
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {

        $checkStmt->close();

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "Det finns redan en produkt med detta ID"
        ]);

        exit;
    }

    $checkStmt->close();

    // -----------------------------------------
    // Skapa produkten
    // -----------------------------------------

    $stmt = $conn->prepare("
        INSERT INTO products (
            id,
            name,
            slug,
            description,
            material,
            product_type,
            base_price,
            allows_custom_photo,
            allows_custom_text,
            allows_font_selection,
            is_seasonal,
            weight
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        throw new Exception(
            "Kunde inte förbereda INSERT: " . $conn->error
        );
    }

    // -----------------------------------------
    // Koppla värden
    // -----------------------------------------

    $stmt->bind_param(
        "ssssssdiiiid",
        $id,
        $name,
        $slug,
        $description,
        $material,
        $type,
        $basePrice,
        $allowsCustomPhoto,
        $allowsCustomText,
        $allowsFontSelection,
        $isSeasonal,
        $weight
    );

    // -----------------------------------------
    // Spara produkten
    // -----------------------------------------

    if (!$stmt->execute()) {
        throw new Exception(
            "Kunde inte skapa produkten: " . $stmt->error
        );
    }

    $stmt->close();

    // -----------------------------------------
    // Klart
    // -----------------------------------------

    echo json_encode([
        "success" => true,
        "message" => "Produkten skapades",
        "product_id" => $id
    ]);

} catch (Throwable $error) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Serverfel vid skapande av produkt",
        "error" => $error->getMessage()
    ]);
}