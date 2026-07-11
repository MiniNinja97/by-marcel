import {Link, NavLink} from "react-router-dom";
import './footer.css';

export default function Footer  () {

    return (
        <footer className="footer">
            <Link to="/" className="footer__logo">
            By Marcel
            </Link>

            <nav>
                <ul className="footer__nav">
                    <li><NavLink to="/Interitetspolicy">Integritetspolicy</NavLink></li>
                    
                    <li><NavLink to="/Villkor">Villkor</NavLink></li>

                    <li><NavLink to="/contact">Kontakt</NavLink></li>
                </ul>
            </nav>

            <button className="footer__insta-button">
                <span className="footer__insta-icon">  </span>
                Följ oss på Instagram
            </button> 

        </footer> 

    )}