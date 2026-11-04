import { useEffect, useState } from "react";
import {
  useParams,
  NavLink,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "./products.css";
import { getProducts } from "../../api/products";
import type { Product } from "../../types";
import { useLanguage } from "../../context/languageContext";
import ProductsSidebar from "./productsSidebar";
import enamelImage from "./products-img/emalj-framsida.jpeg";
import photoEngravingImage from "./products-img/bildgravyrfirst.jpeg";
import enamelCustomImage from "./products-img/emaljegendesign.jpeg";
import enamelStandardImage from "./products-img/emaljstandard.jpeg";
import creativeWoodImage from "./products-img/kreativa-traprodukter.jpeg";
import upcomingProductsImage from "./products-img/KT-first-img.jpeg";

const giftCardImage =
  "https://www.bymarcel.se/uploads/products/presentkort1.jpeg";

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
          sv: "Företags- och textskylt",
          en: "Business and text signs",
        },
        slug: "foretagsskyltar",
      },
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
          sv: "Gatunamnskyltar",
          en: "Street name signs",
        },
        slug: "gatunamn",
      },
      {
        name: {
          sv: "Vintage skyltar",
          en: "Vintage signs",
        },
        slug: "automotive",
        subcategories: [
          {
            name: {
              sv: "Vintage bilskyltar",
              en: "Vintage car signs",
            },
            slug: "vintage-bil",
          },
          {
            name: {
              sv: "Vintage MC-skyltar",
              en: "Vintage motorcycle signs",
            },
            slug: "vintage-mc",
          },
          {
            name: {
              sv: "Vintage garageskyltar",
              en: "Vintage garage signs",
            },
            slug: "vintage-garage",
          },
          {
            name: {
              sv: "Vintage lantbruksskyltar",
              en: "Vintage agricultural signs",
            },
            slug: "vintage-lantbruk",
          },
          {
            name: {
              sv: "Små vintageskyltar",
              en: "Small vintage signs",
            },
            slug: "vintage-sma",
          },
        ],
      },
      // {
      //   name: {
      //     sv: "Termometrar",
      //     en: "Thermometers",
      //   },
      //   slug: "termometrar",
      // },
      // {
      //   name: {
      //     sv: "Klockor",
      //     en: "Clocks",
      //   },
      //   slug: "klockor",
      // },
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

  // FÖRETAGSSKYLTAR
  if (id.startsWith("EC.ET")) {
    return "foretagsskyltar";
  }

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
  if (
    id.startsWith("ES.WC") ||
    id.startsWith("ES.CEHS-") ||
    ["ES.PG.05", "ES.PG.06", "ES.PG.07"].includes(id)
  ) {
    return "wc-skyltar";
  }

  // INFORMATIONSSKYLTAR
  if (
    id.startsWith("ES.MS") ||
    ["ES.PG.01", "ES.PG.02", "ES.PG.03", "ES.PG.04"].includes(id)
  ) {
    return "informationsskyltar";
  }

  // FÖRBUD / SÄKERHET
  if (id.startsWith("ES.NH") || id.startsWith("ES.VG")) {
    return "sakerhet";
  }

  // GATUNAMN
  if (id.startsWith("ES.SS")) {
    return "gatunamn";
  }

  // AUTOMOTIVE
  if (id.startsWith("ES.AUT")) {
    return "automotive";
  }

  // TERMOMETRAR - STANDARDPRODUKTER
  if (id.startsWith("ES.TU") || id.startsWith("ES.TW")) {
    return "termometrar";
  }

  // TERMOMETRAR - EGEN DESIGN
  if (id.startsWith("EC.TET")) {
    return "ovrigt";
  }

  // KLOCKOR - STANDARDPRODUKTER
  if (id.startsWith("ES.KL")) {
    return "klockor";
  }

  // KLOCKOR - EGEN DESIGN
  if (id.startsWith("EC.KE")) {
    return "ovrigt";
  }

  // Allt som vi ännu inte placerat
  return "ovrigt";
}

