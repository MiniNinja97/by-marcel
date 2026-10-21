
import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/languageContext";
import "./grafiskdesign.css";

import BKGD1 from "./grafisk-img/BKGD-1.jpg";
import BKGD2 from "./grafisk-img/BKGD-2.jpg";
import BKGD3 from "./grafisk-img/BKGD-3.jpg";
import BKGD04 from "./grafisk-img/BKGD-04.jpg";
import BKGD05 from "./grafisk-img/BKGD-05.jpg";
import BKGD06 from "./grafisk-img/BKGD-06.jpg";
import BKGD10468 from "./grafisk-img/10468.jpg";
import BKGD10469 from "./grafisk-img/10469.jpg";

export default function GrafiskDesign() {
  const { language } = useLanguage();

  return (
    <div className="graphic-design">
      <section className="graphic-design-section">
        <h2>
          {language === "sv"
            ? "Grafisk design – Det extra som gör skillnaden!"
            : "Graphic design – The extra touch that makes the difference!"}
        </h2>

        <p>
          {language === "sv"
            ? "Det som verkligen skiljer By Marcel från många andra tillverkare är att professionell grafisk design, bildredigering, personlig rådgivning och korrektur ingår i våra produktpriser. Du betalar alltså inte bara för själva produkten och tillverkningen utan får också ta del av vår långa erfarenhet, kreativitet och känsla för detaljer."
            : "What truly sets By Marcel apart from many other manufacturers is that professional graphic design, photo editing, personal guidance and design proofs are included in our product prices. You're not just paying for the product and its manufacture – you also benefit from our extensive experience, creativity and attention to detail."}
        </p>

        <p>
          {language === "sv"
            ? "Vi nöjer oss inte med att bara tillverka det du skickar till oss. Vi hjälper dig att utveckla din idé, förbättra dina bilder och skapa en genomtänkt professionell design som lyfter fram det personliga i just din produkt. Det ingår i vår service utan extra kostnad att din produkt ska bli precis så speciell som du önskar."
            : "We don't simply manufacture what you send us. We help you develop your idea, improve your images and create a carefully considered, professional design that highlights what makes your product personal. All of this is included in our service at no extra cost, helping to make your product exactly as special as you want it to be."}
        </p>
      </section>

      {/* FRÅN DINA BILDER TILL VÅR DESIGN */}

      <section className="graphic-design-section">
        <h2>
          {language === "sv"
            ? "Från dina bilder till vår design"
            : "From your photos to our design"}
        </h2>

        <img
          src={BKGD1}
          alt={
            language === "sv"
              ? "Grafisk bearbetning av bilder"
              : "Graphic editing of images"
          }
          className="graphic-design-feature-image"
        />

        <p>
          {language === "sv"
            ? "Allt börjar med din idé. Du kan skicka ett fotografi, flera bilder, en enkel skiss eller bara beskriva vad du önskar skapa. Vi rekommenderar att du skickar bilder i JPG-format och med så hög upplösning som möjligt för bästa resultat. Behöver du skicka fler bilder eller mer information än vad som ryms i beställningen på hemsidan går det utmärkt att komplettera via e-post till info@bymarcel.se."
            : "Everything starts with your idea. You can send us a photograph, several images, a simple sketch or just describe what you'd like to create. For the best results, we recommend sending images in JPG format and at the highest possible resolution. If you need to send additional images or information that won't fit in your order on the website, you're welcome to send them separately by email to info@bymarcel.se."}
        </p>

        <h3>
          {language === "sv"
            ? "Vad kan vi hjälpa dig med?"
            : "What can we help you with?"}
        </h3>

        <p>
          {language === "sv"
            ? "Vår grafiska design ger många möjligheter att skapa något unikt."
            : "Our graphic design services offer many possibilities for creating something unique."}
        </p>

        <ul>
          <li>
            {language === "sv"
              ? "Kombinera personer, motiv eller detaljer från flera olika fotografier till en sammanhängande bild."
              : "Combine people, subjects or details from several photographs into one cohesive image."}
          </li>

          <li>
            {language === "sv"
              ? "Ta bort, byta ut eller anpassa bakgrunder och störande detaljer."
              : "Remove, replace or adjust backgrounds and distracting details."}
          </li>

          <li>
            {language === "sv"
              ? "Förbättra ljus, kontrast, skärpa och bildkvalitet."
              : "Improve lighting, contrast, sharpness and overall image quality."}
          </li>

          <li>
            {language === "sv"
              ? "I många fall lyckas vi med att restaurera äldre, blekta eller skadade fotografier."
              : "In many cases, we can restore old, faded or damaged photographs."}
          </li>

          <li>
            {language === "sv"
              ? "Anpassa bilder, illustrationer och logotyper till olika material och tillverkningstekniker."
              : "Adapt photographs, illustrations and logos for different materials and manufacturing techniques."}
          </li>

          <li>
            {language === "sv"
              ? "Lägga till personlig text, välja typsnitt och skapa en harmonisk helhet."
              : "Add personalised text, choose fonts and create a harmonious overall design."}
          </li>
        </ul>

        <div className="graphic-design-examples">
          <img
            src={BKGD2}
            alt={
              language === "sv"
                ? "Exempel på grafisk design"
                : "Example of graphic design"
            }
          />

          <img
            src={BKGD3}
            alt={
              language === "sv"
                ? "Grafisk design inför tillverkning"
                : "Graphic design before production"
            }
          />
        </div>
      </section>

      {/* KORREKTUR */}

      <section className="graphic-design-section">
        <h2>{language === "sv" ? "Korrektur!" : "Design proofs!"}</h2>

        <p>
          {language === "sv"
            ? "När vi har fått dina bilder och önskemål börjar vi arbeta med designen. Vi strävar efter att skicka ett första digitalt korrektur inom 24 timmar, men senast inom 3 arbetsdagar."
            : "Once we've received your images and requirements, we begin working on the design. We aim to send you the first digital proof within 24 hours, and no later than 3 working days."}
        </p>

        <p>
          {language === "sv"
            ? "Du får då möjlighet att komma med synpunkter eller ytterligare önskemål. Kanske vill du ändra en detalj, justera en bakgrund, lägga till text eller välja ett annat typsnitt."
            : "You'll then have the opportunity to provide feedback or request further changes. Perhaps you'd like to change a detail, adjust a background, add text or choose a different font."}
        </p>

        <p>
          {language === "sv"
            ? "Vi fortsätter att finjustera designen tillsammans med dig tills du är helt nöjd. Först när du har godkänt det slutliga korrekturet påbörjar vi tillverkningen."
            : "We'll continue refining the design together with you until you're completely satisfied. Production only begins once you've approved the final proof."}
        </p>

        <div className="graphic-design-proof-grid">
          <figure>
            <img
              src={BKGD04}
              alt={
                language === "sv"
                  ? "Originalfotografi"
                  : "Original photograph"
              }
            />
            <figcaption>
              {language === "sv" ? "Original" : "Original"}
            </figcaption>
          </figure>

          <figure>
            <img
              src={BKGD05}
              alt={
                language === "sv"
                  ? "Godkänt digitalt korrektur"
                  : "Approved digital proof"
              }
            />
            <figcaption>
              {language === "sv"
                ? "Godkänd korrektur"
                : "Approved proof"}
            </figcaption>
          </figure>

          <figure>
            <img
              src={BKGD06}
              alt={
                language === "sv"
                  ? "Färdig bildgravyr i MDF"
                  : "Finished photo engraving in MDF"
              }
            />
            <figcaption>
              {language === "sv"
                ? "Resultat i 12 mm vitlackerad MDF"
                : "Result in 12 mm white-painted MDF"}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* SAMMA DESIGN, OLIKA MATERIAL */}

      <section className="graphic-design-section">
        <h2>
          {language === "sv"
            ? "Samma design, olika material och uttryck"
            : "The same design, different materials and finishes"}
        </h2>

        <p>
          {language === "sv"
            ? "Det är viktigt att komma ihåg att ett digitalt korrektur visar designens utformning men att det färdiga resultatet också påverkas av materialet och tillverkningstekniken."
            : "It's important to remember that a digital proof shows the design, but the final result is also influenced by the material and manufacturing technique."}
        </p>

        <p>
          {language === "sv"
            ? "Ett fotografi som graveras på skiffer får exempelvis ett helt annat uttryck än om samma motiv görs på MDF. Naturlig plywood har sin egen färg och struktur medan gravyr på spegel, glas, dekorpanell, akryl, läder eller metall skapar andra effekter. Det är en del av charmen med våra produkter. Varje material har sin egen karaktär och ger designen ett unikt uttryck."
            : "For example, a photograph engraved on slate will have a completely different appearance from the same image engraved on MDF. Natural plywood has its own colour and texture, while engraving on mirrors, glass, decorative panels, acrylic, leather or metal creates different effects. That's part of the charm of our products. Every material has its own character and gives the design a unique appearance."}
        </p>

        <div className="graphic-design-material-images">
          <img
            src={BKGD10468}
            alt={
              language === "sv"
                ? "Personlig bildgravyr med fotografi som förlaga"
                : "Personalised photo engraving based on a photograph"
            }
          />

          <img
            src={BKGD10469}
            alt={
              language === "sv"
                ? "Bildgravyr i trä skapad från ett fotografi"
                : "Photo engraving on wood created from a photograph"
            }
          />
        </div>

        <p>
          {language === "sv"
            ? "Vill du veta mer om hur vi arbetar, vilka material vi använder och hur olika ytbehandlingar påverkar resultatet? Läs gärna mer under ”Bakom kulisserna” där vi berättar mer om våra material, tekniker och tillverkningsprocesser."
            : "Would you like to know more about how we work, which materials we use and how different surface treatments affect the result? Explore our 'Behind the Scenes' section, where we share more about our materials, techniques and manufacturing processes."}
        </p>
      </section>

      {/* INTEGRITET OCH KONTAKT */}

      <section className="graphic-design-section graphic-design-contact">
        <h2>
          {language === "sv"
            ? "Dina bilder och din integritet är viktiga för oss"
            : "Your photos and privacy matter to us"}
        </h2>

        <p>
          {language === "sv"
            ? "Vi är stolta över våra produkter och tycker naturligtvis att det är roligt att visa upp det vi skapar. Men vi respekterar alltid att dina bilder och personliga produkter tillhör din privata sfär. Vi publicerar aldrig dina personliga bilder eller produkter på vår hemsida, i sociala medier eller i annan marknadsföring utan ditt uttryckliga tillstånd. Mer information om hur vi hanterar personuppgifter, bilder och beställningar hittar du i vår integritetspolicy och våra köpvillkor."
            : "We're proud of our products and naturally enjoy showing what we create. However, we always respect that your photographs and personalised products are private. We never publish your personal images or products on our website, on social media or in any other marketing without your explicit permission. You can find more information about how we handle personal data, images and orders in our privacy policy and terms of purchase."}
        </p>

        <h2>
          {language === "sv"
            ? "Har du en idé? Vi hjälper dig gärna!"
            : "Have an idea? We'd love to help!"}
        </h2>

        <p>
          {language === "sv"
            ? "Ingen idé behöver vara färdig från början. Ibland räcker det med ett fotografi, en enkel skiss eller en tanke om något du skulle vilja skapa. Har du frågor, speciella önskemål eller synpunkter är du alltid välkommen att kontakta oss på info@bymarcel.se."
            : "Your idea doesn't need to be fully developed from the start. Sometimes all it takes is a photograph, a simple sketch or a thought about something you'd like to create. If you have any questions, special requests or feedback, you're always welcome to contact us at info@bymarcel.se."}
        </p>

        <div className="graphic-design-contact-links">
          <Link to="/integritetspolicy" className="graphic-design-link">
            {language === "sv"
              ? "Integritetspolicy"
              : "Privacy policy"}
          </Link>

          <Link to="/kopevillkor" className="graphic-design-link">
            {language === "sv"
              ? "Köpvillkor"
              : "Terms of purchase"}
          </Link>

          <Link to="/contact" className="graphic-design-link">
            {language === "sv" ? "Kontakta oss" : "Contact us"}
          </Link>

          <a href="mailto:info@bymarcel.se" className="graphic-design-link">
            {language === "sv" ? "Skicka e-post" : "Send an email"}
          </a>
        </div>
      </section>
    </div>
  );
}
