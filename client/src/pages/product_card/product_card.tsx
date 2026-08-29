import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { getProducts } from "../../api/products";
import type { Product, ProductVariant, ProductColor } from "../../types";
import { useCartStore } from "../../store/useCartStore";
import "./product_card.css";

export default function Product() {
  const { id } = useParams();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  // Här sparas alla val kunden gör.
  // Exempel:
  // size: "33 x 8 cm"
  // frame: "true"
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const [customTexts, setCustomTexts] = useState<Record<string, string>>({});
  const [customPhoto, setCustomPhoto] = useState<File | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState<ProductColor | null>(
    null,
  );
  const colorGroups = [
  {
    category: "Basis",
    title: "Basfärg",
  },
  {
    category: "Plus",
    title: "Plus",
  },
  {
    category: "Exklusiv",
    title: "Exklusiv",
  },
] as const;

  const [printColor, setPrintColor] = useState<ProductColor | null>(null);

  // Hämta produkten från API
  useEffect(() => {
    async function loadProduct() {
      try {
        const products = await getProducts();

        const foundProduct = products.find(
          (product) => product.id === id && !product.is_hidden,
        );

        if (!foundProduct) {
          setError("Produkten kunde inte hittas");
          return;
        }

        setProduct(foundProduct);
      } catch (error) {
        console.error(error);
        setError("Kunde inte hämta produkten");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  // Körs när kunden väljer exempelvis storlek eller ram
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((previous) => ({
      ...previous,
      [optionName]: value,
    }));
  };

  // Leta efter varianten som matchar kundens val
  const selectedVariant: ProductVariant | undefined = product?.variants?.find(
    (variant) => {
      if (!product.options) {
        return false;
      }

      // Kontrollera först att kunden gjort alla val
      const allOptionsSelected = product.options.every(
        (option) => selectedOptions[option.option_name] !== undefined,
      );

      if (!allOptionsSelected) {
        return false;
      }

      // Kontrollera sedan om varianten matchar valen
      return product.options.every((option) => {
        const selectedValue = selectedOptions[option.option_name];

        const variantValue = variant.options[option.option_name];

        return String(variantValue) === selectedValue;
      });
    },
  );

  // Visa variantens pris om en variant hittats.
  // Annars visas produktens grundpris.
  const variantPrice = selectedVariant?.price ?? product?.base_price ?? 0;

  const backgroundColorPrice = backgroundColor?.background_price ?? 0;

  const printColorPrice = printColor?.print_price ?? 0;

  const displayedPrice = variantPrice + backgroundColorPrice + printColorPrice;

  const displayedImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : (product?.images ?? []);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant?.id]);

  const handleAddToCart = () => {
    if (
      !product ||
      !selectedVariant ||
      product.is_out_of_stock ||
      !backgroundColor ||
      !printColor
    ) {
      return;
    }

    addItem({
  product: product,
  quantity: quantity,
  variant_id: selectedVariant.id,
  supplier_id: selectedVariant.supplier_id,

  selected_background_color: backgroundColor,
  selected_print_color: printColor,

  selected_size: selectedOptions.size,

  custom_texts: customTexts,
  custom_photo: customPhoto || undefined,

  unit_price: displayedPrice,
  total_price: displayedPrice * quantity,

  selected_options: selectedOptions,
});

    setSelectedOptions({});
    setBackgroundColor(null);
    setPrintColor(null);
    setCustomTexts({});
    setCustomPhoto(null);
    setQuantity(1);
    setSelectedImage(0);
  };

  if (loading) {
    return (
      <div className="product-page">
        <p>Laddar produkt...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Har kunden gjort alla val?
  const allOptionsSelected =
    product.options?.every(
      (option) => selectedOptions[option.option_name] !== undefined,
    ) ?? true;

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <NavLink to="/produkter">Produkter</NavLink>

        <span>—</span>

        <span>{product.name}</span>
      </nav>

      <div className="product-layout">
        {/* Vänster — bilder + beskrivning */}
        <div className="product-left">
          <div className="product-main-img">
            {displayedImages[selectedImage] ? (
              <img
                src={`https://www.bymarcel.se${displayedImages[selectedImage]}`}
                alt={product.name}
              />
            ) : (
              <div className="product-img-placeholder" />
            )}
          </div>

          {/* Små produktbilder */}
          {displayedImages.length > 1 && (
            <div className="product-thumbnails">
              {displayedImages.map((image, index) => (
                <div
                  key={index}
                  className={`product-thumbnail ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={`https://www.bymarcel.se${image}`}
                    alt={`${product.name} ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          <p className="product-description">{product.description}</p>
        </div>

        {/* Höger — info + val */}
        <div className="product-right">
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>

            <p className="product-technique">{product.material}</p>
          </div>

          {/* Pris */}
          <p className="product-price">{displayedPrice} kr</p>

          {/* Dynamiska produktval */}
          {product.options?.map((option) => (
            <div className="product-option" key={option.id}>
              <label>{option.display_name}</label>

              <select
                value={selectedOptions[option.option_name] ?? ""}
                onChange={(event) =>
                  handleOptionChange(option.option_name, event.target.value)
                }
              >
                <option value="" disabled>
                  Välj {option.display_name.toLowerCase()}
                </option>

                {option.values.map((value) => (
                  <option key={value.value} value={value.value}>
                    {value.display_value}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="product-color-columns">
            {/* Bakgrundsfärg */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-option">
                <label>Bakgrundsfärg</label>

                {colorGroups.map((group) => {
                  const colors = product.colors?.filter(
                    (color) => color.category === group.category,
                  );

                  if (!colors || colors.length === 0) {
                    return null;
                  }

                  return (
                    <div className="color-group" key={group.category}>
                      <p className="color-group-title">{group.title}</p>

                      <div className="color-options">
                        {colors.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            className={`color-option ${
                              backgroundColor?.id === color.id ? "selected" : ""
                            }`}
                            onClick={() => setBackgroundColor(color)}
                            title={`${color.name} (${color.ral_code})`}
                          >
                            <span
                              className="color-swatch"
                              style={{ backgroundColor: color.hex }}
                            />

                            <span className="color-info">
                              <span className="color-name">{color.name}</span>

                              <span className="color-details">
                                {color.ral_code}

                                {color.background_price > 0 &&
                                  ` · +${color.background_price} kr`}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tryckfärg = text + eventuell ram */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-option">
                <label>Tryckfärg (text och ram)</label>

                {colorGroups.map((group) => {
                  const colors = product.colors?.filter(
                    (color) => color.category === group.category,
                  );

                  if (!colors || colors.length === 0) {
                    return null;
                  }

                  return (
                    <div className="color-group" key={group.category}>
                      <p className="color-group-title">{group.title}</p>

                      <div className="color-options">
                        {colors.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            className={`color-option ${
                              printColor?.id === color.id ? "selected" : ""
                            }`}
                            onClick={() => setPrintColor(color)}
                            title={`${color.name} (${color.ral_code})`}
                          >
                            <span
                              className="color-swatch"
                              style={{ backgroundColor: color.hex }}
                            />

                            <span className="color-info">
                              <span className="color-name">{color.name}</span>

                              <span className="color-details">
                                {color.ral_code}

                                {color.print_price > 0 &&
                                  ` · +${color.print_price} kr`}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Om kombinationen inte finns */}
          {allOptionsSelected && !selectedVariant && (
            <p className="variant-unavailable">
              Den valda kombinationen är inte tillgänglig.
            </p>
          )}

          {/* Bilduppladdning */}
          {product.allows_custom_photo && (
            <div className="product-option">
              <label>Infoga bild</label>

              <label className="upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setCustomPhoto(event.target.files?.[0] ?? null)
                  }
                />
                📎
              </label>

              {customPhoto && (
                <p className="upload-filename">{customPhoto.name}</p>
              )}
            </div>
          )}

          {/* Egen text */}
          {product.allows_custom_text &&
            product.text_fields?.map((field) => (
              <div className="product-option" key={field.id}>
                <label>{field.display_name}</label>

                <div className="gravyr-box">
                  <textarea
                    value={customTexts[field.field_name] ?? ""}
                    onChange={(event) =>
                      setCustomTexts((previous) => ({
                        ...previous,
                        [field.field_name]: event.target.value,
                      }))
                    }
                    maxLength={field.max_length}
                    placeholder={field.placeholder ?? ""}
                    rows={2}
                  />

                  <p className="gravyr-hint">Max {field.max_length} tecken</p>
                </div>
              </div>
            ))}

          {/* Antal */}
          <div className="product-option">
            <label>Antal</label>

            <div className="quantity-row">
              <button
                className="quantity-btn"
                onClick={() =>
                  setQuantity((quantity) => Math.max(1, quantity - 1))
                }
              >
                −
              </button>

              <span className="quantity-value">{quantity}</span>

              <button
                className="quantity-btn"
                onClick={() => setQuantity((quantity) => quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Lägg i kundkorgen */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={
              !selectedVariant ||
              product.is_out_of_stock ||
              !backgroundColor ||
              !printColor
            }
          >
            {product.is_out_of_stock ? "Ej i lager" : "Lägg till i kundkorgen"}
          </button>
        </div>
      </div>
    </div>
  );
}
