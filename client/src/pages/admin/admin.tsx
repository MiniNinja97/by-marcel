import { useState } from 'react'
import AdminOrders from './adminOrders'
import AdminProducts from './adminProducts'
import AdminAbout from './adminAbout'

import './admin.css'

type AdminTab = 'ordrar' | 'produkter' | 'om-oss'

export default function Admin() {

    const [activeTab, setActiveTab] = useState<AdminTab>('ordrar')

    return (
        <div className='admin'>
            <div className='admin-header'>
                <h1>Admin läget</h1>
                <div className='admin-divider' />
            </div>

            <div className='admin-tabs'>
                <button
                    className={`admin-tab ${activeTab === 'ordrar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ordrar')}
                >
                    Ordrar
                </button>
                <button
                    className={`admin-tab ${activeTab === 'produkter' ? 'active' : ''}`}
                    onClick={() => setActiveTab('produkter')}
                >
                    Produkter
                </button>
                <button
                    className={`admin-tab ${activeTab === 'om-oss' ? 'active' : ''}`}
                    onClick={() => setActiveTab('om-oss')}
                >
                    Om Oss
                </button>
            </div>

            <div className='admin-content'>
                {activeTab === 'ordrar' && <AdminOrders />}
                {activeTab === 'produkter' && <AdminProducts />}
                {activeTab === 'om-oss' && <AdminAbout />}
            </div>
        </div>
    )
}