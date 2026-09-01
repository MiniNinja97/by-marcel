import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { createOrder } from "../../api/orders";
import { useLanguage } from "../../context/languageContext";
import "./payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const { items, getTotalPrice, clearCart } = useCartStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState(
    language === "sv" ? "Sverige" : "Sweden",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 79 : 0;
  const total = subtotal + shipping;

  // Uppdatera standardlandet när kunden byter språk.
  useEffect(() => {
    setCountry((currentCountry) => {
      if (
        currentCountry === "Sverige" ||
        currentCountry === "Sweden"
      ) {
        return language === "sv" ? "Sverige" : "Sweden";
      }

      return currentCountry;
    });

    setError("");
  }, [language]);

  // Tillåter bokstäver, svenska tecken, mellanslag,
  // bindestreck och apostrof.
  const nameRegex =
    /^[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö' -]+$/;

  // Enkel kontroll av e-postformat.
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Telefonnummer får innehålla siffror samt
  // +, mellanslag, bindestreck och parenteser.
  const phoneRegex =
    /^[0-9+\-()\s]+$/;

  // Ort och land får innehålla bokstäver,
  // mellanslag, bindestreck och apostrof.
  const locationRegex =
    /^[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö' -]+$/;

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
      return language === "sv"
        ? "Fyll i förnamn."
        : "Enter your first name.";
    }

    if (!nameRegex.test(trimmedFirstName)) {
      return language === "sv"
        ? "Förnamnet får endast innehålla bokstäver."
        : "The first name may only contain letters.";
    }

    if (!trimmedLastName) {
      return language === "sv"
        ? "Fyll i efternamn."
        : "Enter your last name.";
    }

    if (!nameRegex.test(trimmedLastName)) {
      return language === "sv"
        ? "Efternamnet får endast innehålla bokstäver."
        : "The last name may only contain letters.";
    }

    if (!trimmedEmail) {
      return language === "sv"
        ? "Fyll i e-postadress."
        : "Enter your email address.";
    }

    if (!emailRegex.test(trimmedEmail)) {
      return language === "sv"
        ? "Ange en giltig e-postadress."
        : "Enter a valid email address.";
    }

    if (
      trimmedPhone &&
      !phoneRegex.test(trimmedPhone)
    ) {
      return language === "sv"
        ? "Telefonnumret innehåller ogiltiga tecken."
        : "The phone number contains invalid characters.";
    }

    if (
      trimmedPhone &&
      trimmedPhone.replace(/\D/g, "").length < 7
    ) {
      return language === "sv"
        ? "Telefonnumret är för kort."
        : "The phone number is too short.";
    }

    if (!trimmedAddress) {
      return language === "sv"
        ? "Fyll i adress."
        : "Enter your address.";
    }

    if (
      !/[A-Za-zÀ-ÖØ-öø-ÿÅÄÖåäö]/.test(
        trimmedAddress,
      )
    ) {
      return language === "sv"
        ? "Adressen måste innehålla ett gatunamn."
        : "The address must contain a street name.";
    }

    if (!/\d/.test(trimmedAddress)) {
      return language === "sv"
        ? "Adressen måste innehålla ett gatunummer."
        : "The address must contain a street number.";
    }

    if (!trimmedZipCode) {
      return language === "sv"
        ? "Fyll i postnummer."
        : "Enter your postal code.";
    }

    const isSweden =
      trimmedCountry.toLowerCase() === "sverige" ||
      trimmedCountry.toLowerCase() === "sweden";

    if (
      isSweden &&
      !/^\d{3}\s?\d{2}$/.test(trimmedZipCode)
    ) {
      return language === "sv"
        ? "Svenskt postnummer ska innehålla 5 siffror."
        : "Swedish postal codes must contain 5 digits.";
    }

    if (!trimmedCity) {
      return language === "sv"
        ? "Fyll i ort."
        : "Enter your city.";
    }

    if (!locationRegex.test(trimmedCity)) {
      return language === "sv"
        ? "Orten innehåller ogiltiga tecken."
        : "The city contains invalid characters.";
    }

    if (!trimmedCountry) {
      return language === "sv"
        ? "Fyll i land."
        : "Enter your country.";
    }

    if (!locationRegex.test(trimmedCountry)) {
      return language === "sv"
        ? "Landet innehåller ogiltiga tecken."
        : "The country contains invalid characters.";
    }

    return null;
  };

  const handleCreateOrder = async () => {
    if (items.length === 0) {
      setError(
        language === "sv"
          ? "Kundkorgen är tom."
          : "Your cart is empty.",
      );

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
          phone_number:
            phoneNumber.trim() || undefined,
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
          : language === "sv"
            ? "Kunde inte skapa order"
            : "Could not create order",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment">
      <div className="payment-container">
        <div className="payment-header">
          <h1>
            {language === "sv"
              ? "Betalning"
              : "Checkout"}
          </h1>

          <p>
            {language === "sv"
              ? "Fyll i dina uppgifter för att slutföra beställningen."
              : "Enter your details to complete your order."}
          </p>
        </div>

        <div className="payment-test-notice">
          {language === "sv"
            ? "Testläge — ingen betalning genomförs ännu."
            : "Test mode — no payment will be processed yet."}
        </div>

        <div className="payment-layout">
          <div className="payment-form">
            <h2>
              {language === "sv"
                ? "Kunduppgifter"
                : "Customer details"}
            </h2>

            <div className="payment-form-grid">
              <div className="payment-field">
                <label>
                  {language === "sv"
                    ? "Förnamn"
                    : "First name"}
                </label>

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
                <label>
                  {language === "sv"
                    ? "Efternamn"
                    : "Last name"}
                </label>

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
                <label>
                  {language === "sv"
                    ? "E-post"
                    : "Email"}
                </label>

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
                <label>
                  {language === "sv"
                    ? "Telefonnummer"
                    : "Phone number"}
                </label>

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
                <label>
                  {language === "sv"
                    ? "Adress"
                    : "Address"}
                </label>

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
                <label>
                  {language === "sv"
                    ? "Postnummer"
                    : "Postal code"}
                </label>

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
                <label>
                  {language === "sv"
                    ? "Ort"
                    : "City"}
                </label>

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
                <label>
                  {language === "sv"
                    ? "Land"
                    : "Country"}
                </label>

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
            <h2>
              {language === "sv"
                ? "Orderöversikt"
                : "Order summary"}
            </h2>

            <div className="payment-summary-row">
              <span>
                {language === "sv"
                  ? "Delsumma"
                  : "Subtotal"}
              </span>

              <span>{subtotal} SEK</span>
            </div>

            <div className="payment-summary-row">
              <span>
                {language === "sv"
                  ? "Frakt"
                  : "Shipping"}
              </span>

              <span>{shipping} SEK</span>
            </div>

            <div className="payment-summary-row total">
              <span>
                {language === "sv"
                  ? "Totalt"
                  : "Total"}
              </span>

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
                ? language === "sv"
                  ? "Skapar order..."
                  : "Creating order..."
                : language === "sv"
                  ? "Skapa testorder"
                  : "Create test order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}