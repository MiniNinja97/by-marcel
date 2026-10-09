import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { getProducts } from "../../api/products";
import type { Product, ProductVariant, ProductColor } from "../../types";
import { useCartStore } from "../../store/useCartStore";
import { useLanguage } from "../../context/languageContext";
import "./product_card.css";

export default function Product() {
  const { id } = useParams();
  const { addItem } = useCartStore();
  const { language } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const [galleryDescription, setGalleryDescription] = useState("");

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const [customTexts, setCustomTexts] = useState<Record<string, string>>({});

  const [customPhoto, setCustomPhoto] = useState<File | null>(null);

  const [uploadFiles, setUploadFiles] = useState<Record<string, File[]>>({});

  const [quantity, setQuantity] = useState(1);
  const [cartError, setCartError] = useState("");
  const [showCartConfirmation, setShowCartConfirmation] = useState(false);

  const [backgroundColor, setBackgroundColor] = useState<ProductColor | null>(
    null,
  );

  const [printColor, setPrintColor] = useState<ProductColor | null>(null);

  const colorGroups = [
    {
      category: "Basis",
      title: language === "sv" ? "Basfärg" : "Base",
    },
    {
      category: "Plus",
      title: "Plus",
    },
    {
      category: "Exklusiv",
      title: language === "sv" ? "Exklusiv" : "Exclusive",
    },
  ] as const;

  // Hämta produkten från API
  useEffect(() => {
    async function loadProduct() {
      try {
        const products = await getProducts();

        const foundProduct = products.find(
          (product) => product.id === id && !product.is_hidden,
        );

        if (!foundProduct) {
          setError(
            language === "sv"
              ? "Produkten kunde inte hittas"
              : "The product could not be found",
          );
          return;
        }

        setProduct(foundProduct);
        console.log("PRODUCT DATA:", foundProduct);
      } catch (error) {
        console.error(error);

        setError(
          language === "sv"
            ? "Kunde inte hämta produkten"
            : "Could not load the product",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, language]);

  // Nollställ kundval när användaren går till en annan produkt.
  useEffect(() => {
    setSelectedOptions({});
    setBackgroundColor(null);
    setPrintColor(null);
    setCustomTexts({});
    setCustomPhoto(null);
    setUploadFiles({});
    setQuantity(1);
    setSelectedImage(0);
    setCartError("");
  }, [id]);

  /*
   * Hämtar de värden som faktiskt är möjliga för
   * ett produktval utifrån tidigare gjorda val.
   *
   * Exempel EC.PE:
   *
   * Form = Rund
   *
   * Då kommer Storlek bara innehålla storlekar
   * från varianter där shape === "round".
   */
  const getAvailableOptionValues = (optionName: string): Set<string> => {
    if (!product || !product.options || !product.variants) {
      return new Set<string>();
    }
    if (
      product.id === "LFG.TRA" &&
      optionName !== "shape" &&
      optionName !== "size"
    ) {
      const option = product.options.find(
        (option) => option.option_name === optionName,
      );

      return new Set(option?.values.map((value) => String(value.value)) ?? []);
    }

    const currentOptionIndex = product.options.findIndex(
      (option) => option.option_name === optionName,
    );

    if (currentOptionIndex === -1) {
      return new Set<string>();
    }

    // Bara val som ligger FÖRE det aktuella valet
    // ska påverka vilka värden som visas.
    const previousOptions = product.options.slice(0, currentOptionIndex);

    const matchingVariants = product.variants.filter((variant) => {
      return previousOptions.every((previousOption) => {
        const selectedValue = selectedOptions[previousOption.option_name];

        // Har kunden inte valt detta ännu
        // filtrerar vi inte på det.
        if (selectedValue === undefined || selectedValue === "") {
          return true;
        }

        const variantValue = variant.options[previousOption.option_name];

        return String(variantValue) === String(selectedValue);
      });
    });

    const availableValues = new Set<string>();

    matchingVariants.forEach((variant) => {
      const value = variant.options[optionName];

      if (value !== undefined && value !== null) {
        availableValues.add(String(value));
      }
    });

    return availableValues;
  };

  // Kunden ändrar exempelvis Form eller Storlek
  const handleOptionChange = (optionName: string, value: string) => {
    if (!product?.options) {
      return;
    }

    const changedOptionIndex = product.options.findIndex(
      (option) => option.option_name === optionName,
    );

    setSelectedOptions((previous) => {
      const updated: Record<string, string> = {
        ...previous,
        [optionName]: value,
      };

      /*
       * Om kunden ändrar ett tidigare val måste
       * alla efterföljande val nollställas.
       *
       * Exempel:
       * Rektangel → 30 x 20 cm
       *
       * Kunden byter sedan till Rund.
       *
       * Då får 30 x 20 cm inte ligga kvar.
       */
      product.options?.forEach((option, index) => {
        if (index > changedOptionIndex) {
          delete updated[option.option_name];
        }
      });

      if (optionName === "title" && value !== "custom") {
        setCustomTexts((previous) => {
          const updated = { ...previous };
          delete updated.custom_title;
          return updated;
        });
      }

      return updated;
    });

    setCartError("");
  };

  // Leta efter varianten som matchar kundens val.
  //
  // ES-produkter har inga kundval och ska därför använda sin
  // enda variant automatiskt. EC-produkter matchas mot de
  // dynamiska val som finns i product.options.
  const selectedVariant: ProductVariant | undefined = (() => {
    if (!product?.variants || product.variants.length === 0) {
      return undefined;
    }

    const relevantOptions =
      product.id === "LFG.TRA"
        ? (product.options ?? []).filter(
            (option) =>
              option.option_name === "shape" || option.option_name === "size",
          )
        : product.type === "EC"
          ? (product.options ?? [])
          : [];

    // En produkt utan kundval ska ha exakt en variant.
    if (relevantOptions.length === 0) {
      return product.variants.length === 1 ? product.variants[0] : undefined;
    }

    const allOptionsSelected = relevantOptions.every(
      (option) => selectedOptions[option.option_name] !== undefined,
    );

    if (!allOptionsSelected) {
      return undefined;
    }

    return product.variants.find((variant) =>
      relevantOptions.every((option) => {
        const selectedValue = selectedOptions[option.option_name];

        const variantValue = variant.options[option.option_name];

        return String(variantValue) === String(selectedValue);
      }),
    );
  })();

  const variantPrice = selectedVariant?.price ?? product?.base_price ?? 0;

  const backgroundColorPrice =
    product?.type === "EC" ? (backgroundColor?.background_price ?? 0) : 0;

  const printColorPrice =
    product?.type === "EC" ? (printColor?.print_price ?? 0) : 0;

  const giftCardAmount =
    product?.type === "gift_card" ? Number(selectedOptions.amount ?? 0) : 0;

  const optionAddOnPrice =
    product?.id === "LFG.TRA" && selectedVariant?.option_prices
      ? Object.entries(selectedOptions).reduce(
          (total, [optionName, optionValue]) => {
            const price =
              selectedVariant.option_prices?.[optionName]?.[optionValue] ?? 0;

            return total + price;
          },
          0,
        )
      : 0;

  const displayedPrice =
    variantPrice +
    backgroundColorPrice +
    printColorPrice +
    giftCardAmount +
    optionAddOnPrice;

  const displayedImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : (product?.images ?? []);
  const galleryImages = (() => {
    if (!product) {
      return [];
    }

    const images: {
      image: string;
      description: string;
    }[] = [];

    // Produktens vanliga startbilder
    product.images?.forEach((image) => {
      images.push({
        image,
        description:
          language === "sv" ? product.name : product.name_en || product.name,
      });
    });

    // Alla variantbilder
    product.variants?.forEach((variant) => {
      variant.images?.forEach((image) => {
        // Lägg inte till samma bild flera gånger
        if (images.some((item) => item.image === image)) {
          return;
        }

        const optionDescription = product.options
          ?.map((option) => {
            const value = variant.options[option.option_name];

            if (value === undefined || value === null) {
              return null;
            }

            const optionValue = option.values.find(
              (item) => String(item.value) === String(value),
            );

            const optionName =
              language === "sv"
                ? option.display_name
                : option.display_name_en || option.display_name;

            const optionDisplayValue = optionValue
              ? language === "sv"
                ? optionValue.display_value
                : optionValue.display_value_en || optionValue.display_value
              : value;

            return `${optionName}: ${optionDisplayValue}`;
          })
          .filter(Boolean)
          .join(" · ");

        images.push({
          image,
          description:
            optionDescription ||
            (language === "sv"
              ? product.name
              : product.name_en || product.name),
        });
      });
    });

    return images;
  })();

  // Byter varianten bild börjar vi på första bilden
  useEffect(() => {
    setSelectedImage(0);
    setGalleryImage(null);
    setGalleryDescription("");
  }, [selectedVariant?.id]);

  const handleAddToCart = () => {
    setCartError("");

    if (!product || product.is_out_of_stock) {
      return;
    }

    const isCustomEnamel = product.type === "EC";
    const isGiftCard = product.type === "gift_card";
    const isWoodEngraving = product.id === "LFG.TRA";

    const requiresVariant = (product.variants?.length ?? 0) > 0;

    const requiresColors = isCustomEnamel && (product.colors?.length ?? 0) > 0;
    const requiredWoodOptions = isWoodEngraving
      ? [
          "shape",
          "size",
          ...(selectedOptions.shape === "rectangle" ||
          selectedOptions.shape === "oval"
            ? ["orientation"]
            : []),
          "surface",
          "thickness",
          "wall_mount",
          "epoxy_finish",
          "wooden_stand",
          "floating_led",
        ]
      : [];

    const missingWoodOptions = requiredWoodOptions.filter(
      (optionName) => !selectedOptions[optionName],
    );

    if (missingWoodOptions.length > 0) {
      setCartError(
        language === "sv"
          ? "Gör alla produktval innan du lägger produkten i kundkorgen."
          : "Complete all product options before adding the product to your cart.",
      );

      return;
    }
    if (isWoodEngraving && !uploadFiles["engraving_image_0"]?.[0]) {
      setCartError(
        language === "sv"
          ? "Ladda upp en bild för gravyr innan du lägger produkten i kundkorgen."
          : "Upload an image for engraving before adding the product to your cart.",
      );

      return;
    }

    // Kontrollera obligatoriska val för presentkort
    if (isGiftCard) {
      const requiredGiftCardOptions = ["shape", "amount", "title", "language"];

      const missingGiftCardOptions = requiredGiftCardOptions.filter(
        (optionName) => !selectedOptions[optionName],
      );

      if (missingGiftCardOptions.length > 0) {
        setCartError(
          language === "sv"
            ? "Välj form, belopp, titel och språk innan du lägger presentkortet i kundkorgen."
            : "Select shape, amount, title and language before adding the gift card to your cart.",
        );

        return;
      }
    }

    // Kontrollera egen titel för presentkort
    if (
      isGiftCard &&
      selectedOptions.title === "custom" &&
      !customTexts.custom_title?.trim()
    ) {
      setCartError(
        language === "sv"
          ? "Skriv en egen titel innan du lägger presentkortet i kundkorgen."
          : "Enter a custom title before adding the gift card to your cart.",
      );

      return;
    }

    // Kontrollera produktval
    if (requiresVariant && !selectedVariant) {
      const missingOptions =
        product.options
          ?.filter(
            (option) => selectedOptions[option.option_name] === undefined,
          )
          .map((option) =>
            language === "sv"
              ? option.display_name
              : option.display_name_en || option.display_name,
          ) ?? [];

      if (missingOptions.length > 0) {
        if (language === "sv") {
          setCartError(
            `Välj ${missingOptions
              .map((option) => option.toLowerCase())
              .join(" och ")} innan du lägger produkten i kundkorgen.`,
          );
        } else {
          setCartError(
            `Please select ${missingOptions
              .map((option) => option.toLowerCase())
              .join(" and ")} before adding the product to your cart.`,
          );
        }
      } else {
        setCartError(
          language === "sv"
            ? "Den valda kombinationen är inte tillgänglig."
            : "The selected combination is not available.",
        );
      }

      return;
    }

    // Kontrollera färger
    if (requiresColors && !backgroundColor && !printColor) {
      setCartError(
        language === "sv"
          ? "Välj bakgrundsfärg och tryckfärg innan du lägger produkten i kundkorgen."
          : "Select a background colour and print colour before adding the product to your cart.",
      );

      return;
    }

    if (requiresColors && !backgroundColor) {
      setCartError(
        language === "sv"
          ? "Välj en bakgrundsfärg innan du lägger produkten i kundkorgen."
          : "Select a background colour before adding the product to your cart.",
      );

      return;
    }

    if (requiresColors && !printColor) {
      setCartError(
        language === "sv"
          ? "Välj en tryckfärg innan du lägger produkten i kundkorgen."
          : "Select a print colour before adding the product to your cart.",
      );

      return;
    }

    addItem({
      product,
      quantity,

      variant_id: selectedVariant?.id,

      supplier_id: selectedVariant?.supplier_id ?? product.supplier_id,

      selected_background_color: isCustomEnamel
        ? (backgroundColor ?? undefined)
        : undefined,

      selected_print_color: isCustomEnamel
        ? (printColor ?? undefined)
        : undefined,

    selected_size:
  isCustomEnamel || product.id === "LFG.TRA"
    ? selectedOptions.size
    : undefined,

selected_shape:
  isCustomEnamel || product.id === "LFG.TRA"
    ? selectedOptions.shape
    : undefined,

custom_texts:
  isCustomEnamel || product.type === "gift_card" ? customTexts : {},

      

      custom_photo: isCustomEnamel
        ? customPhoto || undefined
        : product.id === "LFG.TRA"
          ? uploadFiles["engraving_image_0"]?.[0] || undefined
          : undefined,

      unit_price: displayedPrice,

      total_price: displayedPrice * quantity,

      selected_options:
        isCustomEnamel ||
        product.type === "gift_card" ||
        product.id === "LFG.TRA"
          ? selectedOptions
          : {},
    });

    setShowCartConfirmation(true);

    setTimeout(() => {
      setShowCartConfirmation(false);
    }, 2500);

    setSelectedOptions({});
    setBackgroundColor(null);
    setPrintColor(null);
    setCustomTexts({});
    setCustomPhoto(null);
    setUploadFiles({});
    setQuantity(1);
    setSelectedImage(0);
    setCartError("");
  };

  if (loading) {
    return (
      <div className="product-page">
        <p>{language === "sv" ? "Laddar produkt..." : "Loading product..."}</p>
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

  const isCustomEnamel = product.type === "EC";

  const requiresVariant = (product.variants?.length ?? 0) > 0;

  const allOptionsSelected =
  product.id === "LFG.TRA"
    ? Boolean(selectedOptions.shape && selectedOptions.size)
    : !isCustomEnamel ||
      (product.options?.every(
        (option) => selectedOptions[option.option_name] !== undefined,
      ) ?? true);

  return (
    <div className="product-page">
      {showCartConfirmation && (
        <div className="cart-confirmation">
          ✓{" "}
          {language === "sv"
            ? "Har lagts till i kundkorgen"
            : "Has been added to the cart"}
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <NavLink to="/produkter">
          {language === "sv" ? "Produkter" : "Products"}
        </NavLink>

        <span>—</span>
        <span>
          {language === "sv" ? product.name : product.name_en || product.name}
        </span>
      </nav>

      <div className="product-layout">
        {/* Vänster — bilder + beskrivning */}
        <div className="product-left">
          {/* Vänster — bilder + beskrivning */}
          <div className="product-main-img">
            {galleryImage || displayedImages[selectedImage] ? (
              <img
                src={`https://www.bymarcel.se${
                  galleryImage ?? displayedImages[selectedImage]
                }`}
                alt={
                  galleryDescription ||
                  (language === "sv"
                    ? product.name
                    : product.name_en || product.name)
                }
              />
            ) : (
              <div className="product-img-placeholder" />
            )}
          </div>

          {/* Beskrivning av vald galleribild */}
          {galleryDescription && (
            <p className="product-image-description">{galleryDescription}</p>
          )}

          {/* Produktgalleri */}
          {galleryImages.length > 1 && (
            <div className="product-thumbnails">
              {galleryImages.map((item, index) => (
                <button
                  type="button"
                  key={`${item.image}-${index}`}
                  className={`product-thumbnail ${
                    galleryImage === item.image ? "active" : ""
                  }`}
                  onClick={() => {
                    setGalleryImage(item.image);
                    setGalleryDescription(item.description);
                  }}
                  title={item.description}
                >
                  <img
                    src={`https://www.bymarcel.se${item.image}`}
                    alt={item.description}
                  />
                </button>
              ))}
            </div>
          )}

          <p className="product-description">
            {language === "sv"
              ? product.description
              : product.description_en || product.description}
          </p>
        </div>

        {/* Höger — info + val */}
        <div className="product-right">
          <div className="product-info">
            <h1 className="product-name">
              {language === "sv"
                ? product.name
                : product.name_en || product.name}
            </h1>

            <p className="product-technique">
              {language === "sv"
                ? product.material
                : product.material_en || product.material}
            </p>
          </div>

          {/* Pris */}
          <p className="product-price">{displayedPrice} SEK</p>

          {/* Dynamiska produktval */}
          {(isCustomEnamel ||
            product.type === "gift_card" ||
            product.id === "LFG.TRA") &&
            product.options?.map((option) => {
              const shouldHideOrientation =
                product.id === "LFG.TRA" &&
                option.option_name === "orientation" &&
                selectedOptions.shape !== "rectangle" &&
                selectedOptions.shape !== "oval";

              if (shouldHideOrientation) {
                return null;
              }
              const filteredValues =
                product.type === "gift_card"
                  ? option.values
                  : option.values.filter((value) =>
                      getAvailableOptionValues(option.option_name).has(
                        String(value.value),
                      ),
                    );

              return (
                <div className="product-option" key={option.id}>
                  <label>
                    {language === "sv"
                      ? option.display_name
                      : option.display_name_en || option.display_name}
                  </label>

                  <select
                    value={selectedOptions[option.option_name] ?? ""}
                    onChange={(event) =>
                      handleOptionChange(option.option_name, event.target.value)
                    }
                  >
                    <option value="" disabled>
                      {language === "sv"
                        ? `Välj ${option.display_name.toLowerCase()}`
                        : `Select ${(option.display_name_en || option.display_name).toLowerCase()}`}
                    </option>

                    {filteredValues.map((value) => (
                      <option key={value.value} value={value.value}>
                        {language === "sv"
                          ? value.display_value
                          : value.display_value_en || value.display_value}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}

          {/* Bilduppladdning */}
          {isCustomEnamel &&
            product.allows_custom_photo &&
            (!product.upload_fields || product.upload_fields.length === 0) && (
              <div className="product-option">
                <label>
                  {language === "sv" ? "Infoga bild" : "Upload image"}
                </label>

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

          {/* Dynamiska uppladdningsfält */}
          {(isCustomEnamel || product.id === "LFG.TRA") &&
            product.upload_fields?.map((field) => (
              <div className="product-option" key={field.id}>
                {Array.from({ length: field.max_files }).map((_, index) => {
                  const fileKey = `${field.field_name}_${index}`;

                  return (
                    <div className="product-upload-field" key={fileKey}>
                      <label>
                        {field.max_files > 1
                          ? `${
                              language === "sv"
                                ? field.display_name
                                : field.display_name_en || field.display_name
                            } ${index + 1}`
                          : language === "sv"
                            ? field.display_name
                            : field.display_name_en || field.display_name}
                      </label>

                      <label className="upload-btn">
                        <input
                          type="file"
                          accept={field.allowed_extensions
                            .split(",")
                            .map((extension) => `.${extension.trim()}`)
                            .join(",")}
                          onChange={(event) => {
                            const file = event.target.files?.[0];

                            setUploadFiles((previous) => ({
                              ...previous,
                              [fileKey]: file ? [file] : [],
                            }));
                          }}
                        />
                        📎
                      </label>

                      {uploadFiles[fileKey]?.[0] && (
                        <p className="upload-filename">
                          {uploadFiles[fileKey][0].name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

          {/* Egen text */}
          {(isCustomEnamel || product.type === "gift_card") &&
            product.allows_custom_text &&
            product.text_fields
              ?.filter(
                (field) =>
                  field.field_name !== "custom_title" ||
                  selectedOptions.title === "custom",
              )
              .map((field) => (
                <div className="product-option" key={field.id}>
                  <label>
                    {language === "sv"
                      ? field.display_name
                      : field.display_name_en || field.display_name}
                  </label>

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
                      placeholder={
                        language === "sv"
                          ? (field.placeholder ?? "")
                          : field.placeholder_en || field.placeholder || ""
                      }
                      rows={2}
                    />

                    <p className="gravyr-hint">
                      {language === "sv"
                        ? `Max ${field.max_length} tecken`
                        : `Max ${field.max_length} characters`}
                    </p>
                  </div>
                </div>
              ))}

          <div className="product-color-columns">
            {/* Bakgrundsfärg */}
            {isCustomEnamel && product.colors && product.colors.length > 0 && (
              <div className="product-option">
                <label>
                  {language === "sv" ? "Bakgrundsfärg" : "Background colour"}
                </label>

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
                            title={`${
                              language === "sv"
                                ? color.name
                                : color.name_en || color.name
                            } (${color.ral_code})`}
                          >
                            <span
                              className="color-swatch"
                              style={{
                                backgroundColor: color.hex,
                              }}
                            />

                            <span className="color-info">
                              <span className="color-name">
                                {language === "sv"
                                  ? color.name
                                  : color.name_en || color.name}
                              </span>

                              <span className="color-details">
                                {color.ral_code}

                                {color.background_price > 0 &&
                                  ` · +${color.background_price} SEK`}
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

            {/* Tryckfärg */}
            {isCustomEnamel && product.colors && product.colors.length > 0 && (
              <div className="product-option">
                <label>
                  {language === "sv"
                    ? "Tryckfärg (text och ram)"
                    : "Print colour (text and frame)"}
                </label>

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
                            title={`${
                              language === "sv"
                                ? color.name
                                : color.name_en || color.name
                            } (${color.ral_code})`}
                          >
                            <span
                              className="color-swatch"
                              style={{
                                backgroundColor: color.hex,
                              }}
                            />

                            <span className="color-info">
                              <span className="color-name">
                                {language === "sv"
                                  ? color.name
                                  : color.name_en || color.name}
                              </span>

                              <span className="color-details">
                                {color.ral_code}

                                {color.print_price > 0 &&
                                  ` · +${color.print_price} SEK`}
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
          {requiresVariant && allOptionsSelected && !selectedVariant && (
            <p className="variant-unavailable">
              {language === "sv"
                ? "Den valda kombinationen är inte tillgänglig."
                : "The selected combination is not available."}
            </p>
          )}

          {/* Antal */}
          <div className="product-option">
            <label>{language === "sv" ? "Antal" : "Quantity"}</label>

            {product.type === "gift_card" ? (
              <div className="quantity-row">
                <span className="quantity-value">1</span>
              </div>
            ) : (
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
            )}
          </div>

          {/* Felmeddelande */}
          {cartError && <div className="product-cart-error">{cartError}</div>}

          {/* Lägg i kundkorgen */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.is_out_of_stock}
          >
            {product.is_out_of_stock
              ? language === "sv"
                ? "Ej i lager"
                : "Out of stock"
              : language === "sv"
                ? "Lägg till i kundkorgen"
                : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
