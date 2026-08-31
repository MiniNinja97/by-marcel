import { useCartStore } from "../../store/useCartStore";
import { NavLink } from "react-router-dom";
import "./cart.css";

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const subtotal = getTotalPrice();

  const shipping = subtotal > 0 ? 79 : 0;

  // Priserna i butiken är inklusive 25 % moms.
  // Momsdelen av ett pris inklusive 25 % moms är 20 % av priset.
  const moms = Math.round(subtotal * 0.2);

  const total = subtotal + shipping;

  const formatPrice = (price: number) => {
    return `${new Intl.NumberFormat("sv-SE").format(price)} SEK`;
  };

  if (items.length === 0) {
    return (
      <div className="cart">
        <div className="cart-empty">
          <h1>Din korg</h1>

          <p>Din korg är tom</p>

          <NavLink to="/produkter" className="cart-empty-btn">
            Utforska sortimentet
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h1>Din Korg</h1>

        <p>
          {getTotalItems()}{" "}
          {getTotalItems() === 1 ? "produkt" : "produkter"}
        </p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const selectedVariant = item.product.variants?.find(
              (variant) => variant.id === item.variant_id,
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
                    {[item.selected_size, item.selected_shape]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  {item.selected_background_color && (
                    <p className="cart-item-text">
                      Bakgrundsfärg:{" "}
                      {item.selected_background_color.name} (
                      {item.selected_background_color.ral_code})
                    </p>
                  )}

                  {item.selected_print_color && (
                    <p className="cart-item-text">
                      Tryckfärg:{" "}
                      {item.selected_print_color.name} (
                      {item.selected_print_color.ral_code})
                    </p>
                  )}

                  {item.custom_texts &&
                    Object.entries(item.custom_texts).map(
                      ([fieldName, text]) => {
                        if (!text) return null;

                        const textField =
                          item.product.text_fields?.find(
                            (field) =>
                              field.field_name === fieldName,
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
                      item.unit_price * item.quantity,
                    )}
                  </p>

                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item)}
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2>Orderöversikt</h2>

          <div className="cart-summary-rows">
            <div className="cart-summary-row">
              <span>Delsumma</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="cart-summary-row">
              <span>Frakt</span>
              <span>{formatPrice(shipping)}</span>
            </div>

            <div className="cart-summary-row">
              <span>Moms (25 %)</span>
              <span>{formatPrice(moms)}</span>
            </div>

            <div className="cart-summary-row total">
              <span>Totalt</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <NavLink
            to="/payment"
            className="cart-checkout-btn"
          >
            Gå till betalning
          </NavLink>
        </div>
      </div>
    </div>
  );
}