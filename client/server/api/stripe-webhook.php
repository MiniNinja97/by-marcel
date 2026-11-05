<?php

header("Content-Type: application/json");

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/stripe.php";
require_once __DIR__ . "/send-order-email.php";
require_once __DIR__ . "/order-number.php";

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

            // -----------------------------------------
            // Starta transaktion
            // -----------------------------------------

            $conn->begin_transaction();

            try {

                // -----------------------------------------
                // Uppdatera order
                // -----------------------------------------
                //
                // Uppdatera endast en order som fortfarande
                // väntar på betalning.
                //
                // Om Stripe skickar samma event igen,
                // eller både completed och async-eventet,
                // ändras inte en redan behandlad order.
                // -----------------------------------------

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

$orderWasPaidNow = $stmt->affected_rows === 1;

$stmt->close();

// -----------------------------------------
// Skapa ordernummer efter bekräftad betalning
// -----------------------------------------

if ($orderWasPaidNow) {

    $orderNumber = generateOrderNumber($conn);

    $numberStmt = $conn->prepare("
        UPDATE orders
        SET order_number = ?
        WHERE id = ?
        AND order_number IS NULL
    ");

    $numberStmt->bind_param(
        "ss",
        $orderNumber,
        $orderId
    );

    $numberStmt->execute();

    if ($numberStmt->affected_rows !== 1) {
        throw new RuntimeException(
            "Ordernummer kunde inte sparas"
        );
    }

    $numberStmt->close();
}


                // -----------------------------------------
                // Aktivera presentkort i betald order
                // -----------------------------------------

                $giftCardStmt = $conn->prepare("
                    UPDATE gift_cards
                    SET
                        status = 'active',
                        activated_at = CURRENT_TIMESTAMP
                    WHERE order_id = ?
                    AND status = 'pending'
                ");

                $giftCardStmt->bind_param(
                    "s",
                    $orderId
                );

                $giftCardStmt->execute();
                $giftCardStmt->close();


                // -----------------------------------------
                // Slutför användning av presentkort
                // -----------------------------------------

                $redemptionStmt = $conn->prepare("
                    SELECT
                        id,
                        gift_card_id,
                        amount
                    FROM gift_card_redemptions
                    WHERE order_id = ?
                    AND status = 'reserved'
                    FOR UPDATE
                ");

                $redemptionStmt->bind_param(
                    "s",
                    $orderId
                );

                $redemptionStmt->execute();

                $redemptionResult =
                    $redemptionStmt->get_result();

                while (
                    $redemption =
                        $redemptionResult->fetch_assoc()
                ) {
                    $redemptionId =
                        (int) $redemption["id"];

                    $giftCardId =
                        (int) $redemption["gift_card_id"];

                    $amount =
                        (float) $redemption["amount"];


                    // Markera reservationen som slutförd.
                    $completeStmt = $conn->prepare("
                        UPDATE gift_card_redemptions
                        SET
                            status = 'completed',
                            completed_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                        AND status = 'reserved'
                    ");

                    $completeStmt->bind_param(
                        "i",
                        $redemptionId
                    );

                    $completeStmt->execute();

                    $wasCompleted =
                        $completeStmt->affected_rows === 1;

                    $completeStmt->close();


                    // Bara den webhook-körning som faktiskt
                    // slutförde reservationen får dra saldot.
                    if ($wasCompleted) {

                        $updateGiftCardStmt = $conn->prepare("
    UPDATE gift_cards
    SET
        status =
            CASE
                WHEN remaining_balance - ? <= 0
                    THEN 'used'
                ELSE 'active'
            END,
        remaining_balance =
            GREATEST(
                0,
                remaining_balance - ?
            )
    WHERE id = ?
");

                        $updateGiftCardStmt->bind_param(
                            "ddi",
                            $amount,
                            $amount,
                            $giftCardId
                        );

                        $updateGiftCardStmt->execute();
                        $updateGiftCardStmt->close();
                    }
                }

                $redemptionStmt->close();


                // -----------------------------------------
                // Allt lyckades
                // -----------------------------------------

                // -----------------------------------------
// -----------------------------------------
// Reservera ordermejlet
// -----------------------------------------

$shouldSendOrderEmail = false;

if ($orderWasPaidNow) {

    $emailStmt = $conn->prepare("
        UPDATE orders
        SET
            order_email_status = 'sending',
            order_email_started_at = NOW()
        WHERE id = ?
        AND status = 'processing'
        AND order_email_status = 'pending'
    ");

    $emailStmt->bind_param("s", $orderId);
    $emailStmt->execute();

    $shouldSendOrderEmail =
        $emailStmt->affected_rows === 1;

    $emailStmt->close();
}

$conn->commit();

} catch (Throwable $e) {
    $conn->rollback();
    throw $e;
}

// -----------------------------------------
// Skicka ordermejl efter bekräftad betalning
// -----------------------------------------

if ($shouldSendOrderEmail) {

    try {
        $emailSent = sendOrderEmail($conn, $orderId);

        $newEmailStatus = $emailSent ? "sent" : "pending";

        if (!$emailSent) {
    error_log(
        "Ordermejl kunde inte skickas för order " . $orderId
    );
}

       $emailStmt = $conn->prepare("
    UPDATE orders
    SET
        order_email_status = ?,
        order_email_sent_at =
            CASE
                WHEN ? = 'sent' THEN NOW()
                ELSE NULL
            END,
        order_email_started_at =
            CASE
                WHEN ? = 'sent' THEN order_email_started_at
                ELSE NULL
            END
    WHERE id = ?
    AND order_email_status = 'sending'
");

        $emailStmt->bind_param(
    "ssss",
    $newEmailStatus,
    $newEmailStatus,
    $newEmailStatus,
    $orderId
);

       $emailStmt->execute();

$wasUpdated = $emailStmt->affected_rows === 1;

$emailStmt->close();

if (!$wasUpdated) {
    throw new RuntimeException(
        "Mejlstatus kunde inte uppdateras för order " . $orderId
    );
}

  } catch (Throwable $emailError) {

    error_log(
        "Ordermejl behöver kontrolleras för order " .
        $orderId . ": " . $emailError->getMessage()
    );

    // Behåll statusen 'sending' vid oväntade fel.
    // Mejlet kan redan ha accepterats för utskick.
    // Kontrollera ordern manuellt innan ett nytt försök.
}
}

            
        }
    }

    // -----------------------------------------
// Stripe Checkout har löpt ut
// -----------------------------------------

if ($event->type === "checkout.session.expired") {

    $session = $event->data->object;

    $orderId =
        $session->metadata->order_id ?? null;

    if ($orderId) {

        $conn->begin_transaction();

        try {

            // -----------------------------------------
            // Frigör reserverat presentkortssaldo
            // -----------------------------------------
            //
            // Saldot har ännu inte dragits från
            // presentkortet. Därför ska vi bara
            // avbryta reservationen.
            // -----------------------------------------

            $cancelStmt = $conn->prepare("
                UPDATE gift_card_redemptions
                SET status = 'cancelled'
                WHERE order_id = ?
                AND status = 'reserved'
            ");

            $cancelStmt->bind_param(
                "s",
                $orderId
            );

            $cancelStmt->execute();
            $cancelStmt->close();


            // -----------------------------------------
            // Avbryt väntande order
            // -----------------------------------------

            $orderStmt = $conn->prepare("
                UPDATE orders
                SET status = 'cancelled'
                WHERE id = ?
                AND status = 'pending'
            ");

            $orderStmt->bind_param(
                "s",
                $orderId
            );

            $orderStmt->execute();
            $orderStmt->close();


            $conn->commit();

        } catch (Throwable $e) {

            $conn->rollback();

            throw $e;
        }
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
