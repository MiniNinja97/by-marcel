import { Link } from "react-router-dom";
import "./enamelInfo.css";

import bildgravyr1 from "./boxes-img/bildgravyr1.jpeg";
import bildgravyr5 from "./boxes-img/bildgravyr5.jpeg";
import bildgravyr3 from "./boxes-img/bildgravyr3.jpeg";
import brudpar from "./boxes-img/brudpar.jpg";
import bildgravyr4 from "./boxes-img/bildgravyr4.jpeg";
import bildgravyr2 from "./boxes-img/bildgravyr2.jpeg";

export default function PhotoEngraving() {
  return (
    <div className="enamel-info">
      <h1 className="enamel-title">BILDGRAVYR</h1>

      {/* TEXT VÄNSTER / BILD HÖGER */}
      <section className="enamel-row">
        <div className="enamel-text">
          <h2>Personlig bildgravyr i trä</h2>
          <h3>En personlig produkt, skapad från dina bilder</h3>

          <p>
            Gör dina egna favoritbilder till en personlig och unik tavla. Hos By
            Marcel skapar vi produkter som passar livets viktigaste stunder
            familjen, barnen, bröllop, dop, student, minnesgåvor eller en fin
            bild på ett älskat husdjur med eller utan text till.
          </p>

          <p>
            Det som gör våra produkter unika är att vi inte bara återskapar ett
            foto, utan skapar en personlig design anpassad för materialet och
            känslan i motivet. Varje detalj formas med omsorg för att lyfta fram
            det som är viktigast i bilden.
          </p>

          <p>Vi kan kombinera flera av era ”vanliga” fotografier i designen.</p>

          <p>
            Resultatet blir därför mer än en bild i trä, det blir en unik,
            personlig design som bär känslan från ditt minne på ett helt nytt
            sätt.
          </p>
        </div>

        <div className="enamel-image">
          <img src={bildgravyr1} alt="Bildgravyr" />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}
      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>Från foto till unik personlig design</h2>

          <p>
            Det viktigaste i vårt arbete är inte själva fotot i sig utan hur vi
            förvandlar det till en helt unik design anpassad för gravyr i trä.
          </p>

          <p>
            Vi arbetar inte med standardfilter eller enkel bildöverföring. Varje
            bild tolkas, analyseras och omformas manuellt för att passa
            materialets struktur, djup och karaktär. Det innebär att vi kan
            kombinera eller förändra delar av olika bilder, plocka ut specifika
            personer, ansikten, husdjur eller objekt och sätta ihop dem till en
            ny helhet.
          </p>

          <p>
            Vid behov kan vi även restaurera äldre eller skadade bilder,
            förbättra detaljer eller ta bort störande bakgrunder. Detta gör att
            även bilder med låg kvalitet ofta kan bli till en vacker och
            användbar gravyr.
          </p>

          <p>
            Vi skapar därefter en specialdesignad komposition där ljus,
            kontraster, detaljer och uttryck anpassas för att ge ett
            konstnärligt och levande resultat. Slutligen optimeras bilden
            specifikt för högkvalitativ gravyr i trä, där varje linje och detalj
            är anpassad för materialets egenskaper.
          </p>

          <p>
            Resultatet blir därför inte bara en gravyr av ett foto utan en
            personlig design skapad specifikt för just din bild och just det
            material du valt. Det är detta som gör varje produkt unik.
          </p>

          <p>
            Varje bild är unik och behöver därför bearbetas för att ge ett fint
            resultat vid gravyr. Vi anpassar bland annat ljus, kontrast,
            detaljer, beskärning och bakgrund efter motivet och det material du
            har valt.
          </p>

          <p>
            När designen är klar får du alltid ett digitalt korrektur. Vi börjar
            inte gravera förrän du har godkänt resultatet.
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={bildgravyr5}
            alt="Bildgravyr"
            className="bildgravyr-large-image"
          />
        </div>
      </section>

      {/* TEXT VÄNSTER / BILD HÖGER */}
      <section className="enamel-row">
        <div className="enamel-text">
          <h2>Material och specialbeställningar</h2>

          <p>
            Vi arbetar idag med MDF och plywood i olika storlekar, former och
            färger. Sortimentet utvecklas löpande.
          </p>

          <p>
            Bildgravyrerna finns i flera storlekar från 15 × 20 cm upp till 40 ×
            60 cm, i flera former och färger. Du kan välja mellan MDF och
            plywood, i 6 eller 12 mm tjocklek.
          </p>

          <p>Ytan finns i tre utföranden:</p>

          <ul>
            <li>Original / natur – materialets naturliga karaktär bevaras.</li>
            <li>
              Transparent vit – en ljusare yta där materialets struktur
              fortfarande syns.
            </li>
            <li>
              Helvit lackerad – ett rent och modernt uttryck med tydlig kontrast
              mot graveringen.
            </li>
          </ul>

          <p>
            Vi erbjuder flera standardformer för att passa olika tillfällen:
          </p>

          <ul>
            <li>Rektangel – klassisk form för alla typer av motiv</li>
            <li>
              Oval – mjuk och elegant form som passar porträtt och minnesbilder
            </li>
            <li>Cirkel – modern och stilren form som passar många motiv</li>
            <li>
              Hjärta – perfekt för bröllop, alla hjärtans dag och romantiska
              gåvor
            </li>
            <li>Övriga – livets viktigaste stunder</li>
          </ul>

          <p>
            Om du önskar något utöver vårt standardutbud såsom speciella former,
            andra material, specialstorlekar eller unika lösningar är du alltid
            välkommen att kontakta oss, så tar vi fram en anpassad lösning.
          </p>
        </div>

        <div className="enamel-image">
          <img src={bildgravyr3} alt="Bildgravyr" />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}
      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>Premium Epoxyfinish – handgjord</h2>

          <p>
            Ge din gravyr en exklusiv finish med ett 3–5 mm tjockt lager klar
            epoxy. Epoxyn appliceras och färdigställs för hand av oss, vilket
            gör varje produkt unik och ger en djup, blank och glasliknande yta
            som framhäver gravyrens detaljer och ger motivet extra djup och
            lyster.
          </p>

          {/* <p>Läs mer om Epoxyfinish här.</p> */}
        </div>

        <div className="enamel-image">
          <img src={brudpar} alt="Brudpar" />
        </div>
      </section>

      {/* TEXT VÄNSTER / BILD HÖGER */}
      <section className="enamel-row">
        <div className="enamel-text">
          <h2>Tillbehör till din gravyr</h2>

          <p>
            Du kan beställa din gravyr som enbart träskiva, eller komplettera
            den med olika tillbehör för hur du visar upp bilden.
          </p>

          <p>
            Vi erbjuder bland annat hållare för stående placering,
            väggupphängning direkt mot väggen eller med distans för en svävande
            effekt.
          </p>

          <p>
            Som tillval erbjuder vi bakgrundsbelysning till din gravyr. Ljuset
            bakom tavlan framhäver motivet och skapar en exklusiv svävande
            effekt mot väggen, särskilt effektfullt i mörkare miljöer.
          </p>

          {/* <p>Läs mer om Tillbehör här.</p> */}
        </div>

        <div className="enamel-image">
          <img src={bildgravyr4} alt="Bildgravyr" />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}
      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>Hur vi jobbar</h2>

          <p>1. Välj material, form, storlek, färg med mera.</p>

          <p>
            2. Ladda upp 1 till 3 bilder, eventuellt 1 skiss med egna
            designförslag och en kort beskrivning med specifika önskemål.
          </p>

          <p>3. Ange dina uppgifter, leveransadress och utför betalningen.</p>

          <p>4. Du får omgående bekräftelse och ordernummer.</p>

          <p>
            5. Vi transformerar ”vanliga” bilder till unik design, anpassad för
            det valda materialet.
          </p>

          <p>
            6. Senast inom 3 arbetsdagar får ni korrektur. Om ni har synpunkter
            eller vill prova nya bilder, då gör vi nytt korrektur. Efter godkänt
            korrektur börjar vi tillverkningen av din personliga gravyr.
          </p>

          <p>
            7. Vi försöker att leverera inom 1–2 veckor efter godkänt korrektur.
            Under hektiska perioder kan det ta upp till 4 veckor. Produkter med
            epoxyfinish tar cirka 1 vecka enbart för att härda.
          </p>

          <p>8. Vi skickar produkten till dig.</p>
        </div>

        <div className="enamel-image">
          <img src={bildgravyr2} alt="Bildgravyr" />
        </div>
      </section>

      {/* TEXT VÄNSTER / BILD HÖGER */}
      <section className="enamel-row">
        <div className="enamel-text">
          <h2>Skapa din personliga bildgravyr</h2>

          <p>
            Gör dina favoritbilder till en unik och personlig produkt. Utforska
            våra bildgravyrer eller kontakta oss om du har frågor, egna önskemål
            eller vill diskutera en specialbeställning.
          </p>

          <div className="enamel-links">
            <Link to="/produkter/bildgravyr" className="enamel-link">
              Se bildgravyrprodukter
            </Link>

            <Link to="/contact" className="enamel-link">
              Kontakta oss
            </Link>
          </div>
        </div>

        <div className="enamel-image">{/* Bild läggs till här */}</div>
      </section>
    </div>
  );
}