function getSubcategories(product: Product): string[] {
  const id = product.id;

  const subcategories = [getSubcategory(product)];

  // Dessa WC-skyltar ska även visas under Informationsskyltar
  if (["ES.PG.05", "ES.PG.06", "ES.PG.07"].includes(id)) {
    subcategories.push("informationsskyltar");
  }

  // VINTAGESKYLTAR - MOTIVKATEGORIER
  if (id.startsWith("ES.AUT.")) {
    const articleNumber = Number(id.split(".")[2]);

    if (articleNumber >= 1 && articleNumber <= 69) {
      subcategories.push("vintage-bil");
    } else if (articleNumber >= 70 && articleNumber <= 113) {
      subcategories.push("vintage-mc");
    } else if (articleNumber >= 114 && articleNumber <= 158) {
      subcategories.push("vintage-garage");
    } else if (articleNumber >= 159 && articleNumber <= 168) {
      subcategories.push("vintage-lantbruk");
    }
  }

  // SMÅ VINTAGESKYLTAR
  if (id.startsWith("ES.AUT.")) {
    const articleNumber = Number(id.split(".")[2]);

    const smallVintageSigns =
      (articleNumber >= 169 && articleNumber <= 247) ||
      [121, 122, 125, 137, 152].includes(articleNumber);

    if (smallVintageSigns) {
      subcategories.push("vintage-sma");
    }
  }

  return subcategories;
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
  const location = useLocation();

  const { language } = useLanguage();

  // const [isEnamelOpen, setIsEnamelOpen] = useState(false);

  // const [openProductType, setOpenProductType] = useState<
  //   "egen-design" | "standardprodukter" | null
  // >(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page"));

  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const changePage = (page: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }

      return params;
    });
  };

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
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [kategori, produkttyp, underkategori]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

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
        return getSubcategories(product).includes(underkategori);
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
        if (underkategori === "automotive") {
          return getSubcategories(product).includes("automotive");
        }

        return getSubcategories(product).includes(underkategori);
      }

      return false;
    }

    // KREATIVA TRÄPRODUKTER
    if (kategori === "kreativa-traprodukter") {
      return product.id.startsWith("KT.");
    }

    if (kategori === "kreativa-traprodukter") {
      pageTitle =
        language === "sv"
          ? "Kreativa träprodukter"
          : "Creative wooden products";
    }

    // Bildgravyr
    if (kategori === "bildgravyr") {
      return product.id === "LFG.TRA" || product.id === "LFG.DEK";
    }

    // Presentkort
    if (kategori === "presentkort") {
      return product.type === "gift_card";
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
  const activeSubcategory =
    activeCategory?.subcategories.find(
      (subcategory) => subcategory.slug === underkategori,
    ) ??
    activeCategory?.subcategories
      .flatMap((subcategory) => subcategory.subcategories ?? [])
      .find((subcategory) => subcategory.slug === underkategori);

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
  if (kategori === "bildgravyr") {
    pageTitle = language === "sv" ? "Bildgravyr" : "Photo engraving";
  }
  if (kategori === "presentkort") {
    pageTitle = language === "sv" ? "Presentkort" : "Gift cards";
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
        {/* ========================================
          KATEGORIVY
          Visas när man går till /produkter
      ======================================== */}
        {!kategori && (
          <div className="products-category-view">
            <div className="products-header">
              <h1>{language === "sv" ? "Produkter" : "Products"}</h1>

              <p>
                {language === "sv"
                  ? "Utforska vårt sortiment"
                  : "Explore our range"}
              </p>
            </div>

            <div className="products-category-grid">
              <NavLink
                to="/produkter/emalj/valj"
                className="products-category-card"
              >
                <div className="products-category-image">
                  <img
                    src={enamelImage}
                    alt={
                      language === "sv" ? "Emaljprodukter" : "Enamel products"
                    }
                  />
                </div>

                <h2>{language === "sv" ? "Emalj" : "Enamel"}</h2>
              </NavLink>

              <NavLink
                to="/produkter/kreativa-traprodukter"
                className="products-category-card"
              >
                <div className="products-category-image">
                  <img
                    src={creativeWoodImage}
                    alt={
                      language === "sv"
                        ? "Kreativa träprodukter"
                        : "Creative wooden products"
                    }
                  />
                </div>

                <h2>
                  {language === "sv"
                    ? "Kreativa träprodukter"
                    : "Creative wooden products"}
                </h2>
              </NavLink>

              <NavLink
                to="/produkter/bildgravyr"
                className="products-category-card"
              >
                <div className="products-category-image">
                  <img
                    src={photoEngravingImage}
                    alt={language === "sv" ? "Bildgravyr" : "Photo engraving"}
                  />
                </div>

                <h2>{language === "sv" ? "Bildgravyr" : "Photo engraving"}</h2>
              </NavLink>

              {/* Presentkort */}
              <NavLink
                to="/produkter/presentkort"
                className="products-category-card"
              >
                <div className="products-category-image giftcard-category-image">
                  <img
                    src={giftCardImage}
                    alt={language === "sv" ? "Presentkort" : "Gift cards"}
                  />
                </div>

                <h2>{language === "sv" ? "Presentkort" : "Gift cards"}</h2>
              </NavLink>

              {/* Kommande produkter */}
              <NavLink
                to="/produkter/kommande-produkter"
                className="products-category-card"
              >
                <div className="products-category-image">
                  <img
                    src={upcomingProductsImage}
                    alt={
                      language === "sv"
                        ? "Kommande produkter"
                        : "Upcoming products"
                    }
                  />
                </div>

                <h2>
                  {language === "sv" ? "Kommande produkter" : "Coming soon"}
                </h2>
              </NavLink>
            </div>
          </div>
        )}

        {/* ========================================
          EMALJ STARTVY
          Visas när man går till /produkter/emalj
      ======================================== */}
        {kategori === "emalj" && produkttyp === "valj" && (
          <div className="enamel-category-view">
            <h1>{language === "sv" ? "Emaljprodukter" : "Enamel products"}</h1>

            <p>
              {language === "sv"
                ? "Här hittar du både färdiga standardprodukter och emaljprodukter som du kan sätta din egen prägel på."
                : "Here you can find both finished standard products and enamel products that you can personalise."}
            </p>

            <div className="enamel-category-grid">
              <NavLink
                to="/produkter/emalj/egen-design"
                className="products-category-card"
              >
                <div className="products-category-image">
                  <img src={enamelCustomImage} alt="Egen design" />
                </div>

                <h2>{language === "sv" ? "Egen design" : "Custom design"}</h2>
              </NavLink>

              <NavLink
                to="/produkter/emalj/standardprodukter"
                className="products-category-card"
              >
                <div className="products-category-image">
                  <img src={enamelStandardImage} alt="Standardprodukter" />
                </div>

                <h2>
                  {language === "sv"
                    ? "Standardprodukter"
                    : "Standard products"}
                </h2>
              </NavLink>
            </div>
          </div>
        )}

        {/* KOMMANDE PRODUKTER */}
        {kategori === "kommande-produkter" && (
          <section className="upcoming-products">
            <h1>{language === "sv" ? "Kommande produkter" : "Coming soon"}</h1>

            <p>
              {language === "sv"
                ? "Webbutiken är igång med våra första produkter! Under de kommande månaderna fyller vi på med fler personliga produkter och kreativa möjligheter."
                : "Our online store is now open with our first products! Over the coming months, we'll be adding more personalised products and creative possibilities."}
            </p>

            <div className="upcoming-products-list">
              <div>
                <h2>Premium PhotoArt</h2>
                <p>
                  {language === "sv"
                    ? "Dina foton i stort format på aluminium eller akryl. En transparent epoxiyta ger färgerna djup och lyster med en glasliknande känsla. Integrerad bakgrundsbelysning skapar ett varmt sken och får bilden att sväva på väggen."
                    : "Your photos in large format on aluminium or acrylic. A transparent epoxy finish adds depth and brilliance to the colours with a glass-like appearance. Integrated backlighting creates a warm glow and makes the image appear to float on the wall."}
                </p>
              </div>

              <div>
                <h2>
                  {language === "sv" ? "Spegelgravyr" : "Mirror engraving"}
                </h2>
                <p>
                  {language === "sv"
                    ? "Foto, text eller logotyp graverad i spegel, med möjlighet till färgdetaljer. Ett personligt minne från dopet, bröllopet eller studenten, eller en unik inredningsdetalj."
                    : "Photos, text or logos engraved onto mirrors, with the option to add coloured details. A personalised keepsake for a christening, wedding or graduation, or a unique decorative piece for your home."}
                </p>
              </div>

              <div>
                <h2>
                  {language === "sv"
                    ? "Bildgravyr – fler material och tillval"
                    : "Photo engraving – more materials and options"}
                </h2>
                <p>
                  {language === "sv"
                    ? "Utöver plywood, MDF och dekorpanel kommer bland annat skiffer, natursten, glas, akryl och metall. Bakgrundsbelysning och en transparent epoxiyta blir nya tillval som ger bilden extra djup och karaktär."
                    : "In addition to plywood, MDF and decorative panels, we'll be introducing slate, natural stone, glass, acrylic and metal. Backlighting and a transparent epoxy finish will also be available as new options, adding extra depth and character to your image."}
                </p>
              </div>

              <div>
                <h2>
                  {language === "sv"
                    ? "Fler kreativa träprodukter"
                    : "More creative wooden products"}
                </h2>
                <p>
                  {language === "sv"
                    ? "Vi utökar sortimentet med nya former, egna designer och personliga detaljer i trä."
                    : "We're expanding our range with new shapes, custom designs and personalised wooden details."}
                </p>
              </div>

              <div>
                <h2>
                  {language === "sv" ? "Textiltryck" : "Textile printing"}
                </h2>
                <p>
                  {language === "sv"
                    ? "Din text, logotyp eller bild på kläder för privatpersoner, företag och föreningar. Brett klädsortiment och beställning från ett enda plagg."
                    : "Your text, logo or image printed on clothing for individuals, businesses and organisations. A wide range of garments, with orders starting from just one item."}
                </p>
              </div>

              <div>
                <h2>
                  {language === "sv"
                    ? "Tapettryck"
                    : "Custom wallpaper printing"}
                </h2>
                <p>
                  {language === "sv"
                    ? "Din egen design som tapet. På en hel vägg eller som en dekorativ detalj."
                    : "Turn your own design into wallpaper, whether for an entire wall or as a decorative feature."}
                </p>
              </div>

              <div>
                <h2>
                  {language === "sv"
                    ? "Personliga gåvor"
                    : "Personalised gifts"}
                </h2>
                <p>
                  {language === "sv"
                    ? "Graverade skifferunderlägg och dricksglas kommer snart. Därefter följer bland annat nyckelringar och pennor med personlig gravyr och mycket mer."
                    : "Engraved slate coasters and drinking glasses are coming soon. These will be followed by personalised engraved keyrings, pens and much more."}
                </p>
              </div>

              <div>
                <h2>
                  {language === "sv"
                    ? "Skyltar för inne och ute"
                    : "Indoor and outdoor signs"}
                </h2>
                <p>
                  {language === "sv"
                    ? "Unika skyltar för hemmet och stilfulla informationsskyltar som lyfter presentationen av konst, böcker och museiutställningar."
                    : "Unique signs for your home and elegant information signs that enhance the presentation of artwork, books and museum exhibitions."}
                </p>
              </div>
            </div>

            <p className="upcoming-products-contact">
              {language === "sv" ? "Mejla " : "Email "}
              <a href="mailto:info@bymarcel.se">info@bymarcel.se</a>
              {language === "sv"
                ? " om du redan nu vill ha mer information."
                : " if you'd like more information before these products become available."}
            </p>
          </section>
        )}

        {/* ========================================
          PRODUKTVY
          Visas först när Egen design eller
          Standardprodukter har valts
      ======================================== */}
        {((kategori === "emalj" && produkttyp !== "valj") ||
          kategori === "kreativa-traprodukter" ||
          kategori === "bildgravyr" ||
          kategori === "presentkort") && (
          <>
            <div className="products-header">
              <h1>{pageTitle}</h1>

              <p>
                {language === "sv"
                  ? `${filteredProducts.length} produkter`
                  : `${filteredProducts.length} products`}
              </p>
            </div>

            {/* PRODUKTGRID */}
            <div
              className={`products-grid products-grid-${Math.min(
                visibleProducts.length,
                3,
              )}`}
            >
              {visibleProducts.map((product) => (
                <NavLink
                  to={`/produkt/${product.id}`}
                  state={{
                    from: location.pathname + location.search,
                  }}
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-card-img">
                    {product.images?.[0] && (
                      <img
                        src={`https://www.bymarcel.se${product.images[0]}${
                          product.id === "EC.ET" ||
                          product.id === "EC.PE" ||
                          product.id.startsWith("EC.SG")
                            ? "?v=20261012"
                            : ""
                        }`}
                        alt={
                          language === "sv"
                            ? product.name
                            : product.name_en || product.name
                        }
                      />
                    )}
                  </div>

                  <div className="product-card-info">
                    <h3>
                      {language === "sv"
                        ? product.name
                        : product.name_en || product.name}
                    </h3>

                    <p>
                      {language === "sv"
                        ? product.description
                        : product.description_en || product.description}
                    </p>

                    <span className="product-card-price">
                      {product.type !== "ES" &&
                        product.type !== "gift_card" && (
                          <>{language === "sv" ? "Från " : "From "}</>
                        )}
                      {product.base_price} SEK
                    </span>
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
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {getPaginationPages(currentPage, totalPages).map(
                  (item, index) => {
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
                        onClick={() => changePage(item)}
                      >
                        {item}
                      </button>
                    );
                  },
                )}

                <button
                  className="pagination-btn"
                  onClick={() =>
                    changePage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
