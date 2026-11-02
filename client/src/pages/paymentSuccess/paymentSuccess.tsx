

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { useLanguage } from "../../context/languageContext";

import "./payment_success.css";

export default function PaymentSuccess() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("order_id");

    // -----------------------------------------
    // Order helt betald med presentkort
    // -----------------------------------------

    if (!sessionId && orderId) {
      clearCart();
      setVerified(true);
      setLoading(false);
      return;
    }

    // -----------------------------------------
    // Vanlig Stripe-betalning
    // -----------------------------------------

    if (!sessionId) {
      setError("missing_payment_info");
      setLoading(false);
      return;
    }

    async function verifyPayment(id: string) {
      const maxAttempts = 5;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const response = await fetch(
            `https://www.bymarcel.se/Server/api/verify-payment.php?session_id=${encodeURIComponent(
              id,
            )}`,
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error("verification_failed");
          }

          if (data.verified) {
            clearCart();
            setVerified(true);
            setLoading(false);
            return;
          }

          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch {
          if (attempt === maxAttempts) {
            setError("verification_error");
            setLoading(false);
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      setError("payment_not_confirmed");
      setLoading(false);
    }

    verifyPayment(sessionId);
  }, [searchParams, clearCart]);

  // -----------------------------------------
  // Översätt felmeddelanden
  // -----------------------------------------

  const errorMessages: Record<string, { sv: string; en: string }> = {
    missing_payment_info: {
      sv: "Betalningsinformation saknas.",
      en: "Payment information is missing.",
    },
    verification_failed: {
      sv: "Kunde inte verifiera betalningen.",
      en: "Could not verify the payment.",
    },
    verification_error: {
      sv: "Något gick fel vid verifieringen.",
      en: "Something went wrong during payment verification.",
    },
    payment_not_confirmed: {
      sv: "Betalningen kunde inte bekräftas ännu.",
      en: "The payment could not be confirmed yet.",
    },
  };

  // -----------------------------------------
  // Laddning
  // -----------------------------------------

  if (loading) {
    return (
      <main className="payment-success">
        <div className="payment-success__content">
          <h1>
            {language === "sv"
              ? "Kontrollerar betalningen..."
              : "Verifying your payment..."}
          </h1>

          <p>
            {language === "sv"
              ? "Vänta ett ögonblick."
              : "Please wait a moment."}
          </p>
        </div>
      </main>
    );
  }

  // -----------------------------------------
  // Betalningen kunde inte bekräftas
  // -----------------------------------------

  if (!verified) {
    return (
      <main className="payment-success">
        <div className="payment-success__content">
          <h1>
            {language === "sv"
              ? "Betalningen kunde inte bekräftas"
              : "Payment could not be confirmed"}
          </h1>

          <p>
            {errorMessages[error]?.[language] ||
              (language === "sv"
                ? "Ett oväntat fel uppstod."
                : "An unexpected error occurred.")}
          </p>

          <Link to="/payment" className="payment-success__button">
            {language === "sv"
              ? "Tillbaka till betalningen"
              : "Back to payment"}
          </Link>
        </div>
      </main>
    );
  }

  // -----------------------------------------
  // Betalningen genomförd
  // -----------------------------------------

  return (
    <main className="payment-success">
      <div className="payment-success__content">
        <h1>
          {language === "sv"
            ? "Tack för din order!"
            : "Thank you for your order!"}
        </h1>

        <p>
          {language === "sv"
            ? "Din betalning har genomförts."
            : "Your payment was successful."}
        </p>

        <p>
          {language === "sv"
            ? "Vi har tagit emot din beställning och kommer att behandla den så snart som möjligt."
            : "We have received your order and will process it as soon as possible."}
        </p>

        <Link to="/" className="payment-success__button">
          {language === "sv"
            ? "Tillbaka till startsidan"
            : "Back to homepage"}
        </Link>
      </div>
    </main>
  );
}
