import type { Order } from '../types'

const ORDERS_API =
    'https://www.bymarcel.se/Server/api/orders.php'

export async function getOrders(): Promise<Order[]> {
    const response = await fetch(ORDERS_API)

    if (!response.ok) {
        throw new Error('Kunde inte hämta ordrar')
    }

    const data = await response.json()

    return data
}