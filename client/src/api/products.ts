import type { Product } from "../types";

const PRODUCTS_API = "https://www.bymarcel.se/Server/api/products.php";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_API);

  if (!response.ok) {
    throw new Error("Kunde inte hämta produkter");
  }

  const data = await response.json();

  return data.map((product: any) => ({
    ...product,

    type: product.product_type,

    base_price: Number(product.base_price),
    weight: Number(product.weight),

    allows_custom_photo: Boolean(Number(product.allows_custom_photo)),
    allows_custom_text: Boolean(Number(product.allows_custom_text)),
    allows_font_selection: Boolean(Number(product.allows_font_selection)),

    is_seasonal: Boolean(Number(product.is_seasonal)),
    is_hidden: Boolean(Number(product.is_hidden)),
    is_out_of_stock: Boolean(Number(product.is_out_of_stock)),
    is_featured: Boolean(Number(product.is_featured)),

    colors: product.colors?.map((color: any) => ({
    ...color,
    id: Number(color.id),
    background_price: Number(color.background_price),
    print_price: Number(color.print_price),
})) ?? [],

    variants:
      product.variants?.map((variant: any) => ({
        ...variant,
        price: Number(variant.price),
        weight: variant.weight !== null ? Number(variant.weight) : undefined,
      })) ?? [],
  }));
}

export async function updateProductVisibility(
  id: string,
  isHidden: boolean,
): Promise<void> {
  const response = await fetch(
    "https://www.bymarcel.se/Server/api/update-product.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        is_hidden: isHidden,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Kunde inte uppdatera produkten");
  }
}
export async function updateProductStockStatus(
    id: string,
    isOutOfStock: boolean
): Promise<void> {

    const response = await fetch(
        'https://www.bymarcel.se/Server/api/update-product.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                is_out_of_stock: isOutOfStock,
            }),
        }
    )

    if (!response.ok) {
        throw new Error('Kunde inte uppdatera lagerstatus')
    }
}

export async function updateProductFeatured(
    id: string,
    isFeatured: boolean
): Promise<void> {

    const response = await fetch(
        'https://www.bymarcel.se/Server/api/update-product.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                is_featured: isFeatured,
            }),
        }
    )

    if (!response.ok) {
        throw new Error('Kunde inte uppdatera utvald produkt')
    }
}


interface UpdateProductDetails {
  name: string;
  description: string;
  base_price: number;
  weight: number;
}

export async function updateProductDetails(
  id: string,
  details: UpdateProductDetails,
): Promise<void> {
  const response = await fetch(
    "https://www.bymarcel.se/Server/api/update-product.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        ...details,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Kunde inte uppdatera produkten",
    );
  }
}

export interface CreateProductData {
  id: string;
  name: string;
  slug: string;
  type: "EC" | "ES" | "OWN";
  description: string;
  material: string;
  base_price: number;
  weight: number;
  allows_custom_photo: boolean;
  allows_custom_text: boolean;
  allows_font_selection: boolean;
  is_seasonal: boolean;
}

interface CreateProductResponse {
  success: boolean;
  message: string;
  product_id: string;
}

export async function createProduct(
  product: CreateProductData,
): Promise<CreateProductResponse> {
  const response = await fetch(
    "https://www.bymarcel.se/Server/api/create-product.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    },
  );

  const responseText = await response.text();

  let data: any = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "Servern skickade ett ogiltigt svar:",
        responseText,
      );

      throw new Error(
        `Serverfel (${response.status}). Servern skickade inte giltig JSON.`,
      );
    }
  }

  if (!response.ok) {
    console.error("Fel från create-product.php:", data);

    throw new Error(
      data?.error ||
      data?.message ||
      `Kunde inte skapa produkten (${response.status})`,
    );
  }

  if (!data) {
    throw new Error(
      "Produkten verkar ha skapats men servern skickade inget svar.",
    );
  }

  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(
    "https://www.bymarcel.se/Server/api/delete-product.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      // Skickar med admin-sessionen
      credentials: "include",

      body: JSON.stringify({
        id,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Kunde inte ta bort produkten",
    );
  }
}

export interface CreateProductVariantData {
  id: string;
  product_id: string;
  supplier_id: string;
  price: number;
  weight?: number;
  options: Record<string, string | number | boolean>;
}

interface CreateProductVariantResponse {
  success: boolean;
  message: string;
  variant_id: string;
}

export async function createProductVariant(
  variant: CreateProductVariantData,
): Promise<CreateProductVariantResponse> {
  const response = await fetch(
    "https://www.bymarcel.se/Server/api/create-product-variant.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variant),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Kunde inte skapa produktvarianten",
    );
  }

  return data;
}