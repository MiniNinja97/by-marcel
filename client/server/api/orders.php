<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/../config/db.php";

$sql = "
    SELECT
        orders.id,
        orders.subtotal,
        orders.discount_code,
orders.discount_amount,
        orders.shipping,
        orders.total_weight,
        orders.total_price,
        orders.status,
        orders.stripe_payment_id,
        orders.created_at,

        customers.id AS customer_id,
        customers.first_name,
        customers.last_name,
        customers.email,
        customers.phone_number,
        customers.address,
        customers.city,
        customers.state,
        customers.zip_code,
        customers.country

    FROM orders

    INNER JOIN customers
        ON orders.customer_id = customers.id

    ORDER BY orders.created_at DESC
";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Kunde inte hämta ordrar"
    ]);

    exit;
}

$orders = [];

while ($row = $result->fetch_assoc()) {

    $orderId = $row["id"];

    // -----------------------------------------
    // Hämta produkterna som tillhör ordern
    // -----------------------------------------

   $itemSql = "
    SELECT
        id,
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
        custom_text,
        custom_texts

    FROM order_items

    WHERE order_id = ?
";

    $itemStmt = $conn->prepare($itemSql);
    $itemStmt->bind_param("s", $orderId);
    $itemStmt->execute();

    $itemResult = $itemStmt->get_result();

    $items = [];

    while ($item = $itemResult->fetch_assoc()) {

        // JSON från databasen -> PHP-array -> JSON till React
       $item["selected_options"] =
    $item["selected_options"] !== null
        ? json_decode($item["selected_options"], true)
        : null;

$item["selected_background_color"] =
    $item["selected_background_color"] !== null
        ? json_decode($item["selected_background_color"], true)
        : null;

$item["selected_print_color"] =
    $item["selected_print_color"] !== null
        ? json_decode($item["selected_print_color"], true)
        : null;

$item["custom_texts"] =
    $item["custom_texts"] !== null
        ? json_decode($item["custom_texts"], true)
        : null;

        // Gör numeriska värden numeriska i JSON
        $item["quantity"] = (int) $item["quantity"];
        $item["unit_price"] = (float) $item["unit_price"];
        $item["weight"] = (float) $item["weight"];

        $items[] = $item;
    }

    $itemStmt->close();

    // -----------------------------------------
    // Bygg orderobjektet
    // -----------------------------------------

    $orders[] = [
        "id" => $row["id"],

        "customer" => [
            "id" => $row["customer_id"],
            "first_name" => $row["first_name"],
            "last_name" => $row["last_name"],
            "email" => $row["email"],
            "phone_number" => $row["phone_number"],
            "address" => $row["address"],
            "city" => $row["city"],
            "state" => $row["state"],
            "zip_code" => $row["zip_code"],
            "country" => $row["country"]
        ],

        "items" => $items,

        "subtotal" => (float) $row["subtotal"],
        "discount_code" => $row["discount_code"],
        "discount_amount" => (float) $row["discount_amount"],
        "shipping" => (float) $row["shipping"],
        "total_weight" => (float) $row["total_weight"],
        "total_price" => (float) $row["total_price"],

        "status" => $row["status"],
        "stripe_payment_id" => $row["stripe_payment_id"],
        "created_at" => $row["created_at"]
    ];
}

echo json_encode($orders);