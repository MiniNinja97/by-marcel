<?php

header("Content-Type: application/json; charset=UTF-8");

$allowedOrigins = [
    "https://www.bymarcel.se",
    "https://bymarcel.se",
    "https://test.bymarcel.se",
    "http://localhost:5173"
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/auth/session.php";

if (empty($_SESSION["admin_user_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Du måste vara inloggad som administratör"
    ]);

    exit;
}

$sql = "
    SELECT
        orders.id,
          orders.order_number,
        orders.subtotal,
        orders.discount_code,
orders.discount_amount,
        orders.shipping,
        orders.total_weight,
        orders.total_price,
        orders.status,
       orders.stripe_payment_id,
orders.customer_notes,
orders.created_at,
orders.order_email_status,
orders.order_email_sent_at,
orders.order_email_started_at,

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

WHERE orders.status IN ('processing', 'delivered')
OR (
    orders.status = 'cancelled'
    AND (
        (orders.stripe_payment_id IS NOT NULL
         AND orders.stripe_payment_id <> '')
        OR orders.order_number IS NOT NULL
    )
)

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
custom_photo_urls,
custom_text,
custom_texts,
additional_requests

    FROM order_items

    WHERE order_id = ?
";

error_log("ORDERS DEBUG: Ska förbereda order_items för order " . $orderId);
    $itemStmt = $conn->prepare($itemSql);
    if (!$itemStmt) {
    error_log("ORDERS DEBUG: Prepare misslyckades: " . $conn->error);
}
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

        $item["custom_photo_urls"] =
    $item["custom_photo_urls"] !== null
        ? json_decode($item["custom_photo_urls"], true)
        : [];

        // Gör numeriska värden numeriska i JSON
        $item["quantity"] = (int) $item["quantity"];
        $item["unit_price"] = (float) $item["unit_price"];
        $item["weight"] = (float) $item["weight"];

        // -----------------------------------------
// Hämta eventuella presentkort
// -----------------------------------------

$giftCardStmt = $conn->prepare("
    SELECT
        code,
        initial_amount,
        remaining_balance,
        status
    FROM gift_cards
    WHERE order_item_id = ?
");

$giftCardStmt->bind_param(
    "s",
    $item["id"]
);

$giftCardStmt->execute();

$giftCardResult =
    $giftCardStmt->get_result();

$giftCards = [];

while (
    $giftCard =
        $giftCardResult->fetch_assoc()
) {
    $giftCard["initial_amount"] =
        (float) $giftCard["initial_amount"];

    $giftCard["remaining_balance"] =
        (float) $giftCard["remaining_balance"];

    $giftCards[] = $giftCard;
}

$giftCardStmt->close();

$item["gift_cards"] = $giftCards;

        $items[] = $item;
    }

    $itemStmt->close();

    // -----------------------------------------
    // Bygg orderobjektet
    // -----------------------------------------

    $orders[] = [
        "id" => $row["id"],
        "order_number" => $row["order_number"],

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
"customer_notes" => $row["customer_notes"],
"created_at" => $row["created_at"],
"order_email_status" => $row["order_email_status"],
"order_email_sent_at" => $row["order_email_sent_at"],
"order_email_started_at" => $row["order_email_started_at"]
    ];
}

echo json_encode($orders);