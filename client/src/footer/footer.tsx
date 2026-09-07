import { Link, NavLink } from "react-router-dom";
import "./footer.css";

export default function Footer() {
    return (
        <footer className="footer">

            <Link to="/" className="footer__logo">
                By Marcel
            </Link>

            <nav>
                <ul className="footer__nav">

                    <li>
                        <NavLink to="/integritetspolicy">
                            Integritetspolicy
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/kopevillkor">
                            Köpevillkor
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/leverans-retur-reklamation">
                            Leverans, retur & reklamation
                        </NavLink>
                    </li>

                    

                </ul>
            </nav>

            <a
    href="https://www.instagram.com/bymarcel_sweden/"
    target="_blank"
    rel="noopener noreferrer"
    className="footer__insta-button"
    aria-label="Följ By Marcel på Instagram"
>
    <svg
        className="footer__insta-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
        />
        <circle
            cx="12"
            cy="12"
            r="4"
        />
        <circle
            cx="17.5"
            cy="6.5"
            r="1"
            className="footer__insta-dot"
        />
    </svg>

    Följ oss på Instagram
</a>

        </footer>
    );
}