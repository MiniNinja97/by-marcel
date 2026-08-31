import { useEffect, useState } from "react";

import type { Product } from "../../types";

import {
  getProducts,
  updateProductDetails,
  deleteProduct,
} from "../../api/products";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    base_price: "",
    weight: "",
  });

  // -----------------------------------------
  // Hämta produkter
  // -----------------------------------------

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setError("Kunde inte hämta produkter");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // -----------------------------------------
  // Öppna / stäng redigering
  // -----------------------------------------

  const handleEditProduct = (product: Product) => {
    if (expandedId === product.id) {
      setExpandedId(null);
      return;
    }

    setEditProduct({
      name: product.name,
      description: product.description,
      base_price: String(product.base_price),
      weight: String(product.weight),
    });

    setExpandedId(product.id);
  };

  // -----------------------------------------
  // Spara ändringar
  // -----------------------------------------

  const handleSaveProduct = async (product: Product) => {
    try {
      const updatedProduct = {
        name: editProduct.name.trim(),
        description: editProduct.description.trim(),
        base_price: Number(editProduct.base_price),
        weight: Number(editProduct.weight),
      };

      if (
        !updatedProduct.name ||
        !updatedProduct.description ||
        Number.isNaN(updatedProduct.base_price) ||
        Number.isNaN(updatedProduct.weight)
      ) {
        alert("Kontrollera produktinformationen");
        return;
      }

      await updateProductDetails(product.id, updatedProduct);

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id
            ? {
                ...currentProduct,
                ...updatedProduct,
              }
            : currentProduct,
        ),
      );

      setExpandedId(null);

      alert("Produktinformationen har uppdaterats.");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Kunde inte spara produktändringarna");
      }
    }
  };

  // -----------------------------------------
  // Ta bort produkt
  // -----------------------------------------

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Är du säker på att du vill ta bort "${product.name}"?\n\nDetta går inte att ångra.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(product.id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) => currentProduct.id !== product.id,
        ),
      );

      if (expandedId === product.id) {
        setExpandedId(null);
      }

      alert(`"${product.name}" har tagits bort.`);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Kunde inte ta bort produkten");
      }
    }
  };

  // -----------------------------------------
  // Sökning
  // -----------------------------------------

  const normalizedSearch = search.trim().toLowerCase();

  const filteredProducts = products
    .filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        product.id.toLowerCase().includes(normalizedSearch) ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.material.toLowerCase().includes(normalizedSearch)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));

  // -----------------------------------------
  // Loading / error
  // -----------------------------------------

  if (loading) {
    return <p>Laddar produkter...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // -----------------------------------------
  // Sida
  // -----------------------------------------

  return (
    <div className="admin-products">
      <div className="admin-table-header">
        <span style={{ flex: 1 }}>
          Produkter — {filteredProducts.length} st
        </span>

        <input
          className="admin-search"
          placeholder="Sök produkt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-products-list">
        {filteredProducts.length === 0 ? (
          <p>Inga produkter hittades.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="admin-product-row"
            >
              <div className="admin-product-id">
                <strong>Produkt-ID: {product.id}</strong>
              </div>

              <div className="admin-product-body">
                <div className="admin-product-info">
                  <p>
                    <span>Produktnamn:</span> {product.name}
                  </p>

                  <p>
                    <span>Beskrivning:</span> {product.description}
                  </p>

                  <p>
                    <span>Pris:</span> {product.base_price} SEK
                  </p>

                  <p>
                    <span>Vikt:</span> {product.weight} g
                  </p>

                  <p>
                    <span>Material:</span> {product.material}
                  </p>

                  <p>
                    <span>Slug:</span> {product.slug}
                  </p>
                </div>

                <div className="admin-product-flags">
                  <p>
                    <span>Tillåt egen text:</span>{" "}
                    {product.allows_custom_text ? "Ja" : "Nej"}
                  </p>

                  <p>
                    <span>Tillåt egen bild:</span>{" "}
                    {product.allows_custom_photo ? "Ja" : "Nej"}
                  </p>

                  <p>
                    <span>Tillåt typsnitt:</span>{" "}
                    {product.allows_font_selection ? "Ja" : "Nej"}
                  </p>

                  <p>
                    <span>Tillåt färger:</span>{" "}
                    {product.colors && product.colors.length > 0
                      ? "Ja"
                      : "Nej"}
                  </p>
                </div>

                <div className="admin-product-actions">
                  <button
                    className="admin-btn"
                    onClick={() => handleEditProduct(product)}
                  >
                    {expandedId === product.id
                      ? "Stäng"
                      : "Ändra"}
                  </button>

                  <button
                    className="admin-btn danger"
                    onClick={() => handleDeleteProduct(product)}
                  >
                    Ta bort
                  </button>
                </div>
              </div>

              <div className="admin-product-images">
                <p>
                  <span>Bilder:</span>{" "}
                  {product.images && product.images.length > 0
                    ? product.images.join(", ")
                    : "Inga bilder"}
                </p>
              </div>

              {expandedId === product.id && (
                <div className="admin-product-edit">
                  <div className="admin-form-group">
                    <label>Produktnamn</label>

                    <input
                      className="admin-input"
                      value={editProduct.name}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Beskrivning</label>

                    <textarea
                      className="admin-textarea"
                      value={editProduct.description}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>Pris (SEK)</label>

                      <input
                        className="admin-input"
                        type="number"
                        value={editProduct.base_price}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            base_price: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="admin-form-group">
                      <label>Vikt (g)</label>

                      <input
                        className="admin-input"
                        type="number"
                        value={editProduct.weight}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            weight: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <button
                    className="admin-save-btn"
                    onClick={() => handleSaveProduct(product)}
                  >
                    Spara ändringar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}