import { useState } from "react";
import { NavLink } from "react-router-dom";

import type { Product } from "../../types";

type Language = "sv" | "en";

type Subcategory = {
  name: {
    sv: string;
    en: string;
  };
  slug: string;
};

type ProductsSidebarProps = {
  products: Product[];
  language: Language;
  getSubcategory: (product: Product) => string;
  subcategories: Subcategory[];
};

export default function ProductsSidebar({
  products,
  language,
  getSubcategory,
  subcategories,
}: ProductsSidebarProps) {
  const [isEnamelOpen, setIsEnamelOpen] =
    useState(false);

  const [openProductType, setOpenProductType] =
    useState<
      "egen-design" | "standardprodukter" | null
    >(null);

  // Bara underkategorier som faktiskt har EC-produkter
  const customDesignSubcategories =
    subcategories.filter((subcategory) =>
      products.some(
        (product) =>
          !product.is_hidden &&
          product.type === "EC" &&
          getSubcategory(product) ===
            subcategory.slug,
      ),
    );

  // Bara underkategorier som faktiskt har ES-produkter
  const standardSubcategories =
    subcategories.filter((subcategory) =>
      products.some(
        (product) =>
          !product.is_hidden &&
          product.type === "ES" &&
          getSubcategory(product) ===
            subcategory.slug,
      ),
    );

  return (
    <aside className="products-sidebar">
      {/* ALLA PRODUKTER */}
      <NavLink
        to="/produkter"
        end
        className={({ isActive }) =>
          isActive
            ? "sidebar-all active"
            : "sidebar-all"
        }
      >
        {language === "sv"
          ? "Alla produkter"
          : "All products"}
      </NavLink>

      {/* EMALJ */}
      <div className="sidebar-category">
        <div className="sidebar-menu-row">
          <NavLink
            to="/produkter/emalj"
            end
            className={({ isActive }) =>
              isActive
                ? "sidebar-category-link active"
                : "sidebar-category-link"
            }
            onClick={() => setIsEnamelOpen(true)}
          >
            {language === "sv"
              ? "Emalj"
              : "Enamel"}
          </NavLink>

          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => {
              setIsEnamelOpen((open) => !open);

              if (isEnamelOpen) {
                setOpenProductType(null);
              }
            }}
            aria-label={
              isEnamelOpen
                ? language === "sv"
                  ? "Stäng Emalj"
                  : "Close Enamel"
                : language === "sv"
                  ? "Öppna Emalj"
                  : "Open Enamel"
            }
          >
            {isEnamelOpen ? "−" : "+"}
          </button>
        </div>

        {isEnamelOpen && (
          <div className="sidebar-product-types">
            {/* EGEN DESIGN */}
            <div className="sidebar-product-type">
              <div className="sidebar-menu-row">
                <NavLink
                  to="/produkter/emalj/egen-design"
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "sidebar-type-link active"
                      : "sidebar-type-link"
                  }
                  onClick={() =>
                    setOpenProductType(
                      "egen-design",
                    )
                  }
                >
                  {language === "sv"
                    ? "Egen design"
                    : "Custom design"}
                </NavLink>

                <button
                  type="button"
                  className="sidebar-toggle sidebar-toggle-small"
                  onClick={() =>
                    setOpenProductType(
                      (current) =>
                        current === "egen-design"
                          ? null
                          : "egen-design",
                    )
                  }
                  aria-label={
                    openProductType ===
                    "egen-design"
                      ? language === "sv"
                        ? "Stäng Egen design"
                        : "Close Custom design"
                      : language === "sv"
                        ? "Öppna Egen design"
                        : "Open Custom design"
                  }
                >
                  {openProductType ===
                  "egen-design"
                    ? "−"
                    : "+"}
                </button>
              </div>

              {openProductType ===
                "egen-design" && (
                <ul className="sidebar-subcategories">
                  {customDesignSubcategories.map(
                    (subcategory) => (
                      <li
                        key={`custom-${subcategory.slug}`}
                      >
                        <NavLink
                          to={`/produkter/emalj/egen-design/${subcategory.slug}`}
                          className={({
                            isActive,
                          }) =>
                            isActive
                              ? "sidebar-sub-link active"
                              : "sidebar-sub-link"
                          }
                        >
                          {
                            subcategory.name[
                              language
                            ]
                          }
                        </NavLink>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>

            {/* STANDARDPRODUKTER */}
            <div className="sidebar-product-type">
              <div className="sidebar-menu-row">
                <NavLink
                  to="/produkter/emalj/standardprodukter"
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "sidebar-type-link active"
                      : "sidebar-type-link"
                  }
                  onClick={() =>
                    setOpenProductType(
                      "standardprodukter",
                    )
                  }
                >
                  {language === "sv"
                    ? "Standardprodukter"
                    : "Standard products"}
                </NavLink>

                <button
                  type="button"
                  className="sidebar-toggle sidebar-toggle-small"
                  onClick={() =>
                    setOpenProductType(
                      (current) =>
                        current ===
                        "standardprodukter"
                          ? null
                          : "standardprodukter",
                    )
                  }
                  aria-label={
                    openProductType ===
                    "standardprodukter"
                      ? language === "sv"
                        ? "Stäng Standardprodukter"
                        : "Close Standard products"
                      : language === "sv"
                        ? "Öppna Standardprodukter"
                        : "Open Standard products"
                  }
                >
                  {openProductType ===
                  "standardprodukter"
                    ? "−"
                    : "+"}
                </button>
              </div>

              {openProductType ===
                "standardprodukter" && (
                <ul className="sidebar-subcategories">
                  {standardSubcategories.map(
                    (subcategory) => (
                      <li
                        key={`standard-${subcategory.slug}`}
                      >
                        <NavLink
                          to={`/produkter/emalj/standardprodukter/${subcategory.slug}`}
                          className={({
                            isActive,
                          }) =>
                            isActive
                              ? "sidebar-sub-link active"
                              : "sidebar-sub-link"
                          }
                        >
                          {
                            subcategory.name[
                              language
                            ]
                          }
                        </NavLink>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* KOMMANDE PRODUKTER */}
      <div className="sidebar-category">
        <NavLink
          to="/produkter/kommande-produkter"
          end
          className={({ isActive }) =>
            isActive
              ? "sidebar-category-link active"
              : "sidebar-category-link"
          }
        >
          {language === "sv"
            ? "Kommande produkter"
            : "Upcoming products"}
        </NavLink>
      </div>
    </aside>
  );
}