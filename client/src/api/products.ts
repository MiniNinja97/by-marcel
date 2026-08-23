import type { Product } from '../types'

const PRODUCTS_API =
    'https://www.bymarcel.se/Server/api/products.php'

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(PRODUCTS_API)

    if (!response.ok) {
        throw new Error('Kunde inte hämta produkter')
    }

    const data = await response.json()

    return data.map((product: any) => ({
        ...product,

        type: product.product_type,

        base_price: Number(product.base_price),
        weight: Number(product.weight),

        allows_custom_photo: Boolean(Number(product.allows_custom_photo)),
        allows_custom_text: Boolean(Number(product.allows_custom_text)),
        allows_font_selection: Boolean(Number(product.allows_font_selection)),

        is_seasonal: Boolean(Number(product.is_seasonal)),

        variants: product.variants?.map((variant: any) => ({
            ...variant,
            price: Number(variant.price),
            weight: variant.weight !== null
                ? Number(variant.weight)
                : undefined,
        })) ?? [],
    }))
}