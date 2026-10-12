import { Link } from "react-router-dom";
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
  return (
    <div className="graphic-design">
      <section className="graphic-design-section">
        <h2>Grafisk design – Det extra som gör skillnaden!</h2>

        <p>
          Det som verkligen skiljer By Marcel från många andra tillverkare är
          att professionell grafisk design, bildredigering, personlig rådgivning
          och korrektur ingår i våra produktpriser. Du betalar alltså inte bara
          för själva produkten och tillverkningen utan får också ta del av vår
          långa erfarenhet, kreativitet och känsla för detaljer.
        </p>

        <p>
          Vi nöjer oss inte med att bara tillverka det du skickar till oss. Vi
          hjälper dig att utveckla din idé, förbättra dina bilder och skapa en
          genomtänkt professionell design som lyfter fram det personliga i just
          din produkt. Det ingår i vår service utan extra kostnad att din
          produkt ska bli precis så speciell som du önskar.
        </p>
      </section>

      {/* FRÅN DINA BILDER TILL VÅR DESIGN */}
      <section className="graphic-design-section">
        <h2>Från dina bilder till vår design</h2>

        <img
          src={BKGD1}
          alt="Grafisk bearbetning av bilder"
          className="graphic-design-feature-image"
        />

        <p>
          Allt börjar med din idé. Du kan skicka ett fotografi, flera bilder, en
          enkel skiss eller bara beskriva vad du önskar skapa. Vi rekommenderar
          att du skickar bilder i JPG-format och med så hög upplösning som
          möjligt för bästa resultat. Behöver du skicka fler bilder eller mer
          information än vad som ryms i beställningen på hemsidan går det
          utmärkt att komplettera via e-post till info@bymarcel.se.
        </p>

        <h3>Vad kan vi hjälpa dig med?</h3>

        <p>Vår grafiska design ger många möjligheter att skapa något unikt.</p>

        <ul>
          <li>
            Kombinera personer, motiv eller detaljer från flera olika
            fotografier till en sammanhängande bild.
          </li>
          <li>
            Ta bort, byta ut eller anpassa bakgrunder och störande detaljer.
          </li>
          <li>Förbättra ljus, kontrast, skärpa och bildkvalitet.</li>
          <li>
            I många fall lyckas vi med att restaurera äldre, blekta eller
            skadade fotografier.
          </li>
          <li>
            Anpassa bilder, illustrationer och logotyper till olika material och
            tillverkningstekniker.
          </li>
          <li>
            Lägga till personlig text, välja typsnitt och skapa en harmonisk
            helhet.
          </li>
        </ul>

        <div className="graphic-design-examples">
          <img src={BKGD2} alt="Exempel på grafisk design" />
          <img src={BKGD3} alt="Grafisk design inför tillverkning" />
        </div>
      </section>

      {/* KORREKTUR */}
      <section className="graphic-design-section">
        <h2>Korrektur!</h2>

        <p>
          När vi har fått dina bilder och önskemål börjar vi arbeta med
          designen. Vi strävar efter att skicka ett första digitalt korrektur
          inom 24 timmar, men senast inom 3 arbetsdagar.
        </p>

        <p>
          Du får då möjlighet att komma med synpunkter eller ytterligare
          önskemål. Kanske vill du ändra en detalj, justera en bakgrund, lägga
          till text eller välja ett annat typsnitt.
        </p>

        <p>
          Vi fortsätter att finjustera designen tillsammans med dig tills du är
          helt nöjd. Först när du har godkänt det slutliga korrekturet påbörjar
          vi tillverkningen.
        </p>

        <div className="graphic-design-proof-grid">
          <figure>
            <img src={BKGD04} alt="Originalfotografi" />
            <figcaption>Original</figcaption>
          </figure>

          <figure>
            <img src={BKGD05} alt="Godkänt digitalt korrektur" />
            <figcaption>Godkänd korrektur</figcaption>
          </figure>

          <figure>
            <img src={BKGD06} alt="Färdig bildgravyr i MDF" />
            <figcaption>Resultat i 12 mm vitlackerad MDF</figcaption>
          </figure>
        </div>
      </section>

      {/* SAMMA DESIGN, OLIKA MATERIAL */}
      <section className="graphic-design-section">
        <h2>Samma design, olika material och uttryck</h2>

        <p>
          Det är viktigt att komma ihåg att ett digitalt korrektur visar
          designens utformning men att det färdiga resultatet också påverkas av
          materialet och tillverkningstekniken.
        </p>

        <p>
          Ett fotografi som graveras på skiffer får exempelvis ett helt annat
          uttryck än om samma motiv görs på MDF. Naturlig plywood har sin egen
          färg och struktur medan gravyr på spegel, glas, dekorpanell, akryl,
          läder eller metall skapar andra effekter. Det är en del av charmen med
          våra produkter. Varje material har sin egen karaktär och ger designen
          ett unikt uttryck.
        </p>

        <div className="graphic-design-material-images">
          <img
            src={BKGD10468}
            alt="Personlig bildgravyr med fotografi som förlaga"
          />

          <img
            src={BKGD10469}
            alt="Bildgravyr i trä skapad från ett fotografi"
          />
        </div>

        <p>
          Vill du veta mer om hur vi arbetar, vilka material vi använder och hur
          olika ytbehandlingar påverkar resultatet? Läs gärna mer under ”Bakom
          kulisserna” där vi berättar mer om våra material, tekniker och
          tillverkningsprocesser.
        </p>
      </section>

      {/* INTEGRITET OCH KONTAKT */}
      <section className="graphic-design-section graphic-design-contact">
        <h2>Dina bilder och din integritet är viktiga för oss</h2>

        <p>
          Vi är stolta över våra produkter och tycker naturligtvis att det är
          roligt att visa upp det vi skapar. Men vi respekterar alltid att dina
          bilder och personliga produkter tillhör din privata sfär. Vi
          publicerar aldrig dina personliga bilder eller produkter på vår
          hemsida, i sociala medier eller i annan marknadsföring utan ditt
          uttryckliga tillstånd. Mer information om hur vi hanterar
          personuppgifter, bilder och beställningar hittar du i vår
          integritetspolicy och våra köpvillkor.
        </p>

        <h2>Har du en idé? Vi hjälper dig gärna!</h2>

        <p>
          Ingen idé behöver vara färdig från början. Ibland räcker det med ett
          fotografi, en enkel skiss eller en tanke om något du skulle vilja
          skapa. Har du frågor, speciella önskemål eller synpunkter är du alltid
          välkommen att kontakta oss på info@bymarcel.se.
        </p>

        <div className="graphic-design-contact-links">
          <Link to="/integritetspolicy" className="graphic-design-link">
            Integritetspolicy
          </Link>

          <Link to="/kopevillkor" className="graphic-design-link">
            Köpvillkor
          </Link>

          <Link to="/contact" className="graphic-design-link">
            Kontakta oss
          </Link>

          <a href="mailto:info@bymarcel.se" className="graphic-design-link">
            Skicka e-post
          </a>
        </div>
      </section>
    </div>
  );
}
