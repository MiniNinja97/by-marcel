import { useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import './products.css'

// Hårdkodad menystruktur tills databasen är klar
const categories = [
    {
        name: 'Emalj',
        slug: 'emalj',
        subcategories: [
            { name: 'Fotosyltar', slug: 'fotosyltar' },
            { name: 'Husnummer', slug: 'husnummer' },
            { name: 'WC skyltar', slug: 'wc-skyltar' },
        ]
    }
]

// Hårdkodade produkter tills databasen är klar
const mockProducts = [
    { id: '1', name: 'Namn', description: 'Kort beskrivning', price: 299, category: 'emalj', subcategory: 'fotosyltar' },
    { id: '2', name: 'Namn', description: 'Kort beskrivning', price: 399, category: 'emalj', subcategory: 'fotosyltar' },
    { id: '3', name: 'Namn', description: 'Kort beskrivning', price: 499, category: 'emalj', subcategory: 'husnummer' },
    { id: '4', name: 'Namn', description: 'Kort beskrivning', price: 349, category: 'emalj', subcategory: 'husnummer' },
    { id: '5', name: 'Namn', description: 'Kort beskrivning', price: 299, category: 'emalj', subcategory: 'wc-skyltar' },
    { id: '6', name: 'Namn', description: 'Kort beskrivning', price: 399, category: 'emalj', subcategory: 'wc-skyltar' },
]

const PRODUCTS_PER_PAGE = 6

export default function Products() {
    const { kategori, underkategori } = useParams()
    const [currentPage, setCurrentPage] = useState(1)

    // Filtrera produkter baserat på URL
    const filteredProducts = mockProducts.filter(p => {
        if (underkategori) return p.subcategory === underkategori && p.category === kategori
        if (kategori) return p.category === kategori
        return true
    })

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
    const visibleProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    )

    // Sidtitel
    const activeCategory = categories.find(c => c.slug === kategori)
    const activeSubcategory = activeCategory?.subcategories.find(s => s.slug === underkategori)
    const pageTitle = activeSubcategory?.name ?? activeCategory?.name ?? 'Alla Produkter'

    return (
        <div className='products'>

            {/* Sidomeny */}
            <aside className='products-sidebar'>
                <NavLink to='/produkter' className='sidebar-all'>
                    Alla Produkter —
                </NavLink>

                {categories.map(cat => (
                    <div key={cat.slug} className='sidebar-category'>
                        <NavLink
                            to={`/produkter/${cat.slug}`}
                            className='sidebar-category-link'
                        >
                            {cat.name} —
                        </NavLink>
                        <ul className='sidebar-subcategories'>
                            {cat.subcategories.map(sub => (
                                <li key={sub.slug}>
                                    <NavLink
                                        to={`/produkter/${cat.slug}/${sub.slug}`}
                                        className={({ isActive }) =>
                                            isActive ? 'sidebar-sub-link active' : 'sidebar-sub-link'
                                        }
                                    >
                                        {sub.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </aside>

            {/* Huvudinnehåll */}
            <div className='products-main'>

                <div className='products-header'>
                    <h1>{pageTitle}</h1>
                    <p>Fotosyltar, personlig design & husnummer</p>
                </div>

                <div className='products-grid'>
                    {visibleProducts.map(product => (
                        <NavLink
                            to={`/produkt/${product.id}`}
                            key={product.id}
                            className='product-card'
                        >
                            <div className='product-card-img' />
                            <div className='product-card-info'>
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <span className='product-card-price'>
                                    {product.price} kr
                                </span>
                            </div>
                        </NavLink>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className='pagination'>
                        <button
                            className='pagination-btn'
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            ‹
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className='pagination-btn'
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            ›
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}