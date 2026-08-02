import { useState } from 'react'

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
type SortOption = 'az' | 'datum' | 'vikt' | 'totalpris'

const mockOrders = [
    {
        id: 'ORD-001',
        customer: { first_name: 'Anna', last_name: 'Lindberg', email: 'anna@exempel.se', address: 'Storgatan 1, 411 01 Göteborg', phone: '0701234567' },
        items: [{ product_name: 'Naturskylt i ek', quantity: 2, unit_price: 395, selected_size: '20x15 cm', selected_color: 'Naturlig', custom_text: 'Välkommen hem' }],
        subtotal: 790,
        shipping: 79,
        total_weight: 600,
        total_price: 869,
        status: 'pending' as OrderStatus,
        stripe_payment_id: 'pi_abc123',
        created_at: '2026-01-15',
    },
    {
        id: 'ORD-002',
        customer: { first_name: 'Erik', last_name: 'Svensson', email: 'erik@exempel.se', address: 'Kungsgatan 5, 111 43 Stockholm', phone: '0709876543' },
        items: [{ product_name: 'Custom hoodie', quantity: 1, unit_price: 650, selected_size: 'M', selected_color: 'Svart', custom_text: '' }],
        subtotal: 650,
        shipping: 79,
        total_weight: 400,
        total_price: 729,
        status: 'shipped' as OrderStatus,
        stripe_payment_id: 'pi_def456',
        created_at: '2026-01-10',
    },
]

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Pågående',
    processing: 'Behandlas',
    shipped: 'Skickad',
    delivered: 'Klar',
    cancelled: 'Avbruten',
}

export default function AdminOrders() {
    const [activeFilter, setActiveFilter] = useState<OrderStatus | 'alla'>('alla')
    const [activeSort, setActiveSort] = useState<SortOption>('datum')
    const [search, setSearch] = useState('')

    const filtered = mockOrders
        .filter(o => activeFilter === 'alla' || o.status === activeFilter)
        .filter(o => o.id.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (activeSort === 'az') return a.customer.last_name.localeCompare(b.customer.last_name)
            if (activeSort === 'datum') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            if (activeSort === 'vikt') return b.total_weight - a.total_weight
            if (activeSort === 'totalpris') return b.total_price - a.total_price
            return 0
        })

    return (
        <div className='admin-orders'>

            <div className='admin-filter-row'>
                {(['alla', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(f => (
                    <button
                        key={f}
                        className={`admin-filter-btn ${activeFilter === f ? 'active' : ''}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f === 'alla' ? 'Alla' : statusLabels[f]}
                    </button>
                ))}
            </div>

            <div className='admin-table-header'>
                <span style={{ flex: 1 }}>Ordrar — {activeFilter === 'alla' ? 'Alla' : statusLabels[activeFilter as OrderStatus]}</span>
                <div className='admin-sort-row'>
                    {(['az', 'datum', 'vikt', 'totalpris'] as SortOption[]).map(s => (
                        <button
                            key={s}
                            className={`admin-sort-btn ${activeSort === s ? 'active' : ''}`}
                            onClick={() => setActiveSort(s)}
                        >
                            {s === 'az' ? 'A - Ö' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
                <input
                    className='admin-search'
                    placeholder='Sök ordernummer...'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className='admin-orders-list'>
                {filtered.map(order => (
                    <div key={order.id} className='admin-order-row'>
                        <div className='order-col-customer'>
                            <p>{order.customer.first_name} {order.customer.last_name}</p>
                            <p>{order.customer.email}</p>
                            <p>{order.customer.address}</p>
                            <p>{order.customer.phone}</p>
                        </div>

                        <div className='order-col-order'>
                            <p><strong>{order.id}</strong></p>
                            <p>{order.created_at}</p>
                            <select
                                className='admin-status-select'
                                value={order.status}
                                onChange={() => {}}
                            >
                                {Object.entries(statusLabels).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div className='order-col-products'>
                            {order.items.map((item, i) => (
                                <div key={i}>
                                    <p><strong>{item.product_name}</strong></p>
                                    <p>Antal: {item.quantity}</p>
                                    <p>{item.selected_size} · {item.selected_color}</p>
                                    {item.custom_text && <p>Gravyrtext: {item.custom_text}</p>}
                                </div>
                            ))}
                        </div>

                        <div className='order-col-summary'>
                            <p>Totalt: {order.total_price} kr</p>
                            <p>Moms: {Math.round(order.subtotal * 0.25)} kr</p>
                            <p>Vikt: {order.total_weight} g</p>
                            <p>Frakt: {order.shipping} kr</p>
                            <div className='order-tracking'>
                                <input
                                    className='admin-input'
                                    placeholder='Spårningsnummer...'
                                    style={{ fontSize: '0.65rem', padding: '0.4rem 0.75rem' }}
                                />
                            </div>
                            <p className='order-stripe'>#{order.stripe_payment_id}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}