import { Link, NavLink } from "react-router-dom";
import "./header.css";
import { useCartStore } from "../store/useCartStore";
import { useLanguage } from "../context/languageContext";

export default function Header() {
  const { getTotalItems } = useCartStore();
  const { language, setLanguage } = useLanguage();

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        By Marcel
      </Link>

      <nav>
        <ul className="header__nav">
          <li>
            <NavLink to="/produkter">
              {language === "sv" ? "Produkter" : "Products"}
            </NavLink>
          </li>

          <li>
            <NavLink to="/about">
              {language === "sv"
                ? "Bakom kulisserna"
                : "Behind the scenes"}
            </NavLink>
          </li>

          <li>
            <NavLink to="/contact">
              {language === "sv" ? "Kontakt" : "Contact"}
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="header__right">
        <div className="header__language">
          <button
            type="button"
            className={language === "sv" ? "active" : ""}
            onClick={() => setLanguage("sv")}
          >
            SV
          </button>

          <span>/</span>

          <button
            type="button"
            className={language === "en" ? "active" : ""}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
        </div>

        <NavLink
          to="/korg"
          className="header__cart-button"
        >
          <span className="header__cart-icon">🛒</span>

          {language === "sv" ? "Kundkorgen" : "Cart"} (
          {getTotalItems()})
        </NavLink>
      </div>
    </header>
  );
}