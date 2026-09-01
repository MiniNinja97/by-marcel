import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import "./products.css";
import { getProducts } from "../../api/products";
import type { Product } from "../../types";
import { useLanguage } from "../../context/languageContext";

const categories = [
  {
    name: {
      sv: "Emalj",
      en: "Enamel",
    },
    slug: "emalj",
    subcategories: [
      {
        name: {
          sv: "Fotosyltar",
          en: "Photo signs",
        },
        slug: "fotosyltar",
      },
      {
        name: {
          sv: "Husnummer",
          en: "House numbers",
        },
        slug: "husnummer",
      },
      {
        name: {
          sv: "WC skyltar",
          en: "WC signs",
        },
        slug: "wc-skyltar",
      },
    ],
  },
];

const PRODUCTS_PER_PAGE = 6;

export default function Products() {
  const { kategori, underkategori } = useParams();
  const { language } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hämta produkter från PHP-API:t när sidan laddas
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

  /*
    Vi filtrerar inte på kategori ännu.

    Den gamla mock-datan hade:
    category
    subcategory

    men de finns ännu inte på vår riktiga Product/databasmodell.

    Därför visar vi tills vidare alla produkter från databasen.
  */
  const filteredProducts = products.filter(
    (product) => !product.is_hidden,
  );

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE,
  );

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  // Sidtitel
  const activeCategory = categories.find(
    (category) => category.slug === kategori,
  );

  const activeSubcategory =
    activeCategory?.subcategories.find(
      (subcategory) =>
        subcategory.slug === underkategori,
    );

  const pageTitle =
    activeSubcategory?.name[language] ??
    activeCategory?.name[language] ??
    (language === "sv"
      ? "Alla Produkter"
      : "All Products");

  // Meddelande medan API:t laddar
  if (loading) {
    return (
      <div className="products">
        <div className="products-main">
          <p>
            {language === "sv"
              ? "Laddar produkter..."
              : "Loading products..."}
          </p>
        </div>
      </div>
    );
  }

  // Meddelande om API-anropet misslyckas
  if (error) {
    return (
      <div className="products">
        <div className="products-main">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products">
      {/* Sidomeny */}
      <aside className="products-sidebar">
        <NavLink
          to="/produkter"
          className="sidebar-all"
        >
          {language === "sv"
            ? "Alla Produkter"
            : "All Products"}{" "}
          —
        </NavLink>

        {categories.map((category) => (
          <div
            key={category.slug}
            className="sidebar-category"
          >
            <NavLink
              to={`/produkter/${category.slug}`}
              className="sidebar-category-link"
            >
              {category.name[language]} —
            </NavLink>

            <ul className="sidebar-subcategories">
              {category.subcategories.map(
                (subcategory) => (
                  <li key={subcategory.slug}>
                    <NavLink
                      to={`/produkter/${category.slug}/${subcategory.slug}`}
                      className={({ isActive }) =>
                        isActive
                          ? "sidebar-sub-link active"
                          : "sidebar-sub-link"
                      }
                    >
                      {subcategory.name[language]}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </aside>

      {/* Huvudinnehåll */}
      <div className="products-main">
        <div className="products-header">
          <h1>{pageTitle}</h1>

          <p>
            {language === "sv"
              ? "Fotosyltar, personlig design & husnummer"
              : "Photo signs, personalised designs & house numbers"}
          </p>
        </div>

        <div className="products-grid">
          {visibleProducts.map((product) => (
            <NavLink
              to={`/produkt/${product.id}`}
              key={product.id}
              className="product-card"
            >
              <div className="product-card-img">
                {product.images?.[0] && (
                  <img
                    src={`https://www.bymarcel.se${product.images[0]}`}
                    alt={product.name}
                  />
                )}
              </div>

              <div className="product-card-info">
                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <span className="product-card-price">
                  {product.base_price} SEK
                </span>

                {product.is_out_of_stock && (
                  <span className="product-card-stock">
                    {language === "sv"
                      ? "Ej i lager"
                      : "Out of stock"}
                  </span>
                )}
              </div>
            </NavLink>
          ))}

          {visibleProducts.length === 0 && (
            <p>
              {language === "sv"
                ? "Inga produkter hittades."
                : "No products found."}
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1),
                )
              }
              disabled={currentPage === 1}
            >
              ‹
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1,
            ).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${
                  currentPage === page
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setCurrentPage(page)
                }
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1),
                )
              }
              disabled={
                currentPage === totalPages
              }
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
