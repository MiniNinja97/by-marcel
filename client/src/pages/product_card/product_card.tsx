import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { getProducts } from '../../api/products'
import type { Product } from '../../types'
import './product_card.css'

export default function Product() {
    const { id } = useParams()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [selectedImage, setSelectedImage] = useState(0)
    const [customText, setCustomText] = useState('')
    const [customPhoto, setCustomPhoto] = useState<File | null>(null)
    const [quantity, setQuantity] = useState(1)

    // Hämta produkterna från API:t och hitta produkten
    // som har samma id som finns i URL:en.
    useEffect(() => {
        async function loadProduct() {
            try {
                const products = await getProducts()

                const foundProduct = products.find(
                    product => product.id === id
                )

                if (!foundProduct) {
                    setError('Produkten kunde inte hittas')
                    return
                }

                setProduct(foundProduct)
            } catch (error) {
                console.error(error)
                setError('Kunde inte hämta produkten')
            } finally {
                setLoading(false)
            }
        }

        loadProduct()
    }, [id])

    const handleAddToCart = () => {
        if (!product) return

        // Kopplas till Zustand-storen senare
        console.log({
            product,
            customText,
            customPhoto,
            quantity,
        })
    }

    // Medan produkten hämtas
    if (loading) {
        return (
            <div className='product-page'>
                <p>Laddar produkt...</p>
            </div>
        )
    }

    // Om något gick fel
    if (error) {
        return (
            <div className='product-page'>
                <p>{error}</p>
            </div>
        )
    }

    // Extra säkerhet för TypeScript
    if (!product) {
        return null
    }

    return (
        <div className='product-page'>

            {/* Breadcrumb */}
            <nav className='breadcrumb'>
                <NavLink to='/produkter'>
                    Produkter
                </NavLink>

                <span>—</span>

                <span>{product.name}</span>
            </nav>

            <div className='product-layout'>

                {/* Vänster — bilder + beskrivning */}
                <div className='product-left'>

                    <div className='product-main-img'>
                        {product.images[selectedImage] ? (
                            <img
                                src={`https://www.bymarcel.se${product.images[selectedImage]}`}
                                alt={product.name}
                            />
                        ) : (
                            <div className='product-img-placeholder' />
                        )}
                    </div>

                    {/* Små produktbilder */}
                    {product.images.length > 1 && (
                        <div className='product-thumbnails'>

                            {product.images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`product-thumbnail ${
                                        selectedImage === index
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setSelectedImage(index)
                                    }
                                >
                                    <img
                                        src={`https://www.bymarcel.se${image}`}
                                        alt={`${product.name} ${index + 1}`}
                                    />
                                </div>
                            ))}

                        </div>
                    )}

                    <p className='product-description'>
                        {product.description}
                    </p>

                </div>

                {/* Höger — produktinformation */}
                <div className='product-right'>

                    <div className='product-info'>

                        <h1 className='product-name'>
                            {product.name}
                        </h1>

                        <p className='product-technique'>
                            {product.material}
                        </p>

                    </div>

                    <p className='product-price'>
                        {product.base_price} kr
                    </p>

                    {/* Bilduppladdning */}
                    {product.allows_custom_photo && (
                        <div className='product-option'>

                            <label>Infoga bild</label>

                            <label className='upload-btn'>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={e =>
                                        setCustomPhoto(
                                            e.target.files?.[0] ?? null
                                        )
                                    }
                                />
                                📎
                            </label>

                            {customPhoto && (
                                <p className='upload-filename'>
                                    {customPhoto.name}
                                </p>
                            )}

                        </div>
                    )}

                    {/* Egen text */}
                    {product.allows_custom_text && (
                        <div className='product-option'>

                            <label>Din text</label>

                            <div className='gravyr-box'>
                                <textarea
                                    value={customText}
                                    onChange={e =>
                                        setCustomText(e.target.value)
                                    }
                                    maxLength={60}
                                    placeholder='Skriv din text här...'
                                    rows={3}
                                />

                                <p className='gravyr-hint'>
                                    Max 60 tecken · Radbrytningar tillåtna
                                </p>
                            </div>

                        </div>
                    )}

                    {/* Antal */}
                    <div className='product-option'>

                        <label>Antal</label>

                        <div className='quantity-row'>

                            <button
                                className='quantity-btn'
                                onClick={() =>
                                    setQuantity(quantity =>
                                        Math.max(1, quantity - 1)
                                    )
                                }
                            >
                                −
                            </button>

                            <span className='quantity-value'>
                                {quantity}
                            </span>

                            <button
                                className='quantity-btn'
                                onClick={() =>
                                    setQuantity(quantity =>
                                        quantity + 1
                                    )
                                }
                            >
                                +
                            </button>

                        </div>
                    </div>

                    {/* Lägg i korg */}
                    <button
                        className='add-to-cart-btn'
                        onClick={handleAddToCart}
                    >
                        Lägg till i kundkorgen
                    </button>

                </div>
            </div>
        </div>
    )
}