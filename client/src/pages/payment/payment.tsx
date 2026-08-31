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

  // Tillåter bokstäver, svenska tecken, mellanslag,
  // bindestreck och apostrof.
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö' -]+$/;

  // Enkel kontroll av e-postformat.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Telefonnummer får innehålla siffror samt
  // +, mellanslag, bindestreck och parenteser.
  const phoneRegex = /^[0-9+\-()\s]+$/;

  // Ort och land får innehålla bokstäver,
  // mellanslag, bindestreck och apostrof.
  const locationRegex = /^[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö' -]+$/;

  const validateForm = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim();
    const trimmedZipCode = zipCode.trim();
    const trimmedCountry = country.trim();

    if (!trimmedFirstName) {
      return "Fyll i förnamn.";
    }

    if (!nameRegex.test(trimmedFirstName)) {
      return "Förnamnet får endast innehålla bokstäver.";
    }

    if (!trimmedLastName) {
      return "Fyll i efternamn.";
    }

    if (!nameRegex.test(trimmedLastName)) {
      return "Efternamnet får endast innehålla bokstäver.";
    }

    if (!trimmedEmail) {
      return "Fyll i e-postadress.";
    }

    if (!emailRegex.test(trimmedEmail)) {
      return "Ange en giltig e-postadress.";
    }

    if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
      return "Telefonnumret innehåller ogiltiga tecken.";
    }

    if (
      trimmedPhone &&
      trimmedPhone.replace(/\D/g, "").length < 7
    ) {
      return "Telefonnumret är för kort.";
    }

    if (!trimmedAddress) {
      return "Fyll i adress.";
    }

    if (!/[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö]/.test(trimmedAddress)) {
      return "Adressen måste innehålla ett gatunamn.";
    }

    if (!/\d/.test(trimmedAddress)) {
      return "Adressen måste innehålla ett gatunummer.";
    }

    if (!trimmedZipCode) {
      return "Fyll i postnummer.";
    }

    if (
      trimmedCountry.toLowerCase() === "sverige" &&
      !/^\d{3}\s?\d{2}$/.test(trimmedZipCode)
    ) {
      return "Svenskt postnummer ska innehålla 5 siffror.";
    }

    if (!trimmedCity) {
      return "Fyll i ort.";
    }

    if (!locationRegex.test(trimmedCity)) {
      return "Orten innehåller ogiltiga tecken.";
    }

    if (!trimmedCountry) {
      return "Fyll i land.";
    }

    if (!locationRegex.test(trimmedCountry)) {
      return "Landet innehåller ogiltiga tecken.";
    }

    return null;
  };

  const handleCreateOrder = async () => {
    if (items.length === 0) {
      setError("Kundkorgen är tom.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await createOrder(
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone_number: phoneNumber.trim() || undefined,
          address: address.trim(),
          city: city.trim(),
          zip_code: zipCode.trim(),
          country: country.trim(),
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
          <p>
            Fyll i dina uppgifter för att slutföra beställningen.
          </p>
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
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  autoComplete="given-name"
                />
              </div>

              <div className="payment-field">
                <label>Efternamn</label>

                <input
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  autoComplete="family-name"
                />
              </div>

              <div className="payment-field full-width">
                <label>E-post</label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                />
              </div>

              <div className="payment-field full-width">
                <label>Telefonnummer</label>

                <input
                  type="tel"
                  inputMode="tel"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(event.target.value)
                  }
                  autoComplete="tel"
                />
              </div>

              <div className="payment-field full-width">
                <label>Adress</label>

                <input
                  type="text"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  autoComplete="street-address"
                />
              </div>

              <div className="payment-field">
                <label>Postnummer</label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={zipCode}
                  onChange={(event) =>
                    setZipCode(event.target.value)
                  }
                  autoComplete="postal-code"
                />
              </div>

              <div className="payment-field">
                <label>Ort</label>

                <input
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  autoComplete="address-level2"
                />
              </div>

              <div className="payment-field full-width">
                <label>Land</label>

                <input
                  type="text"
                  value={country}
                  onChange={(event) =>
                    setCountry(event.target.value)
                  }
                  autoComplete="country-name"
                />
              </div>
            </div>
          </div>

          <div className="payment-summary">
            <h2>Orderöversikt</h2>

            <div className="payment-summary-row">
              <span>Delsumma</span>
              <span>{subtotal} SEK</span>
            </div>

            <div className="payment-summary-row">
              <span>Frakt</span>
              <span>{shipping} SEK</span>
            </div>

            <div className="payment-summary-row total">
              <span>Totalt</span>
              <span>{total} SEK</span>
            </div>

            {error && (
              <div className="payment-error">
                {error}
              </div>
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