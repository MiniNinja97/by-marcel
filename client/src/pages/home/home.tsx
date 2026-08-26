import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './home.css'
import logo from '../../assets/logo.png'
import { getProducts } from '../../api/products'
import type { Product } from '../../types'

type HomeFilter = 'featured' | 'new' | 'seasonal'

export default function Home() {

    const navigate = useNavigate()

    const [products, setProducts] = useState<Product[]>([])
    const [activeFilter, setActiveFilter] =
        useState<HomeFilter>('featured')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Hämta produkter från databasen
    useEffect(() => {

        async function loadProducts() {
            try {
                const data = await getProducts()
                setProducts(data)

            } catch (error) {
                console.error(error)
                setError('Kunde inte hämta produkter')

            } finally {
                setLoading(false)
            }
        }

        loadProducts()

    }, [])

    // Dolda produkter ska aldrig visas på startsidan
    const visibleProducts = products.filter(
        product => !product.is_hidden
    )

    let displayedProducts: Product[] = []

    // UTVALDA
    if (activeFilter === 'featured') {

        displayedProducts = visibleProducts.filter(
            product => product.is_featured
        )

    }

    // SÄSONG
    if (activeFilter === 'seasonal') {

        displayedProducts = visibleProducts.filter(
            product => product.is_seasonal
        )

    }

    // NYHETER
    if (activeFilter === 'new') {

        displayedProducts = [...visibleProducts]
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            )
    }

    // Vi visar maximalt tre produkter här
    displayedProducts = displayedProducts.slice(0, 3)

    return (
        <div className="home">

            {/* HERO */}
            <div className="hero" id="hero">

                <div className="hero-slides">
                    <div className="hero-slide slide-1"></div>
                    <div className="hero-slide slide-2"></div>
                    <div className="hero-slide slide-3"></div>
                </div>

                <div className="hero-overlay"></div>

                <div className="hero-content" id="hero-content">

                    <div className="logo">
                        <img src={logo} alt="By Marcel" />
                    </div>

                    <div className="hero_content">

                        <div className="hero-text">
                            <h2>Handgjorda produkter</h2>
                        </div>

                        <button
                            className="hero-button"
                            id="hero-button"
                            onClick={() => navigate('/produkter')}
                        >
                            Utforska sortimentet
                        </button>

                    </div>
                </div>
            </div>


            {/* HOME CONTENT */}
            <div className="home-content" id="home-content">

                <div
                    className="home-content-top"
                    id="home-content-top"
                >

                    <h3 id="home-content-title">
                        Home Content
                    </h3>

                    <h2>Handplockat åt dig</h2>


                    {/* FILTERKNAPPAR */}
                    <div
                        className="tripple-btn"
                        id="tripple-btn"
                    >

                        <button
                            className={`tripple-btn-item ${
                                activeFilter === 'featured'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                setActiveFilter('featured')
                            }
                        >
                            Utvalda
                        </button>

                        <button
                            className={`tripple-btn-item ${
                                activeFilter === 'new'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                setActiveFilter('new')
                            }
                        >
                            Nyheter
                        </button>

                        <button
                            className={`tripple-btn-item ${
                                activeFilter === 'seasonal'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                setActiveFilter('seasonal')
                            }
                        >
                            Säsong
                        </button>

                    </div>
                </div>


                {/* PRODUKTKORT */}
                <div
                    className="product-cards"
                    id="product-cards"
                >

                    {loading && (
                        <p>Laddar produkter...</p>
                    )}

                    {error && (
                        <p>{error}</p>
                    )}

                    {!loading &&
                        !error &&
                        displayedProducts.map(product => (

                            <NavLink
                                key={product.id}
                                to={`/produkt/${product.id}`}
                                className="home-product-card"
                            >

                                {product.images?.[0] ? (

                                    <img
                                        src={`https://www.bymarcel.se${product.images[0]}`}
                                        alt={product.name}
                                    />

                                ) : (

                                    <div className="home-product-image-placeholder" />

                                )}

                                <h2>{product.name}</h2>

                                <p>
                                    {product.description}
                                </p>

                                <p className="home-product-price">
                                    {product.base_price} kr
                                </p>

                                {product.is_out_of_stock && (
                                    <p className="home-product-stock">
                                        Ej i lager
                                    </p>
                                )}

                            </NavLink>

                        ))
                    }

                    {!loading &&
                        !error &&
                        displayedProducts.length === 0 && (
                            <p>
                                Inga produkter att visa här ännu.
                            </p>
                        )
                    }

                </div>


                <div className="devider"></div>


                {/* GÖR DET PERSONLIGT */}
                <div
                    className="home-content-bottom"
                    id="home-content-bottom"
                >

                    <h2>Gör det personligt</h2>

                    <div className="product-card-bottom">
                        <img />
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                    </div>

                    <div className="product-card-bottom">
                        <img />
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                    </div>

                    <div className="product-card-bottom">
                        <img />
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                    </div>

                    <div className="product-card-bottom">
                        <img />
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                    </div>

                </div>

            </div>
        </div>
    )
}