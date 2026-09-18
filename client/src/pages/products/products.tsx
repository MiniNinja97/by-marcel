import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import "./products.css";
import { getProducts } from "../../api/products";
import type { Product } from "../../types";
import { useLanguage } from "../../context/languageContext";
import ProductsSidebar from "./productsSidebar";

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
          sv: "Fotoskyltar",
          en: "Photo signs",
        },
        slug: "fotoskyltar",
      },
      {
        name: {
          sv: "Gatunamnskylt",
          en: "Street sign",
        },
        slug: "gatunamnskylt",
      },
      {
        name: {
          sv: "Husnummer & husskyltar",
          en: "House numbers & house signs",
        },
        slug: "husnummer",
      },
      {
        name: {
          sv: "Namnskyltar",
          en: "Name signs",
        },
        slug: "namnskyltar",
      },
      {
        name: {
          sv: "WC-skyltar",
          en: "WC signs",
        },
        slug: "wc-skyltar",
      },
      {
        name: {
          sv: "Informationsskyltar",
          en: "Information signs",
        },
        slug: "informationsskyltar",
      },
      {
        name: {
          sv: "Förbud & säkerhet",
          en: "Prohibition & safety",
        },
        slug: "sakerhet",
      },
      {
        name: {
          sv: "Gatunamn & automotive",
          en: "Street & automotive",
        },
        slug: "automotive",
      },
      {
        name: {
          sv: "Termometrar",
          en: "Thermometers",
        },
        slug: "termometrar",
      },
      {
        name: {
          sv: "Klockor",
          en: "Clocks",
        },
        slug: "klockor",
      },
      {
        name: {
          sv: "Övriga emaljskyltar",
          en: "Other enamel signs",
        },
        slug: "ovrigt",
      },
    ],
  },
];

const PRODUCTS_PER_PAGE = 12;

/*
  Bestämmer vilken underkategori en produkt tillhör.

  Vi använder produkt-ID eftersom våra produktfamiljer
  redan har tydliga prefix, exempelvis:

  EC.NPK
  ES.WC
  ES.TW
*/
function getSubcategory(product: Product): string {
  const id = product.id;

  // FOTOSKYLTAR
  if (id.startsWith("EC.PE")) {
    return "fotoskyltar";
  }

  // HUSNUMMER / HUSSKYLTAR
  if (
    id.startsWith("EC.HG") ||
    id.startsWith("EC.HO") ||
    id.startsWith("EC.HB") ||
    id.startsWith("EC.HQ") ||
    id.startsWith("EC.HR") ||
    id.startsWith("EC.HE") ||
    id.startsWith("EC.HNG") ||
    id.startsWith("EC.HNB") ||
    id.startsWith("EC.HNO") ||
    id.startsWith("EC.HNR") ||
    id.startsWith("EC.ISG") ||
    id.startsWith("EC.IHG") ||
    // id.startsWith("EC.SG") ||
    id.startsWith("ES.HK") ||
    id.startsWith("ES.HZ")
  ) {
    return "husnummer";
  }

  // GATUNAMNSKYLT
  if (id.startsWith("EC.SG")) {
    return "gatunamnskylt";
  }

  // NAMNSKYLTAR
  if (
    id.startsWith("EC.NPG") ||
    id.startsWith("EC.NPO") ||
    id.startsWith("EC.NPK") ||
    id.startsWith("EC.NPR") ||
    id.startsWith("EC.MW")
  ) {
    return "namnskyltar";
  }

  // WC
  if (id.startsWith("ES.WC") || id.startsWith("ES.PG")) {
    return "wc-skyltar";
  }

  // INFORMATIONSSKYLTAR
  if (id.startsWith("ES.MS")) {
    return "informationsskyltar";
  }

  // FÖRBUD / SÄKERHET
  if (id.startsWith("ES.NH") || id.startsWith("ES.VG")) {
    return "sakerhet";
  }

  // GATUNAMN / AUTOMOTIVE
  if (id.startsWith("ES.SS") || id.startsWith("ES.AUT")) {
    return "automotive";
  }

  // TERMOMETRAR
  if (
    id.startsWith("ES.TU") ||
    id.startsWith("ES.TW") ||
    id.startsWith("EC.TET")
  ) {
    return "termometrar";
  }

  // KLOCKOR
  if (id.startsWith("ES.KL") || id.startsWith("EC.KE")) {
    return "klockor";
  }

  // Allt som vi ännu inte placerat
  return "ovrigt";
}

function getPaginationPages(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    "...",
    totalPages,
  ];
}
export default function Products() {
  const { kategori, produkttyp, underkategori } = useParams();

  const { language } = useLanguage();

  // const [isEnamelOpen, setIsEnamelOpen] = useState(false);

  // const [openProductType, setOpenProductType] = useState<
  //   "egen-design" | "standardprodukter" | null
  // >(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Hämta produkter
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
    När användaren byter kategori börjar vi
    alltid på sida 1 igen.
  */
  useEffect(() => {
    setCurrentPage(1);
  }, [kategori, underkategori]);

  /*
    FILTRERING

    /produkter
    → alla produkter

    /produkter/emalj
    → alla EC + ES

    /produkter/emalj/termometrar
    → bara termometrar
  */
  const filteredProducts = products.filter((product) => {
    if (product.is_hidden) {
      return false;
    }

    // Alla produkter
    if (!kategori) {
      return true;
    }

    // Emalj
    if (kategori === "emalj") {
      const isEnamel = product.type === "EC" || product.type === "ES";

      if (!isEnamel) {
        return false;
      }

      // Alla emaljprodukter
      if (!produkttyp) {
        return true;
      }

      // Egen design = EC
      if (produkttyp === "egen-design") {
        if (product.type !== "EC") {
          return false;
        }

        // Alla produkter med egen design
        if (!underkategori) {
          return true;
        }

        // Specifik underkategori inom egen design
        return getSubcategory(product) === underkategori;
      }

      // Standardprodukter = ES
      if (produkttyp === "standardprodukter") {
        if (product.type !== "ES") {
          return false;
        }

        // Alla standardprodukter
        if (!underkategori) {
          return true;
        }

        // Specifik underkategori inom standardprodukter
        return getSubcategory(product) === underkategori;
      }

      return false;
    }

    return false;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  // Aktiv kategori
  const activeCategory = categories.find(
    (category) => category.slug === kategori,
  );

  // Aktiv underkategori
  const activeSubcategory = activeCategory?.subcategories.find(
    (subcategory) => subcategory.slug === underkategori,
  );

  // Rubrik
  let pageTitle = language === "sv" ? "Alla produkter" : "All products";

  if (kategori === "emalj") {
    pageTitle = language === "sv" ? "Emalj" : "Enamel";

    if (produkttyp === "egen-design") {
      pageTitle =
        language === "sv" ? "Emalj – Egen design" : "Enamel – Custom design";
    }

    if (produkttyp === "standardprodukter") {
      pageTitle =
        language === "sv"
          ? "Emalj – Standardprodukter"
          : "Enamel – Standard products";
    }

    if (activeSubcategory) {
      pageTitle = activeSubcategory.name[language];
    }
  }
  if (loading) {
    return (
      <div className="products">
        <div className="products-main">
          <p>
            {language === "sv" ? "Laddar produkter..." : "Loading products..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products">
        <div className="products-main">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // const customDesignSubcategories = categories[0].subcategories.filter(
  //   (subcategory) =>
  //     products.some(
  //       (product) =>
  //         !product.is_hidden &&
  //         product.type === "EC" &&
  //         getSubcategory(product) === subcategory.slug,
  //     ),
  // );

  // const standardSubcategories = categories[0].subcategories.filter(
  //   (subcategory) =>
  //     products.some(
  //       (product) =>
  //         !product.is_hidden &&
  //         product.type === "ES" &&
  //         getSubcategory(product) === subcategory.slug,
  //     ),
  // );

  return (
    <div className="products">
      {/* SIDOMENY */}
      <ProductsSidebar
        products={products}
        language={language}
        getSubcategory={getSubcategory}
        subcategories={categories[0].subcategories}
      />

      {/* HUVUDINNEHÅLL */}
      <main className="products-main">
        <div className="products-header">
          <h1>{pageTitle}</h1>

          <p>
            {language === "sv"
              ? `${filteredProducts.length} produkter`
              : `${filteredProducts.length} products`}
          </p>
        </div>

        <div
          className={`products-grid products-grid-${Math.min(
            visibleProducts.length,
            3,
          )}`}
        >
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
                    {language === "sv" ? "Ej i lager" : "Out of stock"}
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>

            {getPaginationPages(currentPage, totalPages).map((item, index) => {
              if (item === "...") {
                return (
                  <span key={`dots-${index}`} className="pagination-dots">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={item}
                  className={`pagination-btn ${
                    currentPage === item ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(item)}
                >
                  {item}
                </button>
              );
            })}

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
