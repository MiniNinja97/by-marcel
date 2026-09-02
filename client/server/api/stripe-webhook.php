<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/stripe.php";

// Stripe skickar webhookens innehåll som rå JSON.
$payload = file_get_contents("php://input");

// Stripe-signaturen används för att verifiera
// att anropet verkligen kommer från Stripe.
$signature = $_SERVER["HTTP_STRIPE_SIGNATURE"] ?? "";

if ($signature === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Stripe-Signature header saknas"
    ]);

    exit;
}

if (!isset($stripeWebhookSecret) || $stripeWebhookSecret === "") {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "Webhook secret saknas"
    ]);

    exit;
}



try {
    // Verifiera webhooken.
    $event = \Stripe\Webhook::constructEvent(
        $payload,
        $signature,
        $stripeWebhookSecret
    );

    // Vi reagerar när Stripe Checkout är färdig.
    if ($event->type === "checkout.session.completed") {

        $session = $event->data->object;

        // Kontrollera att betalningen verkligen är betald.
        if ($session->payment_status === "paid") {

            $orderId = $session->metadata->order_id ?? null;
            $paymentIntentId = $session->payment_intent ?? null;

            if (!$orderId) {
                throw new Exception("Order-ID saknas i Stripe metadata.");
            }

            // Uppdatera endast en order som fortfarande väntar på betalning.
            // Det gör webhooken säker att köra flera gånger.
            $stmt = $conn->prepare("
    UPDATE orders
    SET
        status = 'processing',
        stripe_payment_id = ?
    WHERE id = ?
    AND status = 'pending'
");

$stmt->bind_param(
    "ss",
    $paymentIntentId,
    $orderId
);

$stmt->execute();
        }
    }

    http_response_code(200);

    echo json_encode([
        "success" => true
    ]);

} catch (\Stripe\Exception\SignatureVerificationException $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Ogiltig Stripe-signatur"
    ]);

} catch (Throwable $e) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}