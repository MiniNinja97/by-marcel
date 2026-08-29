import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { createOrder } from "../../api/orders";
import "./payment.css";

export default function Payment() {
  const navigate = useNavigate();

  const { items, getTotalPrice, clearCart } = useCartStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("Sverige");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 79 : 0;
  const total = subtotal + shipping;

  const handleCreateOrder = async () => {
    if (items.length === 0) {
      setError("Kundkorgen är tom");
      return;
    }

    if (!firstName || !lastName || !email) {
      setError("Fyll i förnamn, efternamn och e-post");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await createOrder(
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber || undefined,
          address: address || undefined,
          city: city || undefined,
          zip_code: zipCode || undefined,
          country: country || undefined,
        },
        items,
      );

      console.log("Order skapad:", result);

      clearCart();

      navigate("/");

    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Kunde inte skapa order",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="payment">
    <div className="payment-container">

      <div className="payment-header">
        <h1>Betalning</h1>
        <p>Fyll i dina uppgifter för att slutföra beställningen.</p>
      </div>

      <div className="payment-test-notice">
        Testläge — ingen betalning genomförs ännu.
      </div>

      <div className="payment-layout">

        <div className="payment-form">
          <h2>Kunduppgifter</h2>

          <div className="payment-form-grid">

            <div className="payment-field">
              <label>Förnamn</label>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>

            <div className="payment-field">
              <label>Efternamn</label>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>

            <div className="payment-field full-width">
              <label>E-post</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="payment-field full-width">
              <label>Telefonnummer</label>
              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
            </div>

            <div className="payment-field full-width">
              <label>Adress</label>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>

            <div className="payment-field">
              <label>Postnummer</label>
              <input
                value={zipCode}
                onChange={(event) => setZipCode(event.target.value)}
              />
            </div>

            <div className="payment-field">
              <label>Ort</label>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </div>

            <div className="payment-field full-width">
              <label>Land</label>
              <input
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              />
            </div>

          </div>
        </div>

        <div className="payment-summary">
          <h2>Orderöversikt</h2>

          <div className="payment-summary-row">
            <span>Delsumma</span>
            <span>{subtotal} kr</span>
          </div>

          <div className="payment-summary-row">
            <span>Frakt</span>
            <span>{shipping} kr</span>
          </div>

          <div className="payment-summary-row total">
            <span>Totalt</span>
            <span>{total} kr</span>
          </div>

          {error && (
            <p className="payment-error">{error}</p>
          )}

          <button
            className="payment-button"
            onClick={handleCreateOrder}
            disabled={loading}
          >
            {loading
              ? "Skapar order..."
              : "Skapa testorder"}
          </button>
        </div>

      </div>
    </div>
  </div>
);
}