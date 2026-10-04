import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./home.css";
import logo from "../../assets/logo.png";
import daisie from "../../assets/home/daisie.jpg";
import brudpar from "../../assets/home/brudpar.jpg";
import emalj from "../../assets/home/emalj.jpg";
import { getProducts } from "../../api/products";
import type { Product } from "../../types";
import { useLanguage } from "../../context/languageContext";

type HomeFilter = "new" | "seasonal";

export default function Home() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<HomeFilter>("new");

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
  const visibleProducts = products.filter((product) => !product.is_hidden);

  let displayedProducts: Product[] = [];

  // UTVALDA
  // if (activeFilter === "featured") {
  //   displayedProducts = visibleProducts.filter(
  //     (product) => product.is_featured,
  //   );
  // }

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
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  // Vi visar maximalt tre produkter här
  displayedProducts = displayedProducts.slice(0, 6);

  return (
    <div className="home">
      {/* HERO */}
      <div className="hero" id="hero">
        <div className="hero-slides">
          {/* SLIDE 1 - INTRO */}
          <div className="hero-slide slide-1 hero-intro-slide">
            <div className="hero-content" id="hero-content">
              <div className="logo">
                <img src={logo} alt="By Marcel" />
              </div>

              <h2 className="hero-intro-title">
                {language === "sv"
                  ? "Välkommen till By Marcel"
                  : "Welcome to By Marcel"}
              </h2>

              <div className="hero-intro-columns">
                <div className="hero-intro-column">
                  <p>
                    {language === "sv"
                      ? "Designat och tillverkat i Sverige. Med känsla för material, detaljer och kvalitet skapar vi personliga produkter i vår egen tillverkning från den första idén till den färdiga produkten!"
                      : "Designed and manufactured in Sweden. With a passion for materials, details and quality, we create personal products in our own production – from the first idea to the finished product!"}
                  </p>
                </div>

                {/* <div className="hero-intro-column">
                  <p>
                    {language === "sv"
                      ? "Dina bilder, texter och idéer blir unika produkter med en personlig prägel."
                      : "Your photos, texts and ideas become unique products with a personal touch."}
                  </p>
                </div> */}
              </div>

              {/* <p className="launch-info">
                {language === "sv"
                  ? "Vi lanserar vårt sortiment stegvis. Fler unika produkter och möjligheter tillkommer inom kort."
                  : "We are launching our range step by step. More unique products and possibilities are coming soon."}
              </p> */}
            </div>
          </div>

          {/* SLIDE 2 - BILDGRAVYR */}
          <div className="hero-slide slide-2 hero-promo-slide">
            <div className="hero-promo-image">
              <img src={daisie} alt="Personlig bildgravyr" />
            </div>

            <div className="hero-promo-text">
              <h2>
                {language === "sv"
                  ? "Välj ett eget minne att föreviga med bildgravyr"
                  : "Choose a special memory to preserve with photo engraving"}
              </h2>
            </div>
          </div>

          {/* SLIDE 3 - PERSONLIG GÅVA */}
          <div className="hero-slide slide-3 hero-promo-slide">
            <div className="hero-promo-text">
              <h2>
                {language === "sv"
                  ? "Ge bort en personlig gåva"
                  : "Give a personal gift"}
              </h2>
            </div>

            <div className="hero-promo-image">
              <img
                className="brudpar-image"
                src={brudpar}
                alt="Personlig gåva"
              />
            </div>
          </div>
          {/* SLIDE 4 - EMALJ */}
          <div className="hero-slide slide-4 hero-promo-slide">
            <div className="hero-promo-image">
              <img src={emalj} alt="Emaljprodukter från By Marcel" />
            </div>

            <div className="hero-promo-text">
              <h2>
                {language === "sv"
                  ? "Husnummer, företagsskyltar, klockor och fotoskyltar! Se våra emaljprodukter både färdiga exemplar och produkter med egen design."
                  : "House numbers, company signs, clocks and photo signs! Explore our enamel products both ready-made designs and products you can customize."}
              </h2>
            </div>
          </div>
        </div>
        <div className="hero-corner-logo">
  <img src={logo} alt="By Marcel" />
</div>
         <p className="launch-info launch-info-fixed">
                {language === "sv"
                  ? "Vi lanserar vårt sortiment stegvis. Fler unika produkter och möjligheter tillkommer inom kort."
                  : "We are launching our range step by step. More unique products and possibilities are coming soon."}
              </p>
        <button
          className="hero-button hero-button-fixed"
          id="hero-button"
          onClick={() => navigate("/produkter")}
        >
          {language === "sv" ? "Utforska sortimentet" : "Explore our products"}
        </button>
      </div>

      {/* HOME CONTENT */}
      <div className="home-content" id="home-content">
        <div className="home-content-top" id="home-content-top">
          <p id="home-content-title">
            {language === "sv"
              ? "Personliga produkter"
              : "Personalised products"}
          </p>

          <h2>
            {language === "sv"
              ? "Skapat efter dina önskemål"
              : "Created to your wishes"}
          </h2>

          {/* FILTERKNAPPAR */}
          <div className="tripple-btn" id="tripple-btn">
            {/* <button
              className={`tripple-btn-item ${
                activeFilter === "featured" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("featured")}
            >
              {language === "sv" ? "Utvalda" : "Featured"}
            </button> */}

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

                <p className="home-product-price">{product.base_price} SEK</p>

                {product.is_out_of_stock && (
                  <p className="home-product-stock">
                    {language === "sv" ? "Ej i lager" : "Out of stock"}
                  </p>
                )}
              </NavLink>
            ))}

          {!loading && !error && displayedProducts.length === 0 && (
            <p>
              {language === "sv"
                ? "Inga produkter att visa här ännu."
                : "No products to display here yet."}
            </p>
          )}
        </div>

        <div className="devider"></div>

        {/* GÖR DET PERSONLIGT
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
        </div> */}
      </div>
    </div>
  );
}
