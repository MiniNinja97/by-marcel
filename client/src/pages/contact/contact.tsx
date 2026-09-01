import { useLanguage } from "../../context/languageContext";
import "./contact.css";

export default function Contact() {
  const { language } = useLanguage();

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
            ? "Har du frågor om en produkt, vill göra en specialbeställning eller bara vill säga hej? Fyll i formuläret så återkommer vi så snart som möjligt."
            : "Do you have a question about a product, want to place a custom order or simply want to say hello? Fill in the form and we'll get back to you as soon as possible."}
        </p>
      </div>

      <div className="contact-layout">
        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label>
                {language === "sv"
                  ? "Förnamn"
                  : "First name"}
              </label>

              <input
                type="text"
                placeholder={
                  language === "sv"
                    ? "Anna"
                    : "Anna"
                }
              />
            </div>

            <div className="form-group">
              <label>
                {language === "sv"
                  ? "Efternamn"
                  : "Last name"}
              </label>

              <input
                type="text"
                placeholder={
                  language === "sv"
                    ? "Lindberg"
                    : "Lindberg"
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              {language === "sv"
                ? "E-post"
                : "Email"}
            </label>

            <input
              type="email"
              placeholder={
                language === "sv"
                  ? "anna@exempel.se"
                  : "anna@example.com"
              }
            />
          </div>

          <div className="form-group">
            <label>
              {language === "sv"
                ? "Ämne"
                : "Subject"}
            </label>

            <select defaultValue="">
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
            <label>
              {language === "sv"
                ? "Meddelande"
                : "Message"}
            </label>

            <textarea
              placeholder={
                language === "sv"
                  ? "Skriv ditt meddelande här..."
                  : "Write your message here..."
              }
            />
          </div>

          <button type="submit">
            {language === "sv"
              ? "Skicka meddelande"
              : "Send message"}
          </button>
        </form>

        <div className="contact-info">
          <div className="info-box">
            <p className="info-label">
              {language === "sv"
                ? "E-post"
                : "Email"}
            </p>

            <h4>hej@bymarcel.se</h4>

            <p className="info-sub">
              {language === "sv"
                ? "Vi återkommer så snart som möjligt"
                : "We'll get back to you as soon as possible"}
            </p>
          </div>

          <div className="info-box">
            <p className="info-label">
              Instagram
            </p>

            <h4>@bymarcel</h4>

            <p className="info-sub">
              {language === "sv"
                ? "Följ oss för nyheter och inspiration"
                : "Follow us for news and inspiration"}
            </p>
          </div>

          <div className="info-box">
            <p className="info-label">
              {language === "sv"
                ? "E-post"
                : "Email"}
            </p>

            <h4>contact@empost.com</h4>

            <p className="info-sub">
              {language === "sv"
                ? "Infotext"
                : "Information"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}