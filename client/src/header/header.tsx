import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./header.css";
import { useCartStore } from "../store/useCartStore";
import { useLanguage } from "../context/languageContext";

export default function Header() {
  const { getTotalItems } = useCartStore();
  const { language, setLanguage } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <Link
        to="/"
        className="header__logo"
        onClick={closeMenu}
      >
        By Marcel
      </Link>

      {/* BURGERKNAPP - VISAS PÅ MOBIL */}
      <button
        type="button"
        className={`header__burger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={
          language === "sv" ? "Öppna meny" : "Open menu"
        }
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* NAVIGATION */}
      <div
        className={`header__menu ${
          menuOpen ? "header__menu--open" : ""
        }`}
      >
        <nav>
          <ul className="header__nav">
            <li>
              <NavLink
                to="/produkter"
                onClick={closeMenu}
              >
                {language === "sv" ? "Produkter" : "Products"}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                onClick={closeMenu}
              >
                {language === "sv"
                  ? "Bakom kulisserna"
                  : "Behind the scenes"}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contact"
                onClick={closeMenu}
              >
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
            onClick={closeMenu}
          >
            <span className="header__cart-icon">🛒</span>

            {language === "sv" ? "Kundkorgen" : "Cart"} (
            {getTotalItems()})
          </NavLink>
        </div>
      </div>
    </header>
  );
}