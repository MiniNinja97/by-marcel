import { useLanguage } from "../../../context/languageContext";
import { Link } from "react-router-dom";
import "./enamelInfo.css";

import BKAE1 from "./boxes-img/BKAE-1.jpg";
import BKAE2 from "./boxes-img/BKAE-2.jpg";
import BKAE3 from "./boxes-img/BKAE-3.jpg";
import BKAE4 from "./boxes-img/BKAE-4.jpg";
import BKAE5 from "./boxes-img/BKAE-5.jpg";
import BKAE6 from "./boxes-img/BKAE-6.jpg";
import BKAE7 from "./boxes-img/BKAE-7.jpg";
import BKAE8 from "./boxes-img/BKAE-8.jpg";
import BKAE10 from "./boxes-img/BKAE-10.jpg";

export default function EnamelInfo() {
  return (
    <div className="enamel-info">

  <h1 className="enamel-title">ÄKTA EMALJ</h1>

  <div className="enamel-timeline">
    <img
      src={BKAE10}
      alt="Emaljskyltar genom historien"
    />
  </div>


      {/* TEXT VÄNSTER / BILD HÖGER */}

      <section className="enamel-row">
        <div className="enamel-text">
          <h2>Emaljskyltar – ett hantverk med historia</h2>

          <p>
            Emaljskyltar tillverkas av metall som täcks med lager av
            glaspulver och bränns vid mycket hög temperatur. Resultatet
            blir en hård, blank och färgbeständig yta som tål både
            väder, sol och tid.
          </p>

          <p>
            Emaljering har använts i flera tusen år som dekorativ
            teknik, men under slutet av 1800-talet och början av
            1900-talet blev emaljskyltar vanliga för gatunamn,
            husnummer, reklam och information. Många av dessa gamla
            skyltar finns fortfarande kvar idag – ett tydligt bevis på
            materialets hållbarhet.
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE8}
            alt="Emaljskylt"
          />
        </div>
      </section>


      {/* BILD VÄNSTER / TEXT HÖGER */}

      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>
            Äkta emalj – tidlös kvalitet som håller i generationer
          </h2>

          <p>
            Äkta emalj kombinerar traditionellt hantverk med en tidlös
            känsla och passar lika bra till klassiska skyltar som till
            modern, personlig design. Hållbart, exklusivt och
            tillverkat enligt traditionellt hantverk. En emaljskylt
            behåller sin karaktär och blir en personlig detalj att
            uppskatta år efter år.
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE7}
            alt="Personliga emaljskyltar"
          />
        </div>
      </section>


      {/* TEXT VÄNSTER / BILD HÖGER */}

      <section className="enamel-row">
        <div className="enamel-text">
          <h2>Traditionellt hantverk</h2>

          <p>
            Våra emaljskyltar tillverkas enligt den traditionella
            emaljeringsprocessen – ett äkta hantverk med mycket lång
            hållbarhet. Skyltarna tillverkas av 3 mm stål där varje
            färg appliceras och bränns separat i ugn.
          </p>

          <p>
            Dessutom får varje produkt ett extra lager emalj på
            baksidan för ökat skydd och hög kvalitet.
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE2}
            alt="Metallbearbetning av emaljskylt"
          />
        </div>
      </section>


      {/* BILD VÄNSTER / TEXT HÖGER */}

      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>Tillverkningsprocessen</h2>

          <p>1. Metallbearbetning</p>
          <p>2. Applicera emaljpulver</p>
          <p>3. Manuell schablonmålning</p>
          <p>4. Manuell schablonmålning</p>
          <p>5. Varje emaljfärg bränns separat i ugn</p>
          <p>6. Din personliga emaljskylt</p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE5}
            alt="Emaljskylt i ugn"
          />
        </div>
      </section>


      {/* TEXT VÄNSTER / BILD HÖGER */}

      <section className="enamel-row">
        <div className="enamel-text">
          <h2>Designa din egen emaljskylt</h2>

          <p>
            Vi erbjuder ett stort sortiment av måttbeställda
            emaljskyltar bland annat husnummerskyltar med eller utan
            extra text, gatunamnsskyltar, textskyltar och fotoskyltar.
            Välj själv text, storlek, färger och layout så vi hjälper
            till med designen och skickar korrektur vid behov innan
            produktion.
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE4}
            alt="Design av personlig emaljskylt"
          />
        </div>
      </section>


      {/* BILD VÄNSTER / TEXT HÖGER */}

      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>Standardprodukter</h2>

          <p>
            Vi erbjuder även ett brett sortiment av färdiga
            emaljprodukter exempelvis skyltar med bil- och
            motormärken, företagsskyltar, WC-skyltar,
            säkerhetsskyltar, inom- och utomhustermometrar, klockor
            och mycket mer.
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE1}
            alt="Emaljprodukter"
          />
        </div>
      </section>


      {/* TEXT VÄNSTER / BILD HÖGER */}

      <section className="enamel-row">
        <div className="enamel-text">
          <h2>Lokal produktion & leveranstid</h2>

          <p>
            Emaljprodukterna är den enda delen av vårt sortiment som
            vi inte tillverkar själva i vår studio och verkstad. De
            produceras istället lokalt av en specialiserad
            emaljtillverkare enligt våra specifikationer.
          </p>

          <p>
            Leveranstiden för måttbeställda produkter är normalt
            4–6 veckor. Standardprodukter kan vanligtvis levereras
            inom 3 veckor.
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE6}
            alt="Färdig emaljskylt"
          />
        </div>
      </section>


      {/* BILD VÄNSTER / TEXT HÖGER */}

      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>Specialbeställningar & större projekt</h2>

          <p>
            Hittar du inte det du söker? Kontakta oss gärna. Vi
            hjälper även till med specialprodukter som inte finns i
            standardsortimentet och med större beställningar.
          </p>

          <p>
            Vi har erfarenhet av större skyltprojekt exempelvis
            komplett skyltning för bostadsområden och
            fastighetsprojekt.
          </p>

          <div className="enamel-links">
            <Link to="/produkter" className="enamel-link">
              Se emaljprodukter
            </Link>

            <Link to="/contact" className="enamel-link">
              Kontakta oss
            </Link>
          </div>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE3}
            alt="Tillverkning av personlig emaljskylt"
          />
        </div>
      </section>

    </div>
  );
}