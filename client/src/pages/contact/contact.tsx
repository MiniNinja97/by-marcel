import { useState } from "react";
import { useLanguage } from "../../context/languageContext";
import "./contact.css";

export default function Contact() {
  const { language } = useLanguage();

  const [isSending, setIsSending] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSending(true);
    setMessageStatus("");

    try {
      const response = await fetch("/api/contact.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Could not send message");
      }

      setMessageStatus(
        language === "sv"
          ? "Tack! Ditt meddelande har skickats."
          : "Thank you! Your message has been sent."
      );

      form.reset();
    } catch {
      setMessageStatus(
        language === "sv"
          ? "Något gick fel. Försök igen eller kontakta oss via e-post."
          : "Something went wrong. Please try again or contact us by email."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="contact">
      <div className="contact-intro">
        <h2>
          {language === "sv"
            ? "Kontakt"
            : "Contact"}
        </h2>

        <p>
          {language === "sv"
            ? "Har du frågor om en produkt, frakt eller något annat? Fyll i formuläret så återkommer vi så snart som möjligt."
            : "Do you have a question about a product, want to place a custom order, shippment or any other inquiry? Fill in the form and we'll get back to you as soon as possible."}
        </p>
      </div>

      <div className="contact-layout">
        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                {language === "sv"
                  ? "Förnamn"
                  : "First name"}
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Anna"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                {language === "sv"
                  ? "Efternamn"
                  : "Last name"}
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Lindberg"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              {language === "sv"
                ? "E-post"
                : "Email"}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder={
                language === "sv"
                  ? "anna@exempel.se"
                  : "anna@example.com"
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">
              {language === "sv"
                ? "Ämne"
                : "Subject"}
            </label>

            <select
              id="subject"
              name="subject"
              defaultValue=""
              required
            >
              <option value="" disabled>
                {language === "sv"
                  ? "Välj ämne"
                  : "Select a subject"}
              </option>

              <option value="product">
                {language === "sv"
                  ? "Fråga om produkt"
                  : "Product question"}
              </option>

              <option value="custom-order">
                {language === "sv"
                  ? "Specialbeställning"
                  : "Custom order"}
              </option>

              <option value="order-delivery">
                {language === "sv"
                  ? "Order & leverans"
                  : "Order & delivery"}
              </option>

              <option value="other">
                {language === "sv"
                  ? "Övrigt"
                  : "Other"}
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">
              {language === "sv"
                ? "Meddelande"
                : "Message"}
            </label>

            <textarea
              id="message"
              name="message"
              placeholder={
                language === "sv"
                  ? "Skriv ditt meddelande här..."
                  : "Write your message here..."
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
          >
            {isSending
              ? language === "sv"
                ? "Skickar..."
                : "Sending..."
              : language === "sv"
                ? "Skicka meddelande"
                : "Send message"}
          </button>

          {messageStatus && (
            <p className="contact-form-status">
              {messageStatus}
            </p>
          )}
        </form>

        <div className="contact-info">

          <div className="info-box">
            <p className="info-label">
              {language === "sv"
                ? "E-post"
                : "Email"}
            </p>

            <a
              className="info-link"
              href="mailto:info@bymarcel.se"
            >
              info@bymarcel.se
            </a>

            <p className="info-sub">
              {language === "sv"
                ? "Har du frågor om produkter eller din beställning? Kontakta oss gärna. Denna mail är kopplad till formuläret!"
                : "Do you have questions about products or your order? Feel free to contact us. This email is linked to the contact form!"}
            </p>
          </div>


          <div className="info-box">
            <p className="info-label">
              Instagram
            </p>

            <a
              className="info-link info-instagram"
              href="https://www.instagram.com/bymarcel_sweden/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="contact-instagram-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />

                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  className="contact-instagram-dot"
                />
              </svg>

              @bymarcel_sweden
            </a>

            <p className="info-sub">
              {language === "sv"
                ? "Följ oss för nyheter och inspiration."
                : "Follow us for news and inspiration."}
            </p>
          </div>


          <div className="info-box">
            <p className="info-label">
              {language === "sv"
                ? "Webbplats"
                : "Website"}
            </p>

            <a
              className="info-link"
              href="mailto:emma.malinsdotter@outlook.com"
            >
              emma.malinsdotter@outlook.com
            </a>

            <p className="info-sub">
              {language === "sv"
                ? "För frågor om hemsidan eller är du sugen på en egen hemsida? Kontakta mig!"
                : "For questions about the website or if you're interested in a custom website, contact me!"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}