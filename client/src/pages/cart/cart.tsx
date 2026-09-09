import { useCartStore } from "../../store/useCartStore";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/languageContext";
import { getShipping } from "../../api/shipping";
import {
  validateDiscountCode,
  type ValidatedDiscount,
} from "../../api/discounts";
import "./cart.css";
import { useEffect, useState } from "react";

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    setDiscountCode: saveDiscountCode,
  } = useCartStore();

  const { language } = useLanguage();

  const [discountCode, setDiscountCode] = useState("");

  const [appliedDiscount, setAppliedDiscount] =
    useState<ValidatedDiscount | null>(null);

  const [discountError, setDiscountError] =
    useState("");

  const [isCheckingDiscount, setIsCheckingDiscount] =
    useState(false);

  const [shipping, setShipping] =
    useState<number | null>(null);

  const [shippingLoading, setShippingLoading] =
    useState(false);

  const subtotal = getTotalPrice();

  // Priserna i butiken är inklusive 25 % moms.
  // Momsdelen av ett pris inklusive 25 % moms är 20 % av priset.
  const moms = Math.round(subtotal * 0.2);

  const discountAmount =
    appliedDiscount?.amount ?? 0;

  const total =
    subtotal -
    discountAmount +
    (shipping ?? 0);

  const formatPrice = (price: number) => {
    const locale =
      language === "sv" ? "sv-SE" : "en-GB";

    return `${new Intl.NumberFormat(locale).format(
      price,
    )} SEK`;
  };

  // -----------------------------------------
  // Hämta frakt från backend
  // -----------------------------------------

  useEffect(() => {
    if (items.length === 0) {
      setShipping(null);
      return;
    }

    const loadShipping = async () => {
      try {
        setShippingLoading(true);

        const result = await getShipping(
          "SE",
          items.map((item) => ({
            product_id: item.product.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
        );

        setShipping(result.shipping);
      } catch (error) {
        console.error(error);
        setShipping(null);
      } finally {
        setShippingLoading(false);
      }
    };

    loadShipping();
  }, [items]);

  // -----------------------------------------
  // Lägg till rabattkod
  // -----------------------------------------

  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError(
        language === "sv"
          ? "Ange en rabattkod."
          : "Enter a discount code.",
      );

      return;
    }

    try {
      setIsCheckingDiscount(true);
      setDiscountError("");

      const discount =
        await validateDiscountCode(
          discountCode,
          subtotal,
        );

      setDiscountCode(discount.code);
      saveDiscountCode(discount.code);

      setAppliedDiscount(discount);
    } catch (error) {
      setAppliedDiscount(null);

      setDiscountError(
        error instanceof Error
          ? error.message
          : language === "sv"
            ? "Rabattkoden är inte giltig."
            : "The discount code is not valid.",
      );
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  // -----------------------------------------
  // Ta bort rabattkod
  // -----------------------------------------

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
    saveDiscountCode(null);
  };

  // -----------------------------------------
  // Kontrollera rabatt igen om summan ändras
  // -----------------------------------------

  useEffect(() => {
    if (!appliedDiscount) return;

    const revalidateDiscount = async () => {
      try {
        const discount =
          await validateDiscountCode(
            appliedDiscount.code,
            subtotal,
          );

        setAppliedDiscount(discount);
        setDiscountError("");
      } catch (error) {
        setAppliedDiscount(null);

        setDiscountError(
          error instanceof Error
            ? error.message
            : language === "sv"
              ? "Rabattkoden är inte längre giltig."
              : "The discount code is no longer valid.",
        );
      }
    };

    revalidateDiscount();
  }, [subtotal]);

  // -----------------------------------------
  // Tom kundkorg
  // -----------------------------------------

  if (items.length === 0) {
    return (
      <div className="cart">
        <div className="cart-empty">
          <h1>
            {language === "sv"
              ? "Din korg"
              : "Your cart"}
          </h1>

          <p>
            {language === "sv"
              ? "Din korg är tom"
              : "Your cart is empty"}
          </p>

          <NavLink
            to="/produkter"
            className="cart-empty-btn"
          >
            {language === "sv"
              ? "Utforska sortimentet"
              : "Explore our products"}
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h1>
          {language === "sv"
            ? "Din Korg"
            : "Your Cart"}
        </h1>

        <p>
          {getTotalItems()}{" "}
          {language === "sv"
            ? getTotalItems() === 1
              ? "produkt"
              : "produkter"
            : getTotalItems() === 1
              ? "product"
              : "products"}
        </p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const selectedVariant =
              item.product.variants?.find(
                (variant) =>
                  variant.id === item.variant_id,
              );

            const cartImage =
              selectedVariant?.images?.[0] ??
              item.product.images[0];

            return (
              <div
                key={`${item.product.id}-${item.variant_id}-${item.selected_background_color?.id ?? ""}-${item.selected_print_color?.id ?? ""}-${JSON.stringify(item.custom_texts)}`}
                className="cart-item"
              >
                <div className="cart-item-img">
                  {cartImage ? (
                    <img
                      src={`https://www.bymarcel.se${cartImage}`}
                      alt={item.product.name}
                    />
                  ) : (
                    <div className="cart-item-img-placeholder" />
                  )}
                </div>

                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>

                  <p className="cart-item-specs">
                    {[
                      item.selected_size,
                      item.selected_shape,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  {item.selected_background_color && (
                    <p className="cart-item-text">
                      {language === "sv"
                        ? "Bakgrundsfärg"
                        : "Background colour"}
                      :{" "}
                      {
                        item
                          .selected_background_color
                          .name
                      }{" "}
                      (
                      {
                        item
                          .selected_background_color
                          .ral_code
                      }
                      )
                    </p>
                  )}

                  {item.selected_print_color && (
                    <p className="cart-item-text">
                      {language === "sv"
                        ? "Tryckfärg"
                        : "Print colour"}
                      :{" "}
                      {
                        item.selected_print_color
                          .name
                      }{" "}
                      (
                      {
                        item.selected_print_color
                          .ral_code
                      }
                      )
                    </p>
                  )}

                  {item.custom_texts &&
                    Object.entries(
                      item.custom_texts,
                    ).map(
                      ([fieldName, text]) => {
                        if (!text) return null;

                        const textField =
                          item.product.text_fields?.find(
                            (field) =>
                              field.field_name ===
                              fieldName,
                          );

                        return (
                          <p
                            className="cart-item-text"
                            key={fieldName}
                          >
                            {textField?.display_name ??
                              fieldName}
                            : {text}
                          </p>
                        );
                      },
                    )}

                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() =>
                        updateQuantity(
                          item,
                          Math.max(
                            1,
                            item.quantity - 1,
                          ),
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="quantity-btn"
                      onClick={() =>
                        updateQuantity(
                          item,
                          item.quantity + 1,
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-right">
                  <p className="cart-item-price">
                    {formatPrice(
                      item.unit_price *
                        item.quantity,
                    )}
                  </p>

                  <button
                    className="cart-item-remove"
                    onClick={() =>
                      removeItem(item)
                    }
                  >
                    {language === "sv"
                      ? "Ta bort"
                      : "Remove"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>
            {language === "sv"
              ? "Orderöversikt"
              : "Order summary"}
          </h2>

          <div className="cart-summary-rows">
            <div className="cart-summary-row">
              <span>
                {language === "sv"
                  ? "Delsumma"
                  : "Subtotal"}
              </span>

              <span>
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="cart-discount">
              <label htmlFor="discount-code">
                {language === "sv"
                  ? "Rabattkod"
                  : "Discount code"}
              </label>

              <div className="cart-discount-input">
                <input
                  id="discount-code"
                  type="text"
                  value={discountCode}
                  onChange={(event) =>
                    setDiscountCode(
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder={
                    language === "sv"
                      ? "Ange rabattkod"
                      : "Enter discount code"
                  }
                  disabled={
                    appliedDiscount !== null
                  }
                />

                {appliedDiscount ? (
                  <button
                    type="button"
                    onClick={removeDiscount}
                  >
                    {language === "sv"
                      ? "Ta bort"
                      : "Remove"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={applyDiscount}
                    disabled={
                      isCheckingDiscount
                    }
                  >
                    {isCheckingDiscount
                      ? language === "sv"
                        ? "Kontrollerar..."
                        : "Checking..."
                      : language === "sv"
                        ? "Använd"
                        : "Apply"}
                  </button>
                )}
              </div>

              {discountError && (
                <p className="cart-discount-error">
                  {discountError}
                </p>
              )}

              {appliedDiscount && (
                <p className="cart-discount-success">
                  {language === "sv"
                    ? `Rabattkoden ${appliedDiscount.code} har lagts till.`
                    : `Discount code ${appliedDiscount.code} has been applied.`}
                </p>
              )}
            </div>

            {appliedDiscount && (
              <div className="cart-summary-row">
                <span>
                  {language === "sv"
                    ? `Rabatt (${appliedDiscount.code})`
                    : `Discount (${appliedDiscount.code})`}
                </span>

                <span>
                  -{formatPrice(discountAmount)}
                </span>
              </div>
            )}

            <div className="cart-summary-row">
              <span>
                {language === "sv"
                  ? "Frakt"
                  : "Shipping"}
              </span>

              <span>
                {shippingLoading
                  ? language === "sv"
                    ? "Beräknar..."
                    : "Calculating..."
                  : shipping !== null
                    ? formatPrice(shipping)
                    : "-"}
              </span>
            </div>

            <div className="cart-summary-row">
              <span>
                {language === "sv"
                  ? "Moms (25 %)"
                  : "VAT (25%)"}
              </span>

              <span>{formatPrice(moms)}</span>
            </div>

            <div className="cart-summary-row total">
              <span>
                {language === "sv"
                  ? "Totalt"
                  : "Total"}
              </span>

              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <NavLink
            to="/payment"
            className="cart-checkout-btn"
          >
            {language === "sv"
              ? "Gå till betalning"
              : "Proceed to checkout"}
          </NavLink>
        </div>
      </div>
    </div>
  );
}