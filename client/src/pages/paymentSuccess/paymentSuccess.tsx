import { useEffect, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("Session-ID saknas.");
      setLoading(false);
      return;
    }

    async function verifyPayment(id: string) {
      const maxAttempts = 5;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const response = await fetch(
            `https://www.bymarcel.se/Server/api/verify-payment.php?session_id=${encodeURIComponent(
              id
            )}`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error || "Kunde inte verifiera betalningen."
            );
          }

          if (data.verified) {
            clearCart();
            setVerified(true);
            setLoading(false);
            return;
          }

          if (attempt < maxAttempts) {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000)
            );
          }
        } catch (error) {
          if (attempt === maxAttempts) {
            if (error instanceof Error) {
              setError(error.message);
            } else {
              setError("Något gick fel vid verifieringen.");
            }

            setLoading(false);
            return;
          }

          await new Promise((resolve) =>
            setTimeout(resolve, 1000)
          );
        }
      }

      setError("Betalningen kunde inte bekräftas ännu.");
      setLoading(false);
    }

    verifyPayment(sessionId);
  }, [searchParams, clearCart]);

  if (loading) {
    return (
      <main>
        <h1>Kontrollerar betalningen...</h1>
        <p>Vänta ett ögonblick.</p>
      </main>
    );
  }

  if (!verified) {
    return (
      <main>
        <h1>Betalningen kunde inte bekräftas</h1>

        <p>{error}</p>

        <Link to="/payment">
          Tillbaka till betalningen
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Tack för din order!</h1>

      <p>Din betalning har genomförts.</p>

      <p>
        Vi har tagit emot din beställning och kommer att behandla
        den så snart som möjligt.
      </p>

      <Link to="/">
        Tillbaka till startsidan
      </Link>
    </main>
  );
}