import { useState } from 'react'

type SortOption = 'az' | 'datum' | 'vikt' | 'totalpris'

const mockProducts = [
    {
        id: 'PROD-001',
        name: 'Naturskylt i ek',
        description: 'En vacker skylt i ekmassiv',
        base_price: 395,
        material: 'Ek',
        slug: 'naturskylt-i-ek',
        weight: 300,
        images: [],
        allows_custom_text: true,
        allows_custom_photo: false,
        allows_font_selection: true,
        colors: [],
        is_seasonal: false,
        category: 'skyltar',
    }
]

export default function AdminProducts() {
    const [activeFilter, setActiveFilter] = useState('alla')
    const [activeSort, setActiveSort] = useState<SortOption>('az')
    const [search, setSearch] = useState('')
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [showCreateForm, setShowCreateForm] = useState(false)

    const [newProduct, setNewProduct] = useState({
        id: '', name: '', description: '', base_price: '',
        weight: '', material: '', category: '',
        allows_custom_text: false, allows_custom_photo: false,
        allows_font_selection: false, is_seasonal: false,
        sizes: { standard: false, s1: false, s2: false, s3: false, none: false },
        colors: { standard: false, c1: false, c2: false, c3: false, none: false },
    })

    const filters = ['alla', 'emalj', 'fotoskyltar', 'gravyr']

    return (
        <div className='admin-products'>

            <div className='admin-filter-row'>
                {filters.map(f => (
                    <button
                        key={f}
                        className={`admin-filter-btn ${activeFilter === f ? 'active' : ''}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
                <input
                    className='admin-search'
                    placeholder='Sök produkt...'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button
                    className='admin-btn'
                    style={{ marginLeft: 'auto', borderColor: 'var(--gold)', color: 'var(--gold)' }}
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Stäng' : 'Skapa ny produkt'}
                </button>
            </div>

            {/* Skapa ny produkt */}
            {showCreateForm && (
                <div className='admin-create-product'>
                    <h3 className='admin-create-title'>Skapa ny produkt</h3>
                    <div className='admin-create-grid'>
                        <div className='admin-create-left'>
                            <div className='admin-form-group'>
                                <label>Produkt ID</label>
                                <input className='admin-input' placeholder='PROD-001' value={newProduct.id} onChange={e => setNewProduct({ ...newProduct, id: e.target.value })} />
                            </div>
                            <div className='admin-form-group'>
                                <label>Produktnamn</label>
                                <input className='admin-input' placeholder='Naturskylt' value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div className='admin-form-group'>
                                <label>Beskrivning</label>
                                <textarea className='admin-textarea' placeholder='Produktbeskrivning...' value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            </div>
                            <div className='admin-form-row'>
                                <div className='admin-form-group'>
                                    <label>Pris (kr)</label>
                                    <input className='admin-input' type='number' placeholder='395' value={newProduct.base_price} onChange={e => setNewProduct({ ...newProduct, base_price: e.target.value })} />
                                </div>
                                <div className='admin-form-group'>
                                    <label>Vikt (g)</label>
                                    <input className='admin-input' type='number' placeholder='300' value={newProduct.weight} onChange={e => setNewProduct({ ...newProduct, weight: e.target.value })} />
                                </div>
                            </div>
                            <div className='admin-form-group'>
                                <label>Bilder +</label>
                                <input type='file' multiple accept='image/*' className='admin-input' style={{ padding: '0.4rem' }} />
                            </div>
                        </div>

                        <div className='admin-create-right'>
                            <div className='admin-form-group'>
                                <label>Material</label>
                                <select className='admin-input' value={newProduct.material} onChange={e => setNewProduct({ ...newProduct, material: e.target.value })}>
                                    <option value=''>Välj material</option>
                                    <option>Ek</option>
                                    <option>Björk</option>
                                    <option>Granit</option>
                                    <option>Bomull</option>
                                    <option>Vinyl</option>
                                </select>
                            </div>
                            <div className='admin-form-group'>
                                <label>Kategori</label>
                                <select className='admin-input' value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                    <option value=''>Välj kategori</option>
                                    <option>Emalj</option>
                                    <option>Skyltar</option>
                                    <option>Kläder</option>
                                    <option>Dekaler</option>
                                    <option>Tavlor</option>
                                    <option>Säsong</option>
                                </select>
                            </div>

                            <div className='admin-form-group'>
                                <label>Storlekar</label>
                                <div className='admin-checkbox-group'>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.sizes.standard} onChange={e => setNewProduct({ ...newProduct, sizes: { ...newProduct.sizes, standard: e.target.checked } })} /> Standard storlekar</label>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.sizes.s1} onChange={e => setNewProduct({ ...newProduct, sizes: { ...newProduct.sizes, s1: e.target.checked } })} /> 15x15 cm</label>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.sizes.s2} onChange={e => setNewProduct({ ...newProduct, sizes: { ...newProduct.sizes, s2: e.target.checked } })} /> 20x20 cm</label>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.sizes.s3} onChange={e => setNewProduct({ ...newProduct, sizes: { ...newProduct.sizes, s3: e.target.checked } })} /> 30x30 cm</label>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.sizes.none} onChange={e => setNewProduct({ ...newProduct, sizes: { ...newProduct.sizes, none: e.target.checked } })} /> Inga storleksalternativ</label>
                                </div>
                            </div>

                            <div className='admin-form-group'>
                                <label>Färger</label>
                                <div className='admin-checkbox-group'>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.colors.standard} onChange={e => setNewProduct({ ...newProduct, colors: { ...newProduct.colors, standard: e.target.checked } })} /> Standard färger</label>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.colors.c1} onChange={e => setNewProduct({ ...newProduct, colors: { ...newProduct.colors, c1: e.target.checked } })} /> Färg 1</label>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.colors.c2} onChange={e => setNewProduct({ ...newProduct, colors: { ...newProduct.colors, c2: e.target.checked } })} /> Färg 2</label>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.colors.c3} onChange={e => setNewProduct({ ...newProduct, colors: { ...newProduct.colors, c3: e.target.checked } })} /> Färg 3</label>
                                    <label className='admin-checkbox'><input type='checkbox' checked={newProduct.colors.none} onChange={e => setNewProduct({ ...newProduct, colors: { ...newProduct.colors, none: e.target.checked } })} /> Inga färgalternativ</label>
                                </div>
                            </div>

                            <div className='admin-checkbox-group'>
                                <label className='admin-checkbox'><input type='checkbox' checked={newProduct.allows_custom_photo} onChange={e => setNewProduct({ ...newProduct, allows_custom_photo: e.target.checked })} /> Kunden får ladda upp egen bild</label>
                                <label className='admin-checkbox'><input type='checkbox' checked={newProduct.allows_custom_text} onChange={e => setNewProduct({ ...newProduct, allows_custom_text: e.target.checked })} /> Kunden får skriva egen text</label>
                                <label className='admin-checkbox'><input type='checkbox' checked={newProduct.allows_font_selection} onChange={e => setNewProduct({ ...newProduct, allows_font_selection: e.target.checked })} /> Kunden får välja typsnitt</label>
                                <label className='admin-checkbox'><input type='checkbox' checked={newProduct.is_seasonal} onChange={e => setNewProduct({ ...newProduct, is_seasonal: e.target.checked })} /> Säsongsprodukt</label>
                            </div>
                        </div>
                    </div>

                    <div className='admin-create-actions'>
                        <button className='admin-save-btn'>Spara och lägg till</button>
                        <button className='admin-btn'>Förhandsgranska</button>
                        <button className='admin-btn danger'>Ta bort</button>
                    </div>
                </div>
            )}

            <div className='admin-table-header'>
                <span style={{ flex: 1 }}>Produkter — {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}</span>
                <div className='admin-sort-row'>
                    {(['az', 'datum', 'vikt', 'totalpris'] as SortOption[]).map(s => (
                        <button key={s} className={`admin-sort-btn ${activeSort === s ? 'active' : ''}`} onClick={() => setActiveSort(s)}>
                            {s === 'az' ? 'A - Ö' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
                <input className='admin-search' placeholder='Sök Produkt ID...' value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className='admin-products-list'>
                {mockProducts.map(product => (
                    <div key={product.id} className='admin-product-row'>
                        <div className='admin-product-id'>
                            <strong>Produkt id: {product.id}</strong>
                        </div>

                        <div className='admin-product-body'>
                            <div className='admin-product-info'>
                                <p><span>Produktnamn:</span> {product.name}</p>
                                <p><span>Beskrivning:</span> {product.description}</p>
                                <p><span>Pris:</span> {product.base_price} kr</p>
                                <p><span>Material:</span> {product.material}</p>
                                <p><span>Slug:</span> {product.slug}</p>
                            </div>

                            <div className='admin-product-flags'>
                                <p><span>Tillåt egen text:</span> {product.allows_custom_text ? 'Ja' : 'Nej'}</p>
                                <p><span>Tillåt egen bild:</span> {product.allows_custom_photo ? 'Ja' : 'Nej'}</p>
                                <p><span>Tillåt typsnitt:</span> {product.allows_font_selection ? 'Ja' : 'Nej'}</p>
                                <p><span>Tillåt färger:</span> {product.colors.length > 0 ? 'Ja' : 'Nej'}</p>
                            </div>

                            <div className='admin-product-actions'>
                                <button className='admin-btn' onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>Ändra</button>
                                <button className='admin-btn danger'>Ta bort</button>
                                <button className='admin-btn'>Dölj</button>
                                <button className='admin-btn'>Ej i lager</button>
                                <button className='admin-btn'>Visa i utvalda</button>
                            </div>
                        </div>

                        <div className='admin-product-images'>
                            <p><span>Bilder:</span> {product.images.length > 0 ? product.images.join(', ') : 'Inga bilder'}</p>
                            <div className='admin-image-actions'>
                                <button className='admin-btn'>Ladda upp</button>
                                <button className='admin-btn danger'>Ta bort</button>
                                <button className='admin-btn'>Ändra ordning</button>
                                <button className='admin-btn'>Ändra huvudbild</button>
                            </div>
                        </div>

                        {expandedId === product.id && (
                            <div className='admin-product-edit'>
                                <div className='admin-form-group'>
                                    <label>Produktnamn</label>
                                    <input className='admin-input' defaultValue={product.name} />
                                </div>
                                <div className='admin-form-group'>
                                    <label>Beskrivning</label>
                                    <textarea className='admin-textarea' defaultValue={product.description} />
                                </div>
                                <div className='admin-form-row'>
                                    <div className='admin-form-group'>
                                        <label>Pris (kr)</label>
                                        <input className='admin-input' type='number' defaultValue={product.base_price} />
                                    </div>
                                    <div className='admin-form-group'>
                                        <label>Vikt (g)</label>
                                        <input className='admin-input' type='number' defaultValue={product.weight} />
                                    </div>
                                </div>
                                <button className='admin-save-btn'>Spara ändringar</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}