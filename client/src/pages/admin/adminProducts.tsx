import { useEffect, useState } from "react";

import type { Product } from "../../types";

import {
  getProducts,
  updateProductDetails,
  deleteProduct,
  updateProductVisibility,
  updateProductStockStatus,
  createProduct,
} from "../../api/products";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Visa / dölj formuläret för ny produkt
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    base_price: "",
    weight: "",
  });

  // -----------------------------------------
  // Ny produkt
  // -----------------------------------------

  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    material: "",
    base_price: "",
    weight: "",
    allows_custom_photo: false,
    allows_custom_text: false,
    allows_font_selection: false,
    is_seasonal: false,
  });

  // -----------------------------------------
  // Hämta produkter
  // -----------------------------------------

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setError("Kunde inte hämta produkter");
    }
  };

  useEffect(() => {
    async function initialLoad() {
      try {
        await loadProducts();
      } finally {
        setLoading(false);
      }
    }

    initialLoad();
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
  // Dölj / visa
  // -----------------------------------------

  const handleVisibility = async (product: Product) => {
    try {
      const newValue = !product.is_hidden;

      await updateProductVisibility(product.id, newValue);

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id
            ? {
                ...currentProduct,
                is_hidden: newValue,
              }
            : currentProduct,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Kunde inte ändra produktens synlighet");
    }
  };

  // -----------------------------------------
  // Lagerstatus
  // -----------------------------------------

  const handleStockStatus = async (product: Product) => {
    try {
      const newValue = !product.is_out_of_stock;

      await updateProductStockStatus(product.id, newValue);

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id
            ? {
                ...currentProduct,
                is_out_of_stock: newValue,
              }
            : currentProduct,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Kunde inte ändra lagerstatus");
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
  // Skapa ny produkt
  // -----------------------------------------

  const handleCreateProduct = async () => {
    try {
      const productData = {
        id: newProduct.id.trim(),
        name: newProduct.name.trim(),
        slug: newProduct.slug.trim(),
        type: "OWN" as const,
        description: newProduct.description.trim(),
        material: newProduct.material.trim(),
        base_price: Number(newProduct.base_price),
        weight: Number(newProduct.weight),
        allows_custom_photo: newProduct.allows_custom_photo,
        allows_custom_text: newProduct.allows_custom_text,
        allows_font_selection: newProduct.allows_font_selection,
        is_seasonal: newProduct.is_seasonal,
      };

      if (
        !productData.id ||
        !productData.name ||
        !productData.slug ||
        !productData.description ||
        !productData.material ||
        Number.isNaN(productData.base_price) ||
        Number.isNaN(productData.weight)
      ) {
        alert("Fyll i alla produktuppgifter.");
        return;
      }

      await createProduct(productData);

      await loadProducts();

      setNewProduct({
        id: "",
        name: "",
        slug: "",
        description: "",
        material: "",
        base_price: "",
        weight: "",
        allows_custom_photo: false,
        allows_custom_text: false,
        allows_font_selection: false,
        is_seasonal: false,
      });

      setShowCreateProduct(false);

      alert("Produkten har skapats.");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Kunde inte skapa produkten");
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

      {/* HEADER */}

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

        <button
          className="admin-btn"
          onClick={() => setShowCreateProduct((current) => !current)}
        >
          {showCreateProduct ? "Stäng" : "Skapa ny produkt"}
        </button>
      </div>

      {/* SKAPA NY PRODUKT */}

      {showCreateProduct && (
        <div className="admin-create-product">
          <h2 className="admin-create-title">Skapa ny produkt</h2>

          <p className="admin-section-title">
            Egna produkter
          </p>

          <div className="admin-create-grid">

            <div className="admin-create-left">

              <div className="admin-form-group">
                <label>Produkt-ID</label>

                <input
                  className="admin-input"
                  value={newProduct.id}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      id: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Produktnamn</label>

                <input
                  className="admin-input"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Slug</label>

                <input
                  className="admin-input"
                  placeholder="exempel-produkt"
                  value={newProduct.slug}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      slug: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Material</label>

                <input
                  className="admin-input"
                  value={newProduct.material}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      material: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <label>Beskrivning</label>

                <textarea
                  className="admin-textarea"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="admin-create-right">

              <div className="admin-form-row">

                <div className="admin-form-group">
                  <label>Pris (SEK)</label>

                  <input
                    className="admin-input"
                    type="number"
                    value={newProduct.base_price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
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
                    value={newProduct.weight}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        weight: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-checkbox-group">

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={newProduct.allows_custom_photo}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        allows_custom_photo: e.target.checked,
                      })
                    }
                  />
                  Tillåt egen bild
                </label>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={newProduct.allows_custom_text}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        allows_custom_text: e.target.checked,
                      })
                    }
                  />
                  Tillåt egen text
                </label>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={newProduct.allows_font_selection}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        allows_font_selection: e.target.checked,
                      })
                    }
                  />
                  Tillåt typsnitt
                </label>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={newProduct.is_seasonal}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        is_seasonal: e.target.checked,
                      })
                    }
                  />
                  Säsongsprodukt
                </label>

              </div>

              <p className="admin-product-info">
                Produkttyp: <strong>OWN</strong>
              </p>

            </div>
          </div>

          <div className="admin-create-actions">
            <button
              className="admin-save-btn"
              onClick={handleCreateProduct}
            >
              Skapa produkt
            </button>

            <button
              className="admin-btn"
              onClick={() => setShowCreateProduct(false)}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* PRODUKTLISTA */}

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

                  <p>
                    <span>Synlighet:</span>{" "}
                    {product.is_hidden ? "Dold" : "Synlig"}
                  </p>

                  <p>
                    <span>Lagerstatus:</span>{" "}
                    {product.is_out_of_stock
                      ? "Ej i lager"
                      : "I lager"}
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
                    className="admin-btn"
                    onClick={() => handleVisibility(product)}
                  >
                    {product.is_hidden ? "Visa" : "Dölj"}
                  </button>

                  <button
                    className="admin-btn"
                    onClick={() => handleStockStatus(product)}
                  >
                    {product.is_out_of_stock
                      ? "Markera i lager"
                      : "Ej i lager"}
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

              {/* REDIGERA PRODUKT */}

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