type ShippingItem = {
  product_id: string;
  variant_id?: string;
  quantity: number;
};

type ShippingResponse = {
  success: boolean;
  currency: string;
  shipping: number;
  carrier: string;
  region: string;
  total_weight: number;
  total_weight_kg: number;
};

export async function getShipping(
  country: string,
  items: ShippingItem[],
): Promise<ShippingResponse> {
  const response = await fetch(
    "https://www.bymarcel.se/Server/api/shipping.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country,
        items,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Kunde inte beräkna frakt",
    );
  }

  return data;
}