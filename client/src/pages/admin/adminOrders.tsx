import { useEffect, useState } from 'react'
import { getOrders } from '../../api/orders'
import type { Order, OrderStatus } from '../../types'

type SortOption = 'az' | 'datum' | 'vikt' | 'totalpris'

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Pågående',
    processing: 'Behandlas',
    shipped: 'Skickad',
    delivered: 'Klar',
    cancelled: 'Avbruten',
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [activeFilter, setActiveFilter] =
        useState<OrderStatus | 'alla'>('alla')

    const [activeSort, setActiveSort] =
        useState<SortOption>('datum')

    const [search, setSearch] = useState('')

    // Hämta riktiga ordrar från databasen
    useEffect(() => {
        async function loadOrders() {
            try {
                const data = await getOrders()
                setOrders(data)
            } catch (error) {
                console.error(error)
                setError('Kunde inte hämta ordrar')
            } finally {
                setLoading(false)
            }
        }

        loadOrders()
    }, [])

    // Filtrering + sökning + sortering
    const filtered = [...orders]
        .filter(order =>
            activeFilter === 'alla'
                ? true
                : order.status === activeFilter
        )
        .filter(order =>
            order.id
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (activeSort === 'az') {
                return a.customer.last_name.localeCompare(
                    b.customer.last_name
                )
            }

            if (activeSort === 'datum') {
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
            }

            if (activeSort === 'vikt') {
                return b.total_weight - a.total_weight
            }

            if (activeSort === 'totalpris') {
                return b.total_price - a.total_price
            }

            return 0
        })

    if (loading) {
        return <p>Laddar ordrar...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className='admin-orders'>

            {/* Statusfilter */}
            <div className='admin-filter-row'>
                {([
                    'alla',
                    'pending',
                    'processing',
                    'shipped',
                    'delivered',
                    'cancelled'
                ] as const).map(filter => (

                    <button
                        key={filter}
                        className={`admin-filter-btn ${
                            activeFilter === filter
                                ? 'active'
                                : ''
                        }`}
                        onClick={() =>
                            setActiveFilter(filter)
                        }
                    >
                        {filter === 'alla'
                            ? 'Alla'
                            : statusLabels[filter]
                        }
                    </button>
                ))}
            </div>

            {/* Rubrik + sortering + sökning */}
            <div className='admin-table-header'>

                <span style={{ flex: 1 }}>
                    Ordrar — {
                        activeFilter === 'alla'
                            ? 'Alla'
                            : statusLabels[activeFilter]
                    }
                </span>

                <div className='admin-sort-row'>

                    {([
                        'az',
                        'datum',
                        'vikt',
                        'totalpris'
                    ] as SortOption[]).map(sort => (

                        <button
                            key={sort}
                            className={`admin-sort-btn ${
                                activeSort === sort
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                setActiveSort(sort)
                            }
                        >
                            {sort === 'az'
                                ? 'A - Ö'
                                : sort.charAt(0).toUpperCase() +
                                  sort.slice(1)
                            }
                        </button>
                    ))}

                </div>

                <input
                    className='admin-search'
                    placeholder='Sök ordernummer...'
                    value={search}
                    onChange={event =>
                        setSearch(event.target.value)
                    }
                />
            </div>

            {/* Orderlista */}
            <div className='admin-orders-list'>

                {filtered.map(order => (
                    <div
                        key={order.id}
                        className='admin-order-row'
                    >

                        {/* Kund */}
                        <div className='order-col-customer'>

                            <p>
                                {order.customer.first_name}{' '}
                                {order.customer.last_name}
                            </p>

                            <p>
                                {order.customer.email}
                            </p>

                            {order.customer.address && (
                                <p>
                                    {order.customer.address}
                                </p>
                            )}

                            {(order.customer.zip_code ||
                                order.customer.city) && (
                                <p>
                                    {order.customer.zip_code}{' '}
                                    {order.customer.city}
                                </p>
                            )}

                            {order.customer.phone_number && (
                                <p>
                                    {order.customer.phone_number}
                                </p>
                            )}

                        </div>


                        {/* Orderinfo */}
                        <div className='order-col-order'>

                            <p>
                                <strong>{order.id}</strong>
                            </p>

                            <p>{order.created_at}</p>

                            <select
                                className='admin-status-select'
                                value={order.status}

                                // Vi kopplar statusändringen
                                // till databasen senare.
                                onChange={() => {}}
                            >
                                {Object.entries(
                                    statusLabels
                                ).map(([value, label]) => (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {label}
                                    </option>
                                ))}
                            </select>

                        </div>


                        {/* Produkter */}
                        <div className='order-col-products'>

                            {order.items.map(item => (
                                <div key={item.id}>

                                    <p>
                                        <strong>
                                            {item.product_name}
                                        </strong>
                                    </p>

                                    <p>
                                        Antal: {item.quantity}
                                    </p>

                                    {item.supplier_id && (
                                        <p>
                                            Leverantör: {
                                                item.supplier_id
                                            }
                                        </p>
                                    )}

                                    {/* Dynamiska produktval */}
                                    {item.selected_options &&
                                        Object.entries(
                                            item.selected_options
                                        ).map(
                                            ([name, value]) => (
                                                <p key={name}>
                                                    {name}: {
                                                        String(value)
                                                    }
                                                </p>
                                            )
                                        )
                                    }

                                    {/* Dynamiska textrader */}
                                    {item.custom_texts &&
                                        Object.entries(
                                            item.custom_texts
                                        ).map(
                                            ([name, value]) => (
                                                value && (
                                                    <p key={name}>
                                                        {name}: {value}
                                                    </p>
                                                )
                                            )
                                        )
                                    }

                                </div>
                            ))}

                        </div>


                        {/* Ordersammanfattning */}
                        <div className='order-col-summary'>

                            <p>
                                Totalt: {order.total_price} kr
                            </p>

                            <p>
                                Moms: {
                                    Math.round(
                                        order.subtotal * 0.25
                                    )
                                } kr
                            </p>

                            <p>
                                Vikt: {order.total_weight} g
                            </p>

                            <p>
                                Frakt: {order.shipping} kr
                            </p>

                            <div className='order-tracking'>
                                <input
                                    className='admin-input'
                                    placeholder='Spårningsnummer...'
                                    style={{
                                        fontSize: '0.65rem',
                                        padding: '0.4rem 0.75rem',
                                    }}
                                />
                            </div>

                            {order.stripe_payment_id && (
                                <p className='order-stripe'>
                                    #{order.stripe_payment_id}
                                </p>
                            )}

                        </div>

                    </div>
                ))}


                {/* Databasen är tom just nu */}
                {filtered.length === 0 && (
                    <p>Inga ordrar hittades.</p>
                )}

            </div>
        </div>
    )
}