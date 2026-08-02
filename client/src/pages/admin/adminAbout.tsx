import { useState } from 'react'

export default function AdminAbout() {
    const [box1Text, setBox1Text] = useState('')
    const [box2Text, setBox2Text] = useState('')
    const [box1ImageUrl, setBox1ImageUrl] = useState('')
    const [box2ImageUrl, setBox2ImageUrl] = useState('')
    const [gallery, setGallery] = useState([
        { url: '', name: '', description: '' },
        { url: '', name: '', description: '' },
        { url: '', name: '', description: '' },
        { url: '', name: '', description: '' },
        { url: '', name: '', description: '' },
        { url: '', name: '', description: '' },
    ])

    const updateGalleryItem = (index: number, field: string, value: string) => {
        setGallery(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ))
    }

    return (
        <div className='admin-about'>
            <h3 className='admin-create-title'>Redigera Om Oss</h3>

            <div className='admin-about-grid'>

                {/* Bilder */}
                <div className='admin-about-section'>
                    <button className='admin-btn' style={{ marginBottom: '1rem' }}>Ändra bilder</button>
                    <div className='admin-form-group'>
                        <label>Box 1: Nuvarande URL</label>
                        <input className='admin-input' placeholder='https://...' value={box1ImageUrl} onChange={e => setBox1ImageUrl(e.target.value)} />
                    </div>
                    <div className='admin-form-group'>
                        <label>Box 2: Nuvarande URL</label>
                        <input className='admin-input' placeholder='https://...' value={box2ImageUrl} onChange={e => setBox2ImageUrl(e.target.value)} />
                    </div>
                </div>

                {/* Text box 1 */}
                <div className='admin-about-section'>
                    <button className='admin-btn' style={{ marginBottom: '1rem' }}>Ändra Text</button>
                    <p className='admin-about-current'>Box 1: Nuvarande text...</p>
                    <textarea
                        className='admin-textarea'
                        placeholder='Skriv ny text för box 1...'
                        value={box1Text}
                        onChange={e => setBox1Text(e.target.value)}
                    />
                </div>

                {/* Text box 2 */}
                <div className='admin-about-section'>
                    <button className='admin-btn' style={{ marginBottom: '1rem' }}>Ändra Text</button>
                    <p className='admin-about-current'>Box 2: Nuvarande text...</p>
                    <textarea
                        className='admin-textarea'
                        placeholder='Skriv ny text för box 2...'
                        value={box2Text}
                        onChange={e => setBox2Text(e.target.value)}
                    />
                </div>
            </div>

            {/* Bildgalleri */}
            <div className='admin-about-gallery'>
                <div className='admin-about-gallery-header'>
                    <button className='admin-btn'>Ändra bildgalleri</button>
                    <button className='admin-btn'>Ändra bildnamn</button>
                    <button className='admin-btn'>Ändra bildbeskrivning</button>
                </div>

                <div className='admin-about-gallery-grid'>
                    {gallery.map((item, i) => (
                        <div key={i} className='admin-gallery-item'>
                            <div className='admin-form-group'>
                                <label>URL</label>
                                <input className='admin-input' placeholder='https://...' value={item.url} onChange={e => updateGalleryItem(i, 'url', e.target.value)} />
                            </div>
                            <div className='admin-form-group'>
                                <label>Namn</label>
                                <input className='admin-input' placeholder='Namn...' value={item.name} onChange={e => updateGalleryItem(i, 'name', e.target.value)} />
                            </div>
                            <div className='admin-form-group'>
                                <label>Beskrivning</label>
                                <input className='admin-input' placeholder='Beskrivning...' value={item.description} onChange={e => updateGalleryItem(i, 'description', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='admin-create-actions'>
                <button className='admin-save-btn'>Spara och lägg till</button>
                <button className='admin-btn'>Förhandsgranska</button>
                <button className='admin-btn danger'>Ta bort</button>
            </div>
        </div>
    )
}