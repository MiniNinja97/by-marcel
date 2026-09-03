<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/stripe.php";

$sessionId = $_GET["session_id"] ?? "";

if ($sessionId === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Session-ID saknas"
    ]);

    exit;
}

try {
    // Hämta Checkout-sessionen direkt från Stripe
    $session = \Stripe\Checkout\Session::retrieve($sessionId);

    $orderId = $session->metadata->order_id ?? null;
    $stripePaid = $session->payment_status === "paid";

    if (!$orderId) {
        throw new Exception("Order-ID saknas i Stripe-sessionen.");
    }

    // Kontrollera även ordern i vår egen databas
    $stmt = $conn->prepare("
        SELECT
            id,
            status,
            stripe_payment_id,
            total_price
        FROM orders
        WHERE id = ?
        LIMIT 1
    ");

    $stmt->bind_param("s", $orderId);
    $stmt->execute();

    $result = $stmt->get_result();
    $order = $result->fetch_assoc();

    if (!$order) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "error" => "Ordern hittades inte"
        ]);

        exit;
    }

    $orderConfirmed = in_array(
        $order["status"],
        ["processing", "shipped", "delivered"],
        true
    );

    $verified = $stripePaid && $orderConfirmed;

    echo json_encode([
        "success" => true,
        "verified" => $verified,
        "stripe_paid" => $stripePaid,
        "order_id" => $order["id"],
        "order_status" => $order["status"],
        "total_price" => (float) $order["total_price"]
    ]);

} catch (\Stripe\Exception\ApiErrorException $e) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Stripe-sessionen kunde inte verifieras"
    ]);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "Ett serverfel uppstod"
    ]);
}