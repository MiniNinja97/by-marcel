import { useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import './product_card.css'

// Hårdkodad produkt tills databasen är klar
const mockProduct = {
    id: '1',
    name: 'Välkomstskylt',
    slug: 'valkomstskylt',
    description: 'Förvandla dina egna bilder till unika och personliga konstverk. Jag erbjuder bildgravyr på bland annat MDF, plywood, HPL, skiffer och aluminium, anpassat efter dina önskemål. Du kan skicka en eller flera bilder som jag kan kombinera till en ny komposition. Vid behöv kan jag även beskära motiv, använda delar av en bild och förbättra bildkvaliteten för bästa möjliga resultat. Innan jag graverar skickar jag vid behov en korrektur för godkännande, så att slutresultatet blir precis som du tänkt dig.\n\nFör dig som söker något utöver det vanliga kan bildgravyr kombineras med en kristallklar epoxybeläggning. Epoxyn ger motivet extra djup, lyster och en exklusiv glasliknande yta som framhäver detaljer och konstraster på ett unikt sätt.',
    technique: 'Lasergravyr',
    material: 'Trä',
    origin: 'Handgjord i Sverige',
    base_price: 299,
    images: ['', '', '', ''],
    sizes: ['20x15 cm', '30x20 cm', '40x30 cm'],
    materials: ['Ek', 'Björk', 'Valnöt'],
    colors: ['Naturlig', 'Mörkbrun', 'Svart'],
    allows_custom_photo: true,
    allows_custom_text: true,
    category: 'skyltar',
    subcategory: 'valkomstskylt',
}

export default function Product() {
    const { id } = useParams()

    const product = mockProduct

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedMaterial, setSelectedMaterial] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [customText, setCustomText] = useState('')
    const [customPhoto, setCustomPhoto] = useState<File | null>(null)
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        // Kopplas till Zustand-storen senare
        console.log({
            product,
            selectedSize,
            selectedMaterial,
            selectedColor,
            customText,
            customPhoto,
            quantity,
        })
    }

    return (
        <div className='product-page'>

            {/* Breadcrumb */}
            <nav className='breadcrumb'>
                <NavLink to='/produkter'>Produkter</NavLink>
                <span>—</span>
                <NavLink to={`/produkter/${product.category}`}>
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </NavLink>
                <span>—</span>
                <span>{product.name}</span>
            </nav>

            <div className='product-layout'>

                {/* Vänster — bilder + beskrivning */}
                <div className='product-left'>

                    <div className='product-main-img'>
                        {product.images[selectedImage]
                            ? <img src={product.images[selectedImage]} alt={product.name} />
                            : <div className='product-img-placeholder' />
                        }
                    </div>

                    <div className='product-thumbnails'>
                        {product.images.map((img, i) => (
                            <div
                                key={i}
                                className={`product-thumbnail ${selectedImage === i ? 'active' : ''}`}
                                onClick={() => setSelectedImage(i)}
                            >
                                {img
                                    ? <img src={img} alt={`${product.name} ${i + 1}`} />
                                    : <div className='product-img-placeholder' />
                                }
                            </div>
                        ))}
                    </div>

                    <p className='product-description'>{product.description}</p>

                </div>

                {/* Höger — info + val */}
                <div className='product-right'>

                    <div className='product-info'>
                        <h1 className='product-name'>{product.name}</h1>
                        <p className='product-technique'>
                            {product.technique} · {product.material} · {product.origin}
                        </p>
                    </div>

                    <p className='product-price'>{product.base_price} kr</p>

                    {/* Storlek */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className='product-option'>
                            <label>Storlek</label>
                            <select
                                value={selectedSize}
                                onChange={e => setSelectedSize(e.target.value)}
                            >
                                <option value='' disabled>Välj storlek</option>
                                {product.sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Material */}
                    {product.materials && product.materials.length > 0 && (
                        <div className='product-option'>
                            <label>Material</label>
                            <select
                                value={selectedMaterial}
                                onChange={e => setSelectedMaterial(e.target.value)}
                            >
                                <option value='' disabled>Välj material</option>
                                {product.materials.map(mat => (
                                    <option key={mat} value={mat}>{mat}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Färg */}
                    {product.colors && product.colors.length > 0 && (
                        <div className='product-option'>
                            <label>Färg</label>
                            <select
                                value={selectedColor}
                                onChange={e => setSelectedColor(e.target.value)}
                            >
                                <option value='' disabled>Välj färg</option>
                                {product.colors.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Bilduppladdning */}
                    {product.allows_custom_photo && (
                        <div className='product-option'>
                            <label>Infoga bild</label>
                            <label className='upload-btn'>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={e => setCustomPhoto(e.target.files?.[0] ?? null)}
                                />
                                📎
                            </label>
                            {customPhoto && (
                                <p className='upload-filename'>{customPhoto.name}</p>
                            )}
                        </div>
                    )}

                    {/* Gravyrtext */}
                    {product.allows_custom_text && (
                        <div className='product-option'>
                            <label>Din text för gravyr</label>
                            <div className='gravyr-box'>
                                <textarea
                                    value={customText}
                                    onChange={e => setCustomText(e.target.value)}
                                    maxLength={60}
                                    placeholder='Skriv din text här, tex namn, datum eller citat...'
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
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            >
                                −
                            </button>
                            <span className='quantity-value'>{quantity}</span>
                            <button
                                className='quantity-btn'
                                onClick={() => setQuantity(q => q + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Lägg i korg */}
                    <button className='add-to-cart-btn' onClick={handleAddToCart}>
                        Lägg till i kundkorgen
                    </button>

                </div>
            </div>
        </div>
    )
}