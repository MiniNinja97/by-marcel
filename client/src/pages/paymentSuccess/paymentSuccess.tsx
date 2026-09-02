import { Link } from "react-router-dom";

export default function PaymentSuccess() {
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