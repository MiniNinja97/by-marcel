<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Endast POST är tillåtet"
    ]);

    exit;
}

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!$data) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ingen giltig JSON skickades"
    ]);

    exit;
}


// -----------------------------------------
// Kontrollera grundläggande data
// -----------------------------------------

if (
    !isset($data["customer"]) ||
    !isset($data["items"]) ||
    !is_array($data["items"]) ||
    count($data["items"]) === 0
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Kund eller produkter saknas"
    ]);

    exit;
}

$customer = $data["customer"];
$items = $data["items"];


// -----------------------------------------
// Kontrollera kunduppgifter
// -----------------------------------------

$requiredCustomerFields = [
    "first_name",
    "last_name",
    "email"
];

foreach ($requiredCustomerFields as $field) {

    if (
        !isset($customer[$field]) ||
        trim($customer[$field]) === ""
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Kunduppgift saknas: " . $field
        ]);

        exit;
    }
}


// -----------------------------------------
// Skapa ID:n
// -----------------------------------------

$customerId = "CUS-" . bin2hex(random_bytes(8));
$orderId = "ORD-" . bin2hex(random_bytes(8));


// -----------------------------------------
// Börja transaktion
// -----------------------------------------

$conn->begin_transaction();

try {

    // -----------------------------------------
    // Skapa kunden
    // -----------------------------------------

    $customerSql = "
        INSERT INTO customers (
            id,
            first_name,
            last_name,
            email,
            phone_number,
            address,
            city,
            state,
            zip_code,
            country
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $customerStmt = $conn->prepare($customerSql);

    $phoneNumber = $customer["phone_number"] ?? null;
    $address = $customer["address"] ?? null;
    $city = $customer["city"] ?? null;
    $state = $customer["state"] ?? null;
    $zipCode = $customer["zip_code"] ?? null;
    $country = $customer["country"] ?? null;

    $customerStmt->bind_param(
        "ssssssssss",
        $customerId,
        $customer["first_name"],
        $customer["last_name"],
        $customer["email"],
        $phoneNumber,
        $address,
        $city,
        $state,
        $zipCode,
        $country
    );

    $customerStmt->execute();
    $customerStmt->close();


    // -----------------------------------------
    // Räkna ordervärden
    // -----------------------------------------

    $subtotal = 0;
    $totalWeight = 0;

    foreach ($items as $item) {

        $quantity = (int) $item["quantity"];
        $unitPrice = (float) $item["unit_price"];
        $weight = (float) $item["weight"];

        $subtotal += $unitPrice * $quantity;
        $totalWeight += $weight * $quantity;
    }

    // Samma frakt som Cart.tsx använder just nu
    $shipping = $subtotal > 0 ? 79 : 0;

    $totalPrice = $subtotal + $shipping;


    // -----------------------------------------
    // Skapa ordern
    // -----------------------------------------

    $status = "pending";

    // Ingen Stripe ännu
    $stripePaymentId = null;

    $orderSql = "
        INSERT INTO orders (
            id,
            customer_id,
            subtotal,
            shipping,
            total_weight,
            total_price,
            status,
            stripe_payment_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $orderStmt = $conn->prepare($orderSql);

    $orderStmt->bind_param(
        "ssddddss",
        $orderId,
        $customerId,
        $subtotal,
        $shipping,
        $totalWeight,
        $totalPrice,
        $status,
        $stripePaymentId
    );

    $orderStmt->execute();
    $orderStmt->close();


    // -----------------------------------------
    // Skapa order_items
    // -----------------------------------------

    $itemSql = "
        INSERT INTO order_items (
            id,
            order_id,
            product_id,
            product_name,
            supplier_id,
            quantity,
            unit_price,
            weight,
            selected_size,
            selected_shape,
            selected_color,
            selected_font,
            selected_options,
            custom_photo_url,
            custom_text,
            custom_texts
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $itemStmt = $conn->prepare($itemSql);

    foreach ($items as $item) {

        $itemId = "ITEM-" . bin2hex(random_bytes(8));

        $productId = $item["product_id"];
        $productName = $item["product_name"];

        $supplierId = $item["supplier_id"] ?? null;

        $quantity = (int) $item["quantity"];
        $unitPrice = (float) $item["unit_price"];
        $weight = (float) $item["weight"];

        $selectedSize = $item["selected_size"] ?? null;
        $selectedShape = $item["selected_shape"] ?? null;
        $selectedColor = $item["selected_color"] ?? null;
        $selectedFont = $item["selected_font"] ?? null;

        $selectedOptions = isset($item["selected_options"])
            ? json_encode($item["selected_options"])
            : null;

        // Bilduppladdning tar vi separat senare
        $customPhotoUrl = null;

        // Äldre fält behålls tills vidare
        $customText = $item["custom_text"] ?? null;

        $customTexts = isset($item["custom_texts"])
            ? json_encode($item["custom_texts"])
            : null;

        $itemStmt->bind_param(
            "sssssidddsssssss",
            $itemId,
            $orderId,
            $productId,
            $productName,
            $supplierId,
            $quantity,
            $unitPrice,
            $weight,
            $selectedSize,
            $selectedShape,
            $selectedColor,
            $selectedFont,
            $selectedOptions,
            $customPhotoUrl,
            $customText,
            $customTexts
        );

        $itemStmt->execute();
    }

    $itemStmt->close();


    // -----------------------------------------
    // Allt lyckades
    // -----------------------------------------

    $conn->commit();

    http_response_code(201);

    echo json_encode([
        "success" => true,
        "message" => "Order skapad",
        "order_id" => $orderId,
        "customer_id" => $customerId
    ]);


} catch (Throwable $error) {

    // Något gick fel -> ångra ALLT
    $conn->rollback();

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte skapa order",
        "error" => $error->getMessage()
    ]);
}