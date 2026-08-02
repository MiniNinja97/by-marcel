import {useCartStore} from '../../store/useCartStore'
import {NavLink} from 'react-router-dom'
import './cart.css'


export default function Cart() {
    const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems} = useCartStore()

    const subtotal = getTotalPrice()
    const shipping = subtotal > 0 ? 79 : 0
    const moms = Math.round(subtotal * 0.25)
    const total = subtotal + shipping

    if (items.length === 0) {
        return (
            <div className='cart'>
                <div className='cart-empty'>
                    <h1>Din korg</h1>
                    <p>Din korg är tom</p>
                    <NavLink to='/produkter' className='cart-empty-btn'>
                        Utforska sortimentet
                    </NavLink>
                </div>
            </div>
        )
    }

    return (
        <div className='cart'>
            <div className='cart-header'>
                <h1>Din Korg</h1>
                <p>{getTotalItems()} {getTotalItems() === 1 ? 'produkt' : 'produkter'}</p>
            </div>

            <div className='cart-layout'>
                {items.map((item) => (
                    <div key={item.product.id} className='cart-item'>
                        <div className='cart-items'>
                            {item.product.images[0] 
                                ? <img src={item.product.images[0]} alt={item.product.name} />
                                : <div className='cart-item-img-placeholder'/>
                            }
                        </div>
                        <div className='cart-item-info'>
                            <h3>{item.product.name}</h3>
                            <p className='cart-item-specs'>
                                {[
                                    item.selected_size,
                                    item.selected_color?.name,
                                    item.selected_shape,
                                ].filter(Boolean).join(' . ')}
                            </p>
                            {item.custom_text && (
                                <p className='cart-item-text'>
                                    Vald text: {item.custom_text}
                                </p>
                            )}
                            <div className='cart-item-quantity'>
                                <button 
                                    className='quantity-btn'
                                    onClick={() => updateQuantity(
                                        item.product.id,
                                        Math.max(1, item.quantity - 1)
                                    )} 
                                > - </button>
                                <span>{item.quantity}</span>
                                <button
                                    className='quantity-btn'
                                    onClick={() => updateQuantity(
                                        item.product.id,
                                        item.quantity + 1
                                    )} 
                                > + </button>
                            </div>
                        </div>

                        <div className='cart-item-right'>
                            <p className='cart-item-price'>
                                {item.unit_price * item.quantity} kr
                            </p>
                            <button
                                className='cart-item-remove'
                                onClick={() => removeItem(item.product.id)}
                            >Ta bort</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className='cart-summary'>
                <h2>Orderöversikt</h2>
                <div className='cart-summary-rows'>
                    <div className='cart-summary-row'>
                        <span>Delsumma</span>
                        <span>{subtotal} kr</span>
                    </div>
                    <div className='cart-summary-row'>
                        <span>Frakt</span>
                        <span>{shipping} kr</span>
                    </div>
                    <div className='cart-summary-row'>
                        <span>Moms</span>
                        <span>{moms} kr</span>
                    </div>
                    <div className='cart-summary-row total'>
                        <span>Totalt</span>
                        <span>{total} kr</span>
                    </div>
                </div>
                <NavLink to='/betalning' className='cart-checkout-btn'>Gå till betalning</NavLink>
            </div>
        </div>
    )
}