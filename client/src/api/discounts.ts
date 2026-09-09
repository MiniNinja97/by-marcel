export interface DiscountCode {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  minimum_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface DiscountCodeInput {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  minimum_order: number | null;
}

const API_URL =
  "https://www.bymarcel.se/Server/api/discount-codes.php";


// ========================================
// HÄMTA RABATTKODER
// ========================================

export async function getDiscountCodes(): Promise<DiscountCode[]> {
  const response = await fetch(API_URL, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Kunde inte hämta rabattkoder.");
  }

  return data.discount_codes;
}


// ========================================
// SKAPA RABATTKOD
// ========================================

export async function createDiscountCode(
  discount: DiscountCodeInput,
): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(discount),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Kunde inte skapa rabattkoden.");
  }
}


// ========================================
// UPPDATERA RABATTKOD
// ========================================

export async function updateDiscountCode(
  id: number,
  discount: DiscountCodeInput,
): Promise<void> {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      id,
      ...discount,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Kunde inte uppdatera rabattkoden.");
  }
}


// ========================================
// TA BORT RABATTKOD
// ========================================

export async function deleteDiscountCode(id: number): Promise<void> {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ id }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Kunde inte ta bort rabattkoden.");
  }
}

export interface ValidatedDiscount {
  code: string;
  type: "percent" | "fixed";
  value: number;
  amount: number;
}

export async function validateDiscountCode(
  code: string,
  subtotal: number,
): Promise<ValidatedDiscount> {
  const response = await fetch(
    "https://www.bymarcel.se/Server/api/validate-discount.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        subtotal,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Rabattkoden är inte giltig.",
    );
  }

  return data.discount;
}