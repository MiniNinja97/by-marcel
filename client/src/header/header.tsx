import {Link, NavLink} from "react-router-dom";
import '../header.css';

export default function Header  () {

    return (
        <header className="header">
            <Link to="/" className="header__logo">
            </Link>

            <nav>
                <ul className="header__nav">
                    <li><NavLink to="/products">Produkter</NavLink></li>
                    
                    <li><NavLink to="/about">Om oss</NavLink></li>

                    <li><NavLink to="/contact">Kontakt</NavLink></li>
                </ul>
            </nav>

            <button className="header__cart-button">
                <span className="header__cart-icon">🛒</span>
                Kundkorgen (0)
            </button> 

        </header> 

    )}