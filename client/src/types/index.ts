export type FontOption = "" | "" | "";

export const FONT_OPTIONS: FontOption[] = ["", "", ""];

export interface Product {
  id: string;
  supplier_id?: string;
  name: string;
  slug: string;
  description: string;
  material: string;
  type: ProductType;
  base_price: number;
  images: string[];

  // Äldre fält som vi behåller tills vidare
  sizes?: string[];
  shapes?: string[];
  colors?: ProductColor[];

  // Alternativ som hämtas från databasen
  options?: ProductOption[];

  // Leverantörsvarianter
  variants?: ProductVariant[];

  allows_custom_photo: boolean;
  allows_custom_text: boolean;
  allows_font_selection: boolean;
  is_seasonal: boolean;
  weight: number;
  created_at: string;

  is_hidden: boolean;
  is_out_of_stock: boolean;
  is_featured: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
  price_modifier: number;
  is_special: boolean;
}

/*
    Ett alternativ på produktsidan.

    Exempel:
    option_name: "size"
    display_name: "Storlek"
*/
export interface ProductOption {
  id: number;
  option_name: string;
  display_name: string;
  sort_order: number;
  values: ProductOptionChoice[];
}

/*
    Ett möjligt värde för ett alternativ.

    Exempel:
    value: "33 x 8 cm"
    display_value: "33 x 8 cm"
*/
export interface ProductOptionChoice {
  value: string;
  display_value: string;
  sort_order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_size?: string;
  selected_shape?: string;
  selected_color?: ProductColor;
  selected_font?: FontOption;
  custom_photo?: File;
  custom_text?: string;
  unit_price: number;
  total_price: number;
  selected_options?: Record<string, ProductOptionValue>;
}

export interface Cart {
  items: CartItem[];
  total_price: number;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total_weight: number;
  total_price: number;
  status: OrderStatus;
  stripe_payment_id?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  supplier_id?: string;
  quantity: number;
  unit_price: number;
  weight: number;
  selected_size?: string;
  selected_shape?: string;
  selected_color?: ProductColor;
  selected_font?: FontOption;
  custom_photo_url?: string;
  custom_text?: string;
  selected_options?: Record<string, ProductOptionValue>;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ProductType = "EC" | "ES" | "OWN";

/*
    Typen för ett värde inne i variantens options.

    Exempel:
    {
        size: "33 x 8 cm",
        frame: true
    }
*/
export type ProductOptionValue = string | number | boolean;

export interface ProductVariant {
  id: string;
  supplier_id: string;
  options: Record<string, ProductOptionValue>;
  price: number;
  weight?: number;
}
