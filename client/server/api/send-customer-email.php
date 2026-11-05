<?php

function sendCustomerEmail(mysqli $conn, string $orderId): bool
{
    // -----------------------------------------
    // Hämta order och kunduppgifter
    // -----------------------------------------

    $stmt = $conn->prepare("
        SELECT
            o.id,
            o.order_number,
            o.created_at,
            o.subtotal,
            o.discount_amount,
            o.shipping,
            o.total_price,
            o.status,
            o.language,

            c.first_name,
            c.last_name,
            c.email,
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

    // Använd orderns befintliga ordernummer
    $displayOrderNumber = $order["order_number"] ?: $order["id"];

    // Kundens språkval
    $language = $order["language"] === "en" ? "en" : "sv";

        // -----------------------------------------
    // Hämta alla produkter i ordern
    // -----------------------------------------

    $itemStmt = $conn->prepare("
        SELECT
            id,
            product_name,
            quantity,
            unit_price,
            selected_size,
            selected_shape,
            selected_color,
            selected_background_color,
            selected_print_color,
            selected_font,
            selected_options,
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

    while ($item = $itemResult->fetch_assoc()) {

        // Hämta eventuella presentkort för produkten
        $giftCardStmt = $conn->prepare("
            SELECT
                code,
                initial_amount
            FROM gift_cards
            WHERE order_item_id = ?
        ");

        $giftCardStmt->bind_param("s", $item["id"]);
        $giftCardStmt->execute();

        $giftCardResult = $giftCardStmt->get_result();

        $item["gift_cards"] = $giftCardResult->fetch_all(MYSQLI_ASSOC);

        $giftCardStmt->close();

        $items[] = $item;
    }

    $itemStmt->close();

        // -----------------------------------------
    // Texter för svenska och engelska
    // -----------------------------------------

    $translations = [
        "sv" => [
            "subject" => "Orderbekräftelse - By Marcel",
            "heading" => "Tack för din beställning!",
            "greeting" => "Hej",
            "intro" => "Tack för att du handlar hos By Marcel! Vi har tagit emot din beställning och din betalning är bekräftad.",
            "order_number" => "Ordernummer",
            "order_date" => "Orderdatum",
            "products" => "Beställda produkter",
            "quantity" => "Antal",
            "unit_price" => "Styckpris",
            "size" => "Storlek",
            "shape" => "Form",
            "color" => "Färg",
            "background_color" => "Bakgrundsfärg",
            "print_color" => "Tryckfärg",
            "font" => "Typsnitt",
            "custom_text" => "Personlig text",
            "custom_texts" => "Personliga texter",
            "selected_options" => "Produktval",
            "additional_requests" => "Övriga önskemål",
            "gift_card_code" => "Presentkortskod",
            "gift_card_value" => "Presentkortsvärde",
            "subtotal" => "Delsumma",
            "discount" => "Rabatt",
            "shipping" => "Frakt",
            "total" => "Totalt betalt",
            "delivery_address" => "Leveransadress",
            "outro" => "Tack för att du handlar hos oss!",
            "regards" => "Vänliga hälsningar",
        ],

        "en" => [
            "subject" => "Order confirmation - By Marcel",
            "heading" => "Thank you for your order!",
            "greeting" => "Hello",
            "intro" => "Thank you for shopping at By Marcel! We have received your order and your payment has been confirmed.",
            "order_number" => "Order number",
            "order_date" => "Order date",
            "products" => "Ordered products",
            "quantity" => "Quantity",
            "unit_price" => "Unit price",
            "size" => "Size",
            "shape" => "Shape",
            "color" => "Color",
            "background_color" => "Background color",
            "print_color" => "Print color",
            "font" => "Font",
            "custom_text" => "Personalized text",
            "custom_texts" => "Personalized texts",
            "selected_options" => "Product options",
            "additional_requests" => "Additional requests",
            "gift_card_code" => "Gift card code",
            "gift_card_value" => "Gift card value",
            "subtotal" => "Subtotal",
            "discount" => "Discount",
            "shipping" => "Shipping",
            "total" => "Total paid",
            "delivery_address" => "Delivery address",
            "outro" => "Thank you for shopping with us!",
            "regards" => "Kind regards",
        ],
    ];

    // Välj rätt språk
    $t = $translations[$language];

        // -----------------------------------------
    // Hjälpfunktion för säker HTML
    // -----------------------------------------

    $escape = static fn($value): string =>
        htmlspecialchars((string) ($value ?? ""), ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");

    // -----------------------------------------
    // Förbered orderinformationen
    // -----------------------------------------

    $customerName = $escape($order["first_name"]);
    $orderNumber = $escape($displayOrderNumber);
    $orderDate = $escape(date("Y-m-d", strtotime($order["created_at"])));

    // -----------------------------------------
    // Bygg HTML-mejlet
    // -----------------------------------------

    $html = '
    <!DOCTYPE html>
    <html lang="' . $language . '">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>' . $escape($t["subject"]) . '</title>
    </head>

    <body style="
        margin: 0;
        padding: 30px 15px;
        background-color: #f5f5f5;
        font-family: Arial, Helvetica, sans-serif;
        color: #333333;
    ">

        <table role="presentation" cellpadding="0" cellspacing="0"
            style="
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-collapse: collapse;
            ">

            <tr>
                <td style="
                    padding: 35px 30px;
                    text-align: center;
                    border-bottom: 1px solid #eeeeee;
                ">
                    <h1 style="
                        margin: 0;
                        font-size: 28px;
                        font-weight: normal;
                        letter-spacing: 3px;
                    ">
                        BY MARCEL
                    </h1>
                </td>
            </tr>

            <tr>
                <td style="padding: 35px 30px;">

                    <h2 style="
                        margin: 0 0 25px;
                        font-size: 23px;
                        font-weight: normal;
                    ">
                        ' . $escape($t["heading"]) . '
                    </h2>

                    <p style="font-size: 15px; line-height: 1.7;">
                        ' . $escape($t["greeting"]) . ' ' . $customerName . '!
                    </p>

                    <p style="font-size: 15px; line-height: 1.7;">
                        ' . $escape($t["intro"]) . '
                    </p>

                    <table role="presentation" cellpadding="0" cellspacing="0"
                        style="
                            width: 100%;
                            margin-top: 30px;
                            border-collapse: collapse;
                        ">

                        <tr>
                            <td style="padding: 8px 0; font-size: 14px;">
                                <strong>' . $escape($t["order_number"]) . ':</strong>
                            </td>
                            <td style="padding: 8px 0; text-align: right; font-size: 14px;">
                                ' . $orderNumber . '
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 8px 0; font-size: 14px;">
                                <strong>' . $escape($t["order_date"]) . ':</strong>
                            </td>
                            <td style="padding: 8px 0; text-align: right; font-size: 14px;">
                                ' . $orderDate . '
                            </td>
                        </tr>

                    </table>

                    <!-- ORDER_PRODUCTS -->

                </td>
            </tr>

        </table>

    </body>
    </html>
    ';

        // -----------------------------------------
    // Bygg produktlistan
    // -----------------------------------------

    $productsHtml = '
        <h3 style="
            margin: 35px 0 20px;
            font-size: 19px;
            font-weight: normal;
            border-bottom: 1px solid #eeeeee;
            padding-bottom: 12px;
        ">
            ' . $escape($t["products"]) . '
        </h3>
    ';

    foreach ($items as $item) {

        $productName = $escape($item["product_name"]);
        $quantity = (int) $item["quantity"];
        $unitPrice = (float) $item["unit_price"];
        $lineTotal = $quantity * $unitPrice;

        $formattedPrice = number_format(
            $lineTotal,
            2,
            $language === "sv" ? "," : ".",
            " "
        );

                // -----------------------------------------
        // Produktens personliga anpassningar
        // -----------------------------------------

        $customizationsHtml = "";

        $customizationFields = [
            "selected_size" => "size",
            "selected_shape" => "shape",
            "selected_color" => "color",
            "selected_font" => "font",
            "custom_text" => "custom_text",
            "additional_requests" => "additional_requests"
        ];

        foreach ($customizationFields as $field => $translationKey) {

            if (empty($item[$field])) {
                continue;
            }

            $customizationsHtml .= '
                <p style="
                    margin: 4px 0;
                    font-size: 13px;
                    color: #666666;
                    line-height: 1.5;
                ">
                    <strong>' . $escape($t[$translationKey]) . ':</strong>
                    ' . nl2br($escape($item[$field])) . '
                </p>
            ';
        }

                // -----------------------------------------
        // JSON-baserade produktval
        // -----------------------------------------

        $jsonFields = [
            "selected_options" => "selected_options",
            "custom_texts" => "custom_texts"
        ];

        foreach ($jsonFields as $field => $translationKey) {

            if (empty($item[$field])) {
                continue;
            }

            $values = json_decode($item[$field], true);

            if (!is_array($values) || empty($values)) {
                continue;
            }

            $customizationsHtml .= '
                <p style="
                    margin: 8px 0 4px;
                    font-size: 13px;
                    color: #666666;
                ">
                    <strong>' . $escape($t[$translationKey]) . ':</strong>
                </p>
            ';

            foreach ($values as $name => $value) {

                if (!is_scalar($value)) {
                    continue;
                }

                if (is_bool($value)) {
                    $displayValue = $value
                        ? ($language === "sv" ? "Ja" : "Yes")
                        : ($language === "sv" ? "Nej" : "No");
                } else {
                    $displayValue = (string) $value;
                }

                $customizationsHtml .= '
                    <p style="
                        margin: 3px 0 3px 12px;
                        font-size: 13px;
                        color: #666666;
                        line-height: 1.5;
                    ">
                        <strong>' . $escape($name) . ':</strong>
                        ' . nl2br($escape($displayValue)) . '
                    </p>
                ';
            }
        }
                // -----------------------------------------
        // Bakgrundsfärg och tryckfärg
        // -----------------------------------------

        $colorFields = [
            "selected_background_color" => "background_color",
            "selected_print_color" => "print_color"
        ];

        foreach ($colorFields as $field => $translationKey) {

            if (empty($item[$field])) {
                continue;
            }

            $color = json_decode($item[$field], true);

            if (!is_array($color)) {
                continue;
            }

            $colorName = $color["name"] ?? "-";

            $customizationsHtml .= '
                <p style="
                    margin: 4px 0;
                    font-size: 13px;
                    color: #666666;
                    line-height: 1.5;
                ">
                    <strong>' . $escape($t[$translationKey]) . ':</strong>
                    ' . $escape($colorName) . '
                </p>
            ';

            if (!empty($color["ral_code"])) {
                $customizationsHtml .= '
                    <p style="
                        margin: 3px 0 3px 12px;
                        font-size: 12px;
                        color: #777777;
                    ">
                        RAL: ' . $escape($color["ral_code"]) . '
                    </p>
                ';
            }

            if (!empty($color["supplier_code"])) {
                $customizationsHtml .= '
                    <p style="
                        margin: 3px 0 3px 12px;
                        font-size: 12px;
                        color: #777777;
                    ">
                        ' . ($language === "sv" ? "Leverantörskod" : "Supplier code") . ':
                        ' . $escape($color["supplier_code"]) . '
                    </p>
                ';
            }
        }
                // -----------------------------------------
        // Presentkort kopplade till produkten
        // -----------------------------------------

        if (!empty($item["gift_cards"])) {

            foreach ($item["gift_cards"] as $giftCard) {

                $giftCardCode = $escape($giftCard["code"]);

                $giftCardValue = number_format(
                    (float) $giftCard["initial_amount"],
                    2,
                    $language === "sv" ? "," : ".",
                    " "
                );

                $customizationsHtml .= '
                    <p style="
                        margin: 8px 0 4px;
                        font-size: 13px;
                        color: #333333;
                        line-height: 1.5;
                    ">
                        <strong>' . $escape($t["gift_card_code"]) . ':</strong>
                        ' . $giftCardCode . '
                    </p>

                    <p style="
                        margin: 4px 0;
                        font-size: 13px;
                        color: #666666;
                        line-height: 1.5;
                    ">
                        <strong>' . $escape($t["gift_card_value"]) . ':</strong>
                        ' . $giftCardValue . ' kr
                    </p>
                ';
            }
        }

        $productsHtml .= '
            <table role="presentation" cellpadding="0" cellspacing="0"
                style="
                    width: 100%;
                    border-bottom: 1px solid #eeeeee;
                    margin-bottom: 20px;
                    border-collapse: collapse;
                ">
                <tr>
                    <td style="padding: 12px 0; vertical-align: top;">
                        <strong style="font-size: 15px;">
                            ' . $productName . '
                        </strong>

                        <p style="
                            margin: 8px 0;
                            font-size: 13px;
                            color: #666666;
                        ">
                            ' . $escape($t["quantity"]) . ': ' . $quantity . '
                        </p>
                                                ' . $customizationsHtml . '
                    </td>

                    <td style="
                        padding: 12px 0;
                        text-align: right;
                        vertical-align: top;
                        white-space: nowrap;
                        font-size: 14px;
                    ">
                        ' . $formattedPrice . ' kr
                    </td>
                </tr>
            </table>
        ';
    }

    // Lägg in produkterna i HTML-mallen
    $html = str_replace(
        "<!-- ORDER_PRODUCTS -->",
        $productsHtml,
        $html
    );

        // -----------------------------------------
    // Ordersammanfattning
    // -----------------------------------------

    $formatPrice = static function ($amount) use ($language): string {
        return number_format(
            (float) $amount,
            2,
            $language === "sv" ? "," : ".",
            " "
        ) . " kr";
    };

    $summaryRows = [
        [
            "label" => $t["subtotal"],
            "value" => $formatPrice($order["subtotal"])
        ]
    ];

    // Visa rabatt endast om en rabatt har använts
    if ((float) $order["discount_amount"] > 0) {
        $summaryRows[] = [
            "label" => $t["discount"],
            "value" => "-" . $formatPrice($order["discount_amount"])
        ];
    }

    $summaryRows[] = [
        "label" => $t["shipping"],
        "value" => $formatPrice($order["shipping"])
    ];

    $summaryHtml = '
        <h3 style="
            margin: 35px 0 20px;
            font-size: 19px;
            font-weight: normal;
            border-bottom: 1px solid #eeeeee;
            padding-bottom: 12px;
        ">
            ' . $escape($language === "sv"
                ? "Ordersammanfattning"
                : "Order summary") . '
        </h3>

        <table role="presentation"
            cellpadding="0"
            cellspacing="0"
            style="width: 100%; border-collapse: collapse;">
    ';

    foreach ($summaryRows as $row) {
        $summaryHtml .= '
            <tr>
                <td style="
                    padding: 8px 0;
                    font-size: 14px;
                    color: #666666;
                ">
                    ' . $escape($row["label"]) . '
                </td>

                <td style="
                    padding: 8px 0;
                    font-size: 14px;
                    text-align: right;
                ">
                    ' . $escape($row["value"]) . '
                </td>
            </tr>
        ';
    }

    $summaryHtml .= '
            <tr>
                <td style="
                    padding: 16px 0;
                    border-top: 1px solid #dddddd;
                    font-size: 16px;
                    font-weight: bold;
                ">
                    ' . $escape($t["total"]) . '
                </td>

                <td style="
                    padding: 16px 0;
                    border-top: 1px solid #dddddd;
                    font-size: 16px;
                    font-weight: bold;
                    text-align: right;
                ">
                    ' . $escape($formatPrice($order["total_price"])) . '
                </td>
            </tr>
        </table>
    ';

    // Lägg ordersammanfattningen efter produktlistan
    $html = str_replace(
        $productsHtml,
        $productsHtml . $summaryHtml,
        $html
    );

       // -----------------------------------------
    // Leveransadress
    // -----------------------------------------

    $fullName = trim(
        ($order["first_name"] ?? "") . " " .
        ($order["last_name"] ?? "")
    );

    $addressLines = [
        $fullName,
        $order["address"] ?? "",
        trim(
            ($order["zip_code"] ?? "") . " " .
            ($order["city"] ?? "")
        ),
        $order["state"] ?? "",
        $order["country"] ?? ""
    ];

    // Ta bort tomma adressrader
    $addressLines = array_filter(
        $addressLines,
        static fn($line) => trim($line) !== ""
    );

    $addressHtml = implode(
        "<br>",
        array_map($escape, $addressLines)
    );

    // -----------------------------------------
    // Leveransadress och avslutning
    // -----------------------------------------

    $footerHtml = '
        <h3 style="
            margin: 35px 0 20px;
            font-size: 19px;
            font-weight: normal;
            border-bottom: 1px solid #eeeeee;
            padding-bottom: 12px;
        ">
            ' . $escape($t["delivery_address"]) . '
        </h3>

        <p style="
            font-size: 14px;
            line-height: 1.8;
            color: #555555;
        ">
            ' . $addressHtml . '
        </p>

        <p style="
            margin-top: 35px;
            font-size: 15px;
            line-height: 1.7;
        ">
            ' . $escape($t["outro"]) . '
        </p>

        <p style="
            margin-top: 20px;
            font-size: 14px;
            line-height: 1.7;
        ">
            ' . $escape($t["regards"]) . ',<br>
            <strong>By Marcel</strong>
        </p>
    ';

    // Lägg till innehållet efter ordersammanfattningen
    $html = str_replace(
        $summaryHtml,
        $summaryHtml . $footerHtml,
        $html
    );

        // -----------------------------------------
    // Förbered kundens mejl
    // -----------------------------------------

    $to = $order["email"];

    // Kontrollera kundens e-postadress
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        error_log("Ogiltig kundadress för order " . $orderId);
        return false;
    }

    $subject = "=?UTF-8?B?" .
    base64_encode($t["subject"] . " - " . $displayOrderNumber) .
    "?=";

    // -----------------------------------------
    // Textversion som reserv
    // -----------------------------------------

    $plainText = $t["heading"] . "\n\n";

    $plainText .= $t["greeting"] . " " .
        $order["first_name"] . "!\n\n";

    $plainText .= $t["intro"] . "\n\n";

    $plainText .= $t["order_number"] . ": " .
        $displayOrderNumber . "\n";

    $plainText .= $t["order_date"] . ": " .
        date("Y-m-d", strtotime($order["created_at"])) . "\n\n";

        $plainText .= $t["products"] . "\n";
    $plainText .= "-----------------------------\n";

    foreach ($items as $item) {

        $plainText .= "\n" . $item["product_name"] . "\n";

        $plainText .= $t["quantity"] . ": " .
            $item["quantity"] . "\n";

        $plainText .= $t["unit_price"] . ": " .
            $formatPrice($item["unit_price"]) . "\n";

        // Vanliga produktanpassningar
        $fields = [
            "selected_size" => "size",
            "selected_shape" => "shape",
            "selected_color" => "color",
            "selected_font" => "font",
            "custom_text" => "custom_text",
            "additional_requests" => "additional_requests"
        ];

        foreach ($fields as $field => $translationKey) {
            if (!empty($item[$field])) {
                $plainText .= $t[$translationKey] . ": " .
                    $item[$field] . "\n";
            }
        }

        // JSON-baserade produktval
        foreach ([
            "selected_options" => "selected_options",
            "custom_texts" => "custom_texts"
        ] as $field => $translationKey) {

            if (empty($item[$field])) {
                continue;
            }

            $values = json_decode($item[$field], true);

            if (!is_array($values) || empty($values)) {
                continue;
            }

            $plainText .= $t[$translationKey] . ":\n";

            foreach ($values as $name => $value) {

                if (!is_scalar($value)) {
                    continue;
                }

                if (is_bool($value)) {
                    $value = $value
                        ? ($language === "sv" ? "Ja" : "Yes")
                        : ($language === "sv" ? "Nej" : "No");
                }

                $plainText .= "  " . $name . ": " . $value . "\n";
            }
        }

        // Bakgrundsfärg och tryckfärg
        foreach ([
            "selected_background_color" => "background_color",
            "selected_print_color" => "print_color"
        ] as $field => $translationKey) {

            if (empty($item[$field])) {
                continue;
            }

            $color = json_decode($item[$field], true);

            if (!is_array($color)) {
                continue;
            }

            $plainText .= $t[$translationKey] . ": " .
                ($color["name"] ?? "-") . "\n";

            if (!empty($color["ral_code"])) {
                $plainText .= "  RAL: " .
                    $color["ral_code"] . "\n";
            }

            if (!empty($color["supplier_code"])) {
                $plainText .= "  " .
                    ($language === "sv" ? "Leverantörskod" : "Supplier code") .
                    ": " . $color["supplier_code"] . "\n";
            }
        }

        // Köpta presentkort
        foreach ($item["gift_cards"] ?? [] as $giftCard) {

            $plainText .= $t["gift_card_code"] . ": " .
                $giftCard["code"] . "\n";

            $plainText .= $t["gift_card_value"] . ": " .
                $formatPrice($giftCard["initial_amount"]) . "\n";
        }
    }

    // Ordersammanfattning
    $plainText .= "\n-----------------------------\n";

    $plainText .= $t["subtotal"] . ": " .
        $formatPrice($order["subtotal"]) . "\n";

    if ((float) $order["discount_amount"] > 0) {
        $plainText .= $t["discount"] . ": -" .
            $formatPrice($order["discount_amount"]) . "\n";
    }

    $plainText .= $t["shipping"] . ": " .
        $formatPrice($order["shipping"]) . "\n";

    $plainText .= $t["total"] . ": " .
        $formatPrice($order["total_price"]) . "\n\n";

    // Leveransadress
    $plainText .= $t["delivery_address"] . "\n";

    foreach ($addressLines as $line) {
        $plainText .= $line . "\n";
    }

    $plainText .= "\n";

    $plainText .= $t["outro"] . "\n\n";
    $plainText .= $t["regards"] . ",\nBy Marcel";

    // -----------------------------------------
    // Skapa MIME-struktur
    // -----------------------------------------

    $boundary = "bymarcel_customer_" . bin2hex(random_bytes(16));

    $headers = [
        "From: By Marcel <order@bymarcel.se>",
        "Reply-To: order@bymarcel.se",
        "MIME-Version: 1.0",
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"'
    ];

    $emailBody = "";

    // Vanlig textversion
    $emailBody .= "--" . $boundary . "\r\n";
    $emailBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $emailBody .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $emailBody .= chunk_split(
        base64_encode($plainText),
        76,
        "\r\n"
    );

    // HTML-version
    $emailBody .= "--" . $boundary . "\r\n";
    $emailBody .= "Content-Type: text/html; charset=UTF-8\r\n";
    $emailBody .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $emailBody .= chunk_split(
        base64_encode($html),
        76,
        "\r\n"
    );

    $emailBody .= "--" . $boundary . "--\r\n";

        // -----------------------------------------
    // Skicka kundens orderbekräftelse
    // -----------------------------------------

    $sent = mail(
        $to,
        $subject,
        $emailBody,
        implode("\r\n", $headers)
    );

    if (!$sent) {
        error_log(
            "Kunde inte skicka kundens orderbekräftelse för order " .
            $orderId
        );
    }

    return $sent; 
}



