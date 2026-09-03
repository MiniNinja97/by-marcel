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

    // -----------------------------------------
    // Betalningen är klar
    // -----------------------------------------
    //
    // checkout.session.completed:
    // Checkout avslutades. Vi uppdaterar bara
    // ordern om Stripe redan säger "paid".
    //
    // checkout.session.async_payment_succeeded:
    // En betalning som behövde mer tid har
    // senare blivit bekräftad av Stripe.
    // -----------------------------------------

    if (
        $event->type === "checkout.session.completed" ||
        $event->type === "checkout.session.async_payment_succeeded"
    ) {
        $session = $event->data->object;

        // Uppdatera bara när Stripe verkligen
        // har bekräftat betalningen.
        if ($session->payment_status === "paid") {
            $orderId =
                $session->metadata->order_id ?? null;

            $paymentIntentId =
                $session->payment_intent ?? null;

            if (!$orderId) {
                throw new Exception(
                    "Order-ID saknas i Stripe metadata."
                );
            }

            // Uppdatera endast en order som fortfarande
            // väntar på betalning.
            //
            // Om Stripe skickar samma event igen,
            // eller både completed och async-eventet,
            // ändras inte en redan behandlad order.
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
            $stmt->close();
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