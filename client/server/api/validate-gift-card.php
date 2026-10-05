<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . "/../config/db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

// Presentkortskoder sparas med stora bokstäver.
// Kunden kan därför skriva både bm-xxxx-xxxx och BM-XXXX-XXXX.
$code = strtoupper(
    trim($data["code"] ?? "")
);

if ($code === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Presentkortskod saknas"
    ]);

    exit;
}


// -----------------------------------------
// Hämta presentkortet
// -----------------------------------------

$stmt = $conn->prepare("
    SELECT
        id,
        code,
        remaining_balance,
        status
    FROM gift_cards
    WHERE code = ?
    LIMIT 1
");

$stmt->bind_param("s", $code);
$stmt->execute();

$result = $stmt->get_result();
$giftCard = $result->fetch_assoc();

$stmt->close();


if (!$giftCard) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "error" => "Ogiltig presentkortskod"
    ]);

    exit;
}


if ($giftCard["status"] !== "active") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Presentkortet är inte aktivt"
    ]);

    exit;
}


// -----------------------------------------
// Kontrollera redan reserverat belopp
// -----------------------------------------

$giftCardId =
    (int) $giftCard["id"];

$reservedStmt = $conn->prepare("
    SELECT
        COALESCE(SUM(amount), 0) AS reserved_amount
    FROM gift_card_redemptions
    WHERE gift_card_id = ?
    AND status = 'reserved'
");

$reservedStmt->bind_param(
    "i",
    $giftCardId
);

$reservedStmt->execute();

$reservedResult =
    $reservedStmt->get_result();

$reservedRow =
    $reservedResult->fetch_assoc();

$reservedStmt->close();


$reservedAmount =
    (float) ($reservedRow["reserved_amount"] ?? 0);


// -----------------------------------------
// Räkna ut faktiskt tillgängligt saldo
// -----------------------------------------

$remainingBalance =
    (float) $giftCard["remaining_balance"];

$availableBalance = max(
    0,
    $remainingBalance - $reservedAmount
);


if ($availableBalance <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Presentkortet saknar tillgängligt saldo"
    ]);

    exit;
}


// -----------------------------------------
// Skicka tillgängligt saldo till frontend
// -----------------------------------------

echo json_encode([
    "success" => true,
    "code" => $giftCard["code"],
    "remaining_balance" => $availableBalance
]);