import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./home.css";
import logo from "../../assets/logo.png";
import { getProducts } from "../../api/products";
import type { Product } from "../../types";
import { useLanguage } from "../../context/languageContext";

type HomeFilter = "featured" | "new" | "seasonal";

export default function Home() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<HomeFilter>("featured");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hämta produkter från databasen
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);

        setError(
          language === "sv"
            ? "Kunde inte hämta produkter"
            : "Could not load products",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [language]);

  // Dolda produkter ska aldrig visas på startsidan
  const visibleProducts = products.filter(
    (product) => !product.is_hidden,
  );

  let displayedProducts: Product[] = [];

  // UTVALDA
  if (activeFilter === "featured") {
    displayedProducts = visibleProducts.filter(
      (product) => product.is_featured,
    );
  }

  // SÄSONG
  if (activeFilter === "seasonal") {
    displayedProducts = visibleProducts.filter(
      (product) => product.is_seasonal,
    );
  }

  // NYHETER
  if (activeFilter === "new") {
    displayedProducts = [...visibleProducts].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    );
  }

  // Vi visar maximalt tre produkter här
  displayedProducts = displayedProducts.slice(0, 3);

  return (
    <div className="home">
      {/* HERO */}
      <div className="hero" id="hero">
        <div className="hero-slides">
          <div className="hero-slide slide-1"></div>
          <div className="hero-slide slide-2"></div>
          <div className="hero-slide slide-3"></div>
        </div>

        <div className="hero-overlay"></div>

        <div className="hero-content" id="hero-content">
          <div className="logo">
            <img src={logo} alt="By Marcel" />
          </div>

          <div className="hero_content">
            <div className="hero-text">
              <h2>
                {language === "sv"
                  ? "Handgjorda produkter"
                  : "Handmade products"}
              </h2>
            </div>

            <button
              className="hero-button"
              id="hero-button"
              onClick={() => navigate("/produkter")}
            >
              {language === "sv"
                ? "Utforska sortimentet"
                : "Explore our products"}
            </button>
          </div>
        </div>
      </div>

      {/* HOME CONTENT */}
      <div className="home-content" id="home-content">
        <div
          className="home-content-top"
          id="home-content-top"
        >
          <h3 id="home-content-title">
            {language === "sv"
              ? "Home Content"
              : "Home Content"}
          </h3>

          <h2>
            {language === "sv"
              ? "Handplockat åt dig"
              : "Handpicked for you"}
          </h2>

          {/* FILTERKNAPPAR */}
          <div className="tripple-btn" id="tripple-btn">
            <button
              className={`tripple-btn-item ${
                activeFilter === "featured" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("featured")}
            >
              {language === "sv" ? "Utvalda" : "Featured"}
            </button>

            <button
              className={`tripple-btn-item ${
                activeFilter === "new" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("new")}
            >
              {language === "sv" ? "Nyheter" : "New"}
            </button>

            <button
              className={`tripple-btn-item ${
                activeFilter === "seasonal" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("seasonal")}
            >
              {language === "sv" ? "Säsong" : "Seasonal"}
            </button>
          </div>
        </div>

        {/* PRODUKTKORT */}
        <div className="product-cards" id="product-cards">
          {loading && (
            <p>
              {language === "sv"
                ? "Laddar produkter..."
                : "Loading products..."}
            </p>
          )}

          {error && <p>{error}</p>}

          {!loading &&
            !error &&
            displayedProducts.map((product) => (
              <NavLink
                key={product.id}
                to={`/produkt/${product.id}`}
                className="home-product-card"
              >
                {product.images?.[0] ? (
                  <img
                    src={`https://www.bymarcel.se${product.images[0]}`}
                    alt={product.name}
                  />
                ) : (
                  <div className="home-product-image-placeholder" />
                )}

                <h2>{product.name}</h2>

                <p>{product.description}</p>

                <p className="home-product-price">
                  {product.base_price} SEK
                </p>

                {product.is_out_of_stock && (
                  <p className="home-product-stock">
                    {language === "sv"
                      ? "Ej i lager"
                      : "Out of stock"}
                  </p>
                )}
              </NavLink>
            ))}

          {!loading &&
            !error &&
            displayedProducts.length === 0 && (
              <p>
                {language === "sv"
                  ? "Inga produkter att visa här ännu."
                  : "No products to display here yet."}
              </p>
            )}
        </div>

        <div className="devider"></div>

        {/* GÖR DET PERSONLIGT */}
        <div
          className="home-content-bottom"
          id="home-content-bottom"
        >
          <h2>
            {language === "sv"
              ? "Gör det personligt"
              : "Make it personal"}
          </h2>

          <div className="product-card-bottom">
            <img />
            <h2>
              {language === "sv"
                ? "Produktnamn"
                : "Product name"}
            </h2>
            <p>
              {language === "sv"
                ? "Produktbeskrivning"
                : "Product description"}
            </p>
            <p>{language === "sv" ? "Pris" : "Price"}</p>
          </div>

          <div className="product-card-bottom">
            <img />
            <h2>
              {language === "sv"
                ? "Produktnamn"
                : "Product name"}
            </h2>
            <p>
              {language === "sv"
                ? "Produktbeskrivning"
                : "Product description"}
            </p>
            <p>{language === "sv" ? "Pris" : "Price"}</p>
          </div>

          <div className="product-card-bottom">
            <img />
            <h2>
              {language === "sv"
                ? "Produktnamn"
                : "Product name"}
            </h2>
            <p>
              {language === "sv"
                ? "Produktbeskrivning"
                : "Product description"}
            </p>
            <p>{language === "sv" ? "Pris" : "Price"}</p>
          </div>

          <div className="product-card-bottom">
            <img />
            <h2>
              {language === "sv"
                ? "Produktnamn"
                : "Product name"}
            </h2>
            <p>
              {language === "sv"
                ? "Produktbeskrivning"
                : "Product description"}
            </p>
            <p>{language === "sv" ? "Pris" : "Price"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}