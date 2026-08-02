import {Link, NavLink} from "react-router-dom";
import './header.css';
import { useCartStore } from '../store/useCartStore'

export default function Header  () {

    const { getTotalItems } = useCartStore()

    return (
        <header className="header">
            <Link to="/" className="header__logo">
            By Marcel
            </Link>

            <nav>
                <ul className="header__nav">
                    <li><NavLink to="/produkter">Produkter</NavLink></li>
                    
                    <li><NavLink to="/about">Om oss</NavLink></li>

                    <li><NavLink to="/contact">Kontakt</NavLink></li>
                </ul>
            </nav>

            <NavLink to="/korg" className="header__cart-button">
                <span className="header__cart-icon">🛒</span>
                Kundkorgen ({getTotalItems()})
            </NavLink>

        </header> 

    )}