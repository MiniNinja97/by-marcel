import { useEffect, useState } from "react";

import type { Product, ProductType } from "../../types";
import {
  getProducts,
  updateProductVisibility,
  updateProductStockStatus,
  updateProductFeatured,
  updateProductDetails,
  createProduct,
  deleteProduct,
  createProductVariant,
} from "../../api/products";

type SortOption = "az" | "datum" | "vikt" | "totalpris";

export default function AdminProducts() {
  const [activeFilter, setActiveFilter] = useState("alla");
  const [activeSort, setActiveSort] = useState<SortOption>("az");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    base_price: "",
    weight: "",
  });
  const [newVariant, setNewVariant] = useState({
    id: "",
    supplier_id: "",
    size: "",
    frame: true,
    price: "",
    weight: "",
  });

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

  const handleToggleFeatured = async (product: Product) => {
    try {
      const newFeaturedValue = !product.is_featured;

      await updateProductFeatured(product.id, newFeaturedValue);

      setProducts((currentProducts) =>
        currentProducts.map((p) =>
          p.id === product.id
            ? {
                ...p,
                is_featured: newFeaturedValue,
              }
            : p,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Kunde inte ändra utvald produkt");
    }
  };

  const handleToggleStock = async (product: Product) => {
    try {
      const newStockValue = !product.is_out_of_stock;

      await updateProductStockStatus(product.id, newStockValue);

      setProducts((currentProducts) =>
        currentProducts.map((p) =>
          p.id === product.id
            ? {
                ...p,
                is_out_of_stock: newStockValue,
              }
            : p,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Kunde inte ändra lagerstatus");
    }
  };

  const handleToggleHidden = async (product: Product) => {
    try {
      const newHiddenValue = !product.is_hidden;

      await updateProductVisibility(product.id, newHiddenValue);

      setProducts((currentProducts) =>
        currentProducts.map((p) =>
          p.id === product.id ? { ...p, is_hidden: newHiddenValue } : p,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Kunde inte ändra produktens synlighet");
    }
  };

  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    slug: "",
    type: "EC" as ProductType,
    description: "",
    base_price: "",
    weight: "",
    material: "",
    category: "",
    allows_custom_text: false,
    allows_custom_photo: false,
    allows_font_selection: false,
    is_seasonal: false,
    sizes: {
      standard: false,
      s1: false,
      s2: false,
      s3: false,
      none: false,
    },
    colors: {
      standard: false,
      c1: false,
      c2: false,
      c3: false,
      none: false,
    },
  });

  const filters = ["alla", "emalj", "fotoskyltar", "gravyr"];

  if (loading) {
    return <p>Laddar produkter...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
    } catch (error) {
      console.error(error);
      alert("Kunde inte spara produktändringarna");
    }
  };

  const handleCreateProduct = async () => {
    try {
      if (
        !newProduct.id.trim() ||
        !newProduct.name.trim() ||
        !newProduct.slug.trim() ||
        !newProduct.description.trim() ||
        !newProduct.material.trim() ||
        !newProduct.base_price ||
        !newProduct.weight
      ) {
        alert("Fyll i alla obligatoriska fält");
        return;
      }

      await createProduct({
        id: newProduct.id.trim(),
        name: newProduct.name.trim(),
        slug: newProduct.slug.trim(),
        type: newProduct.type,
        description: newProduct.description.trim(),
        material: newProduct.material.trim(),
        base_price: Number(newProduct.base_price),
        weight: Number(newProduct.weight),
        allows_custom_photo: newProduct.allows_custom_photo,
        allows_custom_text: newProduct.allows_custom_text,
        allows_font_selection: newProduct.allows_font_selection,
        is_seasonal: newProduct.is_seasonal,
      });

      const updatedProducts = await getProducts();
      setProducts(updatedProducts);

      alert("Produkten skapades!");
      setShowCreateForm(false);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Kunde inte skapa produkten");
      }
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Är du säker på att du vill ta bort "${product.name}"?`,
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

      alert("Produkten togs bort!");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Kunde inte ta bort produkten");
      }
    }
  };

  const handleCreateVariant = async (product: Product) => {
    try {
      if (
        !newVariant.id.trim() ||
        !newVariant.supplier_id.trim() ||
        !newVariant.size.trim() ||
        !newVariant.price
      ) {
        alert("Fyll i variant-ID, leverantörs-ID, storlek och pris");
        return;
      }

      const price = Number(newVariant.price);

      const weight =
        newVariant.weight.trim() !== "" ? Number(newVariant.weight) : undefined;

      if (
        Number.isNaN(price) ||
        (weight !== undefined && Number.isNaN(weight))
      ) {
        alert("Kontrollera pris och vikt");
        return;
      }

      await createProductVariant({
        id: newVariant.id.trim(),
        product_id: product.id,
        supplier_id: newVariant.supplier_id.trim(),
        price,
        weight,
        options: {
          size: newVariant.size.trim(),
          frame: newVariant.frame,
        },
      });

      const updatedProducts = await getProducts();
      setProducts(updatedProducts);

      setNewVariant({
        id: "",
        supplier_id: "",
        size: "",
        frame: true,
        price: "",
        weight: "",
      });

      alert("Varianten skapades!");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Kunde inte skapa varianten");
      }
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-filter-row">
        {filters.map((f) => (
          <button
            key={f}
            className={`admin-filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <input
          className="admin-search"
          placeholder="Sök produkt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="admin-btn"
          style={{
            marginLeft: "auto",
            borderColor: "var(--gold)",
            color: "var(--gold)",
          }}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Stäng" : "Skapa ny produkt"}
        </button>
      </div>

      {/* Skapa ny produkt */}
      {showCreateForm && (
        <div className="admin-create-product">
          <h3 className="admin-create-title">Skapa ny produkt</h3>
          <div className="admin-create-grid">
            <div className="admin-create-left">
              <div className="admin-form-group">
                <label>Produkt ID</label>
                <input
                  className="admin-input"
                  placeholder="PROD-001"
                  value={newProduct.id}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, id: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label>Produktnamn</label>
                <input
                  className="admin-input"
                  placeholder="Naturskylt"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="admin-form-group">
                <label>Beskrivning</label>
                <textarea
                  className="admin-textarea"
                  placeholder="Produktbeskrivning..."
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Pris (kr)</label>
                  <input
                    className="admin-input"
                    type="number"
                    placeholder="395"
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
                    placeholder="300"
                    value={newProduct.weight}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, weight: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Bilder +</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="admin-input"
                  style={{ padding: "0.4rem" }}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Produkttyp</label>
              <select
                className="admin-input"
                value={newProduct.type}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    type: e.target.value as ProductType,
                  })
                }
              >
                <option value="EC">EC – Emalj Custom</option>
                <option value="ES">ES – Emalj Standard</option>
                <option value="OWN">OWN – Egen produkt</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Slug</label>
              <input
                className="admin-input"
                placeholder="gatunamnsskylt"
                value={newProduct.slug}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    slug: e.target.value,
                  })
                }
              />
            </div>

            <div className="admin-create-right">
              <div className="admin-form-group">
                <label>Material</label>
                <select
                  className="admin-input"
                  value={newProduct.material}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, material: e.target.value })
                  }
                >
                  <option value="">Välj material</option>
                  <option>Emalj</option>
                  <option>Björk</option>
                  <option>Granit</option>
                  <option>Bomull</option>
                  <option>Vinyl</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Kategori</label>
                <select
                  className="admin-input"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  <option value="">Välj kategori</option>
                  <option>Emalj</option>
                  <option>Skyltar</option>
                  <option>Kläder</option>
                  <option>Dekaler</option>
                  <option>Tavlor</option>
                  <option>Säsong</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Storlekar</label>
                <div className="admin-checkbox-group">
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.sizes.standard}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          sizes: {
                            ...newProduct.sizes,
                            standard: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Standard storlekar
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.sizes.s1}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          sizes: { ...newProduct.sizes, s1: e.target.checked },
                        })
                      }
                    />{" "}
                    15x15 cm
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.sizes.s2}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          sizes: { ...newProduct.sizes, s2: e.target.checked },
                        })
                      }
                    />{" "}
                    20x20 cm
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.sizes.s3}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          sizes: { ...newProduct.sizes, s3: e.target.checked },
                        })
                      }
                    />{" "}
                    30x30 cm
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.sizes.none}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          sizes: {
                            ...newProduct.sizes,
                            none: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Inga storleksalternativ
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Färger</label>
                <div className="admin-checkbox-group">
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.colors.standard}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          colors: {
                            ...newProduct.colors,
                            standard: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Standard färger
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.colors.c1}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          colors: {
                            ...newProduct.colors,
                            c1: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Färg 1
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.colors.c2}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          colors: {
                            ...newProduct.colors,
                            c2: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Färg 2
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.colors.c3}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          colors: {
                            ...newProduct.colors,
                            c3: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Färg 3
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={newProduct.colors.none}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          colors: {
                            ...newProduct.colors,
                            none: e.target.checked,
                          },
                        })
                      }
                    />{" "}
                    Inga färgalternativ
                  </label>
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
                  />{" "}
                  Kunden får ladda upp egen bild
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
                  />{" "}
                  Kunden får skriva egen text
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
                  />{" "}
                  Kunden får välja typsnitt
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
                  />{" "}
                  Säsongsprodukt
                </label>
              </div>
            </div>
          </div>

          <div className="admin-create-actions">
            <button className="admin-save-btn" onClick={handleCreateProduct}>
              Spara och lägg till
            </button>
            <button className="admin-btn">Förhandsgranska</button>
            <button className="admin-btn danger">Ta bort</button>
          </div>
        </div>
      )}

      <div className="admin-table-header">
        <span style={{ flex: 1 }}>
          Produkter —{" "}
          {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
        </span>
        <div className="admin-sort-row">
          {(["az", "datum", "vikt", "totalpris"] as SortOption[]).map((s) => (
            <button
              key={s}
              className={`admin-sort-btn ${activeSort === s ? "active" : ""}`}
              onClick={() => setActiveSort(s)}
            >
              {s === "az" ? "A - Ö" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <input
          className="admin-search"
          placeholder="Sök Produkt ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-products-list">
        {products.map((product) => (
          <div key={product.id} className="admin-product-row">
            <div className="admin-product-id">
              <strong>Produkt id: {product.id}</strong>
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
                  <span>Pris:</span> {product.base_price} kr
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
                  <span>Tillåt färger:</span>
                  {product.colors && product.colors.length > 0 ? "Ja" : "Nej"}
                </p>
              </div>

              <div className="admin-product-actions">
                <button
                  className="admin-btn"
                  onClick={() => {
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
                  }}
                >
                  Ändra
                </button>
                <button className="admin-btn danger">Ta bort</button>
                <button
                  className="admin-btn"
                  onClick={() => handleToggleHidden(product)}
                >
                  {product.is_hidden ? "Visa" : "Dölj"}
                </button>
                <button
                  className="admin-btn"
                  onClick={() => handleToggleStock(product)}
                >
                  {product.is_out_of_stock ? "I lager" : "Ej i lager"}
                </button>
                <button
                  className="admin-btn"
                  onClick={() => handleToggleFeatured(product)}
                >
                  {product.is_featured
                    ? "Ta bort från utvalda"
                    : "Visa i utvalda"}
                </button>
              </div>
            </div>

            <div className="admin-product-images">
              <p>
                <span>Bilder:</span>{" "}
                {product.images.length > 0
                  ? product.images.join(", ")
                  : "Inga bilder"}
              </p>
              <div className="admin-image-actions">
                <button className="admin-btn">Ladda upp</button>
                <button
                  className="admin-btn danger"
                  onClick={() => handleDeleteProduct(product)}
                >
                  Ta bort
                </button>
                <button className="admin-btn">Ändra ordning</button>
                <button className="admin-btn">Ändra huvudbild</button>
              </div>
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
                    <label>Pris (kr)</label>
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

                {product.type === "EC" && (
                  <div className="admin-variant-create">
                    <h3>Lägg till variant</h3>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Variant-ID</label>
                        <input
                          className="admin-input"
                          placeholder="EC.SG1.10"
                          value={newVariant.id}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              id: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Leverantörs-ID</label>
                        <input
                          className="admin-input"
                          placeholder="SG-10"
                          value={newVariant.supplier_id}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              supplier_id: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Storlek</label>
                        <input
                          className="admin-input"
                          placeholder="90 x 15 cm"
                          value={newVariant.size}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              size: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Ram</label>
                        <select
                          className="admin-input"
                          value={newVariant.frame ? "true" : "false"}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              frame: e.target.value === "true",
                            })
                          }
                        >
                          <option value="true">Med ram</option>
                          <option value="false">Utan ram</option>
                        </select>
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Pris (kr)</label>
                        <input
                          className="admin-input"
                          type="number"
                          value={newVariant.price}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              price: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label>Vikt (g)</label>
                        <input
                          className="admin-input"
                          type="number"
                          value={newVariant.weight}
                          onChange={(e) =>
                            setNewVariant({
                              ...newVariant,
                              weight: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <button
                      className="admin-save-btn"
                      onClick={() => handleCreateVariant(product)}
                    >
                      Lägg till variant
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
