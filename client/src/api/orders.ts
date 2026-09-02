import type { Order, CartItem, Customer, OrderStatus } from "../types";

const ORDERS_API = "https://www.bymarcel.se/Server/api/orders.php";

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(ORDERS_API);

  if (!response.ok) {
    throw new Error("Kunde inte hämta ordrar");
  }

  const data = await response.json();

  return data;
}

interface CreateOrderResponse {
  success: boolean;
  message: string;
  order_id: string;
  customer_id: string;
  checkout_url: string;
}

export async function createOrder(
  customer: Omit<Customer, "id">,
  items: CartItem[],
): Promise<CreateOrderResponse> {
  const orderItems = items.map((item) => ({
    product_id: item.product.id,
    product_name: item.product.name,

    variant_id: item.variant_id,

    supplier_id: item.supplier_id,

    quantity: item.quantity,
    unit_price: item.unit_price,

    weight: item.product.weight,

    selected_size: item.selected_size,
    selected_shape: item.selected_shape,
    selected_color: item.selected_color?.name,
    selected_font: item.selected_font,

    selected_background_color: item.selected_background_color
      ? {
          id: item.selected_background_color.id,
          name: item.selected_background_color.name,
          ral_code: item.selected_background_color.ral_code,
          supplier_code: item.selected_background_color.background_code,
          price: item.selected_background_color.background_price,
        }
      : null,

    selected_print_color: item.selected_print_color
      ? {
          id: item.selected_print_color.id,
          name: item.selected_print_color.name,
          ral_code: item.selected_print_color.ral_code,
          supplier_code: item.selected_print_color.print_code,
          price: item.selected_print_color.print_price,
        }
      : null,

    selected_options: item.selected_options,

    custom_text: item.custom_text,
    custom_texts: item.custom_texts,
  }));

  console.log("ORDER ITEMS:", JSON.stringify(orderItems, null, 2));

  const response = await fetch(
    "https://www.bymarcel.se/Server/api/create-order.php",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        customer,
        items: orderItems,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("CREATE ORDER ERROR:", data);

    throw new Error(data.error ?? data.message ?? "Kunde inte skapa order");
  }

  return data;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  const response = await fetch(
    "https://www.bymarcel.se/Server/api/update-order.php",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id,
        status,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte uppdatera orderstatus");
  }
}
