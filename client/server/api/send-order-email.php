<?php

function sendOrderEmail(mysqli $conn, string $orderId): bool
{
    // Hämta ordern och kunduppgifterna
    $stmt = $conn->prepare("
        SELECT
            o.id,
            o.created_at,
            o.subtotal,
            o.discount_amount,
            o.shipping,
            o.total_price,
            o.customer_notes,
            o.status,

            c.first_name,
            c.last_name,
            c.email,
            c.phone_number,
            c.address,
            c.zip_code,
            c.city,
            c.state,
            c.country

        FROM orders AS o

        INNER JOIN customers AS c
            ON o.customer_id = c.id

        WHERE o.id = ?
        AND o.status = 'processing'
    ");

    $stmt->bind_param("s", $orderId);
    $stmt->execute();

    $result = $stmt->get_result();
    $order = $result->fetch_assoc();

    $stmt->close();

    if (!$order) {
        return false;
    }

   // -----------------------------------------
// Hämta alla produkter i ordern
// -----------------------------------------

$itemStmt = $conn->prepare("
    SELECT
        product_id,
        product_name,
        supplier_id,
        quantity,
        unit_price,
        weight,
        selected_size,
        selected_shape,
        selected_color,
        selected_background_color,
        selected_print_color,
        selected_font,
        selected_options,
custom_photo_url,
custom_photo_urls,
custom_text,
custom_texts,
additional_requests
    FROM order_items
    WHERE order_id = ?
");

$itemStmt->bind_param("s", $orderId);
$itemStmt->execute();

$itemResult = $itemStmt->get_result();

$items = [];
$attachmentUrls = [];

while ($item = $itemResult->fetch_assoc()) {
    $items[] = $item;

    // Produkter med en kundbild
    if (!empty($item["custom_photo_url"])) {
        $attachmentUrls[] = $item["custom_photo_url"];
    }

    // Bildgravyr med upp till tre kundbilder
    if (!empty($item["custom_photo_urls"])) {
        $photoUrls = json_decode($item["custom_photo_urls"], true);

        if (is_array($photoUrls)) {
            foreach ($photoUrls as $photoUrl) {
                $attachmentUrls[] = $photoUrl;
            }
        }
    }
}

$itemStmt->close();

// -----------------------------------------
// Bygg ordermejlet
// -----------------------------------------

$to = "order@bymarcel.se";

$subject = "Ny betald order - " . $order["id"];

$body = "NY BETALD ORDER - BY MARCEL\n";
$body .= "================================\n\n";

$body .= "Ordernummer: " . $order["id"] . "\n";
$body .= "Orderdatum: " . $order["created_at"] . "\n\n";

// Kunduppgifter
$body .= "KUNDUPPGIFTER\n";
$body .= "--------------------------------\n";

$body .= "Namn: " . $order["first_name"] . " " . $order["last_name"] . "\n";
$body .= "E-post: " . $order["email"] . "\n";
$body .= "Telefon: " . ($order["phone_number"] ?: "-") . "\n\n";

// Leveransadress
$body .= "LEVERANSADRESS\n";
$body .= "--------------------------------\n";

$body .= ($order["address"] ?: "-") . "\n";
$body .= trim(($order["zip_code"] ?? "") . " " . ($order["city"] ?? "")) . "\n";

if (!empty($order["state"])) {
    $body .= $order["state"] . "\n";
}

$body .= ($order["country"] ?: "Sverige") . "\n\n";

$body .= "BESTÄLLDA PRODUKTER\n";
$body .= "================================\n\n";

foreach ($items as $index => $item) {

    $body .= ($index + 1) . ". " . $item["product_name"] . "\n";
    $body .= "Produkt-ID: " . $item["product_id"] . "\n";

    if (!empty($item["supplier_id"])) {
        $body .= "Leverantör: " . $item["supplier_id"] . "\n";
    }

    $body .= "Antal: " . $item["quantity"] . "\n";
    $body .= "Styckpris: " . number_format((float) $item["unit_price"], 2, ",", " ") . " kr\n";
    $body .= "Radtotal: " . number_format(
        (float) $item["unit_price"] * (int) $item["quantity"],
        2, ",", " "
    ) . " kr\n";

    foreach ([
        "selected_size" => "Storlek",
        "selected_shape" => "Form",
        "selected_color" => "Färg",
        "selected_font" => "Typsnitt",
        "custom_text" => "Personlig text",
        "additional_requests" => "Övriga önskemål"
    ] as $field => $label) {
        if (!empty($item[$field])) {
            $body .= $label . ": " . $item[$field] . "\n";
        }
    }

    // Dynamiska produktval och personliga textrader
    foreach ([
        "selected_options" => "Produktval",
        "custom_texts" => "Personliga texter"
    ] as $field => $heading) {

        if (empty($item[$field])) {
            continue;
        }

        $values = json_decode($item[$field], true);

        if (is_array($values) && !empty($values)) {
    $body .= $heading . ":\n";

            foreach ($values as $name => $value) {
                if (is_scalar($value)) {
                    $body .= "  " . $name . ": " .
                        (is_bool($value) ? ($value ? "Ja" : "Nej") : $value) . "\n";
                }
            }
        }
    }

    // Bakgrundsfärg och tryckfärg
    foreach ([
        "selected_background_color" => "Bakgrundsfärg",
        "selected_print_color" => "Tryckfärg"
    ] as $field => $label) {

        if (empty($item[$field])) {
            continue;
        }

        $color = json_decode($item[$field], true);

        if (is_array($color)) {
            $body .= $label . ": " . ($color["name"] ?? "-") . "\n";

            if (!empty($color["ral_code"])) {
                $body .= "  RAL: " . $color["ral_code"] . "\n";
            }

            if (!empty($color["supplier_code"])) {
                $body .= "  Leverantörskod: " . $color["supplier_code"] . "\n";
            }
        }
    }

    if (!empty($item["custom_photo_url"])) {
        $body .= "Kundens bild: " . $item["custom_photo_url"] . "\n";
    }

    if (!empty($item["custom_photo_urls"])) {
    $photoUrls = json_decode($item["custom_photo_urls"], true);

    if (is_array($photoUrls)) {
        foreach ($photoUrls as $index => $photoUrl) {
            $body .= "Kundens bild " . ($index + 1) . ": "
                . $photoUrl . "\n";
        }
    }
}

    $body .= "\n--------------------------------\n\n";
}

$body .= "ORDERSAMMANFATTNING\n";
$body .= "================================\n";

$body .= "Delsumma: " .
    number_format((float) $order["subtotal"], 2, ",", " ") . " kr\n";

if ((float) $order["discount_amount"] > 0) {
    $body .= "Rabatt: -" .
        number_format((float) $order["discount_amount"], 2, ",", " ") . " kr\n";
}

$body .= "Frakt: " .
    number_format((float) $order["shipping"], 2, ",", " ") . " kr\n";

$body .= "TOTALT: " .
    number_format((float) $order["total_price"], 2, ",", " ") . " kr\n\n";

if (!empty($order["customer_notes"])) {
    $body .= "ÖVRIGA ÖNSKEMÅL FÖR HELA ORDERN\n";
    $body .= $order["customer_notes"] . "\n\n";
}

$body .= "Betalning: Bekräftad via Stripe\n";

// -----------------------------------------
// Förbered bildbilagor
// -----------------------------------------

$attachments = [];

foreach ($attachmentUrls as $index => $photoUrl) {

    // Tillåt endast våra egna uppladdade kundbilder
    if (
        !is_string($photoUrl) ||
        !preg_match(
            '~^/uploads/customerUploads/[a-f0-9]{32}\.(jpg|png|webp)$~i',
            $photoUrl
        )
    ) {
        error_log("Ogiltig bildadress i order " . $orderId);
        return false;
    }

    $filePath = __DIR__ . "/../../uploads/customerUploads/" . basename($photoUrl);

    if (!is_file($filePath) || !is_readable($filePath)) {
        error_log("Bildfil saknas i order " . $orderId);
        return false;
    }

    $mimeType = mime_content_type($filePath);

    if (!in_array($mimeType, [
        "image/jpeg",
        "image/png",
        "image/webp"
    ], true)) {
        error_log("Ogiltig bildtyp i order " . $orderId);
        return false;
    }

    $fileContents = file_get_contents($filePath);

    if ($fileContents === false) {
        error_log("Kunde inte läsa bildfil i order " . $orderId);
        return false;
    }

    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

    $attachments[] = [
        "name" => "orderbild-" . ($index + 1) . "." . $extension,
        "type" => $mimeType,
        "content" => $fileContents
    ];
}

// -----------------------------------------
// Bygg mejlet med bilagor
// -----------------------------------------

$boundary = "bymarcel_" . bin2hex(random_bytes(16));

$headers = [
    "From: By Marcel <order@bymarcel.se>",
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"'
];

if (filter_var($order["email"], FILTER_VALIDATE_EMAIL)) {
    $headers[] = "Reply-To: " . $order["email"];
}

$emailBody = "";

// Mejlets vanliga text
$emailBody .= "--" . $boundary . "\r\n";
$emailBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
$emailBody .= "Content-Transfer-Encoding: base64\r\n\r\n";
$emailBody .= chunk_split(base64_encode($body), 76, "\r\n");

// Bifoga bilderna
foreach ($attachments as $attachment) {

    $emailBody .= "--" . $boundary . "\r\n";
    $emailBody .= "Content-Type: " . $attachment["type"] .
        '; name="' . $attachment["name"] . '"' . "\r\n";

    $emailBody .= "Content-Disposition: attachment; filename=\"" .
        $attachment["name"] . "\"\r\n";

    $emailBody .= "Content-Transfer-Encoding: base64\r\n\r\n";

    $emailBody .= chunk_split(
        base64_encode($attachment["content"]),
        76,
        "\r\n"
    );
}

$emailBody .= "--" . $boundary . "--\r\n";

// -----------------------------------------
// Skicka ordermejlet
// -----------------------------------------

$sent = mail(
    $to,
    $subject,
    $emailBody,
    implode("\r\n", $headers)
);

return $sent;
}