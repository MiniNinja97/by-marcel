export type FontOption = 
| ''
| ''
| ''


export const FONT_OPTIONS: FontOption[] = [
    '',
    '',
    ''
    ]

    export interface Product {

        id: string
        supplier_id?: string
        name: string
        slug: string
        description: string
        material: string
        base_price: number
        images: string[]
        sizes?: string[]
        shapes?: string[]
        colors?: ProductColor[]
        allows_custom_photo: boolean
        allows_custom_text: boolean
        allows_font_selection: boolean
        is_seasonal: boolean
        weight: number
        created_at: string

    }

    export interface ProductColor {
        name: string
        hex: string
        price_modifier: number
        is_special: boolean
    }

    export interface CartItem {
        product: Product
        quantity: number
        selected_size?: string
        selected_shape?: string
        selected_color?: ProductColor
        selected_font?: FontOption
        custom_photo?: File
        custom_text?: string
        unit_price: number
        total_price: number
    }

    export interface Cart {
        items: CartItem[]
        total_price: number
    }

    export interface Customer {
        id: string
        first_name: string
        last_name: string
        email: string
        phone_number?: string
        address?: string
        city?: string
        state?: string
        zip_code?: string
        country?: string
    }

    export interface Order {
        id: string
        customer: Customer
        items: CartItem[]
        subtotal: number
        shipping: number
        total_weight: number
        total_price: number
        status: OrderStatus
        stripe_payment_id: string
        created_at: string

    }

    export interface OrderItem {
        id: string
        order_id: string
        product_id: string
        product_name: string
        quantity: number
        unit_price: number
        weight: number
        selected_size?: string
        selected_shape?: string
        selected_color?: ProductColor
        selected_font?: FontOption
        custom_photo_url?: string
        custom_text?: string
    }

    export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'