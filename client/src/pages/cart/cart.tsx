import { useCartStore } from "../../store/useCartStore";
import { NavLink } from "react-router-dom";
import "./cart.css";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 79 : 0;
  const moms = Math.round(subtotal * 0.25);
  const total = subtotal + shipping;

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
          {getTotalItems()} {getTotalItems() === 1 ? "produkt" : "produkter"}
        </p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.variant_id}-${item.selected_background_color?.id ?? ""}-${item.selected_print_color?.id ?? ""}-${JSON.stringify(item.custom_texts)}`}
              className="cart-item"
            >
              <div className="cart-item-img">
                {item.product.images[0] ? (
                  <img
                    src={`https://www.bymarcel.se${item.product.images[0]}`}
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
    Bakgrundsfärg: {item.selected_background_color.name} (
    {item.selected_background_color.ral_code})
  </p>
)}

{item.selected_print_color && (
  <p className="cart-item-text">
    Tryckfärg: {item.selected_print_color.name} (
    {item.selected_print_color.ral_code})
  </p>
)}

                {item.custom_texts &&
                  Object.entries(item.custom_texts).map(([fieldName, text]) => {
                    if (!text) return null;

                    const textField = item.product.text_fields?.find(
                      (field) => field.field_name === fieldName,
                    );

                    return (
                      <p className="cart-item-text" key={fieldName}>
                        {textField?.display_name ?? fieldName}: {text}
                      </p>
                    );
                  })}

                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      updateQuantity(item, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-item-right">
                <p className="cart-item-price">
                  {item.unit_price * item.quantity} kr
                </p>

                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item)}
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Orderöversikt</h2>

          <div className="cart-summary-rows">
            <div className="cart-summary-row">
              <span>Delsumma</span>
              <span>{subtotal} kr</span>
            </div>

            <div className="cart-summary-row">
              <span>Frakt</span>
              <span>{shipping} kr</span>
            </div>

            <div className="cart-summary-row">
              <span>Moms</span>
              <span>{moms} kr</span>
            </div>

            <div className="cart-summary-row total">
              <span>Totalt</span>
              <span>{total} kr</span>
            </div>
          </div>

          <NavLink to="/payment" className="cart-checkout-btn">
            Gå till betalning
          </NavLink>
        </div>
      </div>
    </div>
  );
}
