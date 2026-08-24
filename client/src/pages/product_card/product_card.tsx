import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { getProducts } from '../../api/products'
import type { Product, ProductVariant } from '../../types'
import { useCartStore } from '../../store/useCartStore'
import './product_card.css'

export default function Product() {
    const { id } = useParams()
    const { addItem } = useCartStore()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [selectedImage, setSelectedImage] = useState(0)

    // Här sparas alla val kunden gör.
    // Exempel:
    // size: "33 x 8 cm"
    // frame: "true"
    const [selectedOptions, setSelectedOptions] = useState<
        Record<string, string>
    >({})

    const [customText, setCustomText] = useState('')
    const [customPhoto, setCustomPhoto] = useState<File | null>(null)
    const [quantity, setQuantity] = useState(1)

    // Hämta produkten från API
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

    // Körs när kunden väljer exempelvis storlek eller ram
    const handleOptionChange = (
        optionName: string,
        value: string
    ) => {
        setSelectedOptions(previous => ({
            ...previous,
            [optionName]: value,
        }))
    }

    // Leta efter varianten som matchar kundens val
    const selectedVariant: ProductVariant | undefined =
        product?.variants?.find(variant => {

            if (!product.options) {
                return false
            }

            // Kontrollera först att kunden gjort alla val
            const allOptionsSelected = product.options.every(
                option =>
                    selectedOptions[option.option_name] !== undefined
            )

            if (!allOptionsSelected) {
                return false
            }

            // Kontrollera sedan om varianten matchar valen
            return product.options.every(option => {

                const selectedValue =
                    selectedOptions[option.option_name]

                const variantValue =
                    variant.options[option.option_name]

                return String(variantValue) === selectedValue
            })
        })

    // Visa variantens pris om en variant hittats.
    // Annars visas produktens grundpris.
    const displayedPrice =
        selectedVariant?.price ?? product?.base_price ?? 0

    const handleAddToCart = () => {
    if (!product || !selectedVariant) return

    addItem({
        product: product,
        quantity: quantity,

        selected_size: selectedOptions.size,

        custom_text: customText || undefined,
        custom_photo: customPhoto || undefined,

        unit_price: selectedVariant.price,
        total_price: selectedVariant.price * quantity,

        selected_options: selectedOptions,
    })

    setSelectedOptions({})
    setCustomText('')
    setCustomPhoto(null)
    setQuantity(1)
    setSelectedImage(0)
}

    if (loading) {
        return (
            <div className='product-page'>
                <p>Laddar produkt...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className='product-page'>
                <p>{error}</p>
            </div>
        )
    }

    if (!product) {
        return null
    }

    // Har kunden gjort alla val?
    const allOptionsSelected =
        product.options?.every(
            option =>
                selectedOptions[option.option_name] !== undefined
        ) ?? true

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

                {/* Höger — info + val */}
                <div className='product-right'>

                    <div className='product-info'>

                        <h1 className='product-name'>
                            {product.name}
                        </h1>

                        <p className='product-technique'>
                            {product.material}
                        </p>

                    </div>

                    {/* Pris */}
                    <p className='product-price'>
                        {displayedPrice} kr
                    </p>

                    {/* Dynamiska produktval */}
                    {product.options?.map(option => (
                        <div
                            className='product-option'
                            key={option.id}
                        >
                            <label>
                                {option.display_name}
                            </label>

                            <select
                                value={
                                    selectedOptions[
                                        option.option_name
                                    ] ?? ''
                                }
                                onChange={event =>
                                    handleOptionChange(
                                        option.option_name,
                                        event.target.value
                                    )
                                }
                            >
                                <option value='' disabled>
                                    Välj {option.display_name.toLowerCase()}
                                </option>

                                {option.values.map(value => (
                                    <option
                                        key={value.value}
                                        value={value.value}
                                    >
                                        {value.display_value}
                                    </option>
                                ))}

                            </select>
                        </div>
                    ))}

                    {/* Om kombinationen inte finns */}
                    {allOptionsSelected && !selectedVariant && (
                        <p className='variant-unavailable'>
                            Den valda kombinationen är inte tillgänglig.
                        </p>
                    )}

                    {/* Bilduppladdning */}
                    {product.allows_custom_photo && (
                        <div className='product-option'>

                            <label>Infoga bild</label>

                            <label className='upload-btn'>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={event =>
                                        setCustomPhoto(
                                            event.target.files?.[0] ?? null
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
                                    onChange={event =>
                                        setCustomText(event.target.value)
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

                    {/* Lägg i kundkorgen */}
                    <button
                        className='add-to-cart-btn'
                        onClick={handleAddToCart}
                        disabled={!selectedVariant}
                    >
                        Lägg till i kundkorgen
                    </button>

                </div>
            </div>
        </div>
    )
}