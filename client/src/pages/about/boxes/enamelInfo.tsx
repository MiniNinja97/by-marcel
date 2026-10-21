
import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/languageContext";
import "./enamelInfo.css";

import BKAE1 from "./boxes-img/BKAE-1.jpg";
import BKAE2 from "./boxes-img/BKAE-2.jpg";
import BKAE3 from "./boxes-img/BKAE-3.jpg";
import BKAE4 from "./boxes-img/BKAE-4.jpg";
import BKAE5 from "./boxes-img/BKAE-5.jpg";
import BKAE6 from "./boxes-img/BKAE-6.jpg";
import BKAE7 from "./boxes-img/BKAE-7.jpg";
import BKAE8 from "./boxes-img/BKAE-8.jpg";

export default function EnamelInfo() {
  const { language } = useLanguage();

  return (
    <div className="enamel-info">
      <h1 className="enamel-title">
        {language === "sv" ? "ÄKTA EMALJ" : "GENUINE ENAMEL"}
      </h1>

      {/* TEXT VÄNSTER / BILD HÖGER */}

      <section className="enamel-row">
        <div className="enamel-text">
          <h2>
            {language === "sv"
              ? "Emaljskyltar – ett hantverk med historia"
              : "Enamel signs – craftsmanship with a rich history"}
          </h2>

          <p>
            {language === "sv"
              ? "Emaljskyltar tillverkas av metall som täcks med lager av glaspulver och bränns vid mycket hög temperatur. Resultatet blir en hård, blank och färgbeständig yta som tål både väder, sol och tid."
              : "Enamel signs are made from metal coated with layers of powdered glass and fired at very high temperatures. The result is a hard, glossy and colourfast surface that withstands weather, sunlight and the passage of time."}
          </p>

          <p>
            {language === "sv"
              ? "Emaljering har använts i flera tusen år som dekorativ teknik, men under slutet av 1800-talet och början av 1900-talet blev emaljskyltar vanliga för gatunamn, husnummer, reklam och information. Många av dessa gamla skyltar finns fortfarande kvar idag – ett tydligt bevis på materialets hållbarhet."
              : "Enamelling has been used as a decorative technique for thousands of years, but enamel signs became particularly popular in the late 19th and early 20th centuries for street names, house numbers, advertising and information. Many of these old signs can still be seen today – clear evidence of the material's durability."}
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE8}
            alt={language === "sv" ? "Emaljskylt" : "Enamel sign"}
          />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}

      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>
            {language === "sv"
              ? "Äkta emalj – tidlös kvalitet som håller i generationer"
              : "Genuine enamel – timeless quality that lasts for generations"}
          </h2>

          <p>
            {language === "sv"
              ? "Äkta emalj kombinerar traditionellt hantverk med en tidlös känsla och passar lika bra till klassiska skyltar som till modern, personlig design. Hållbart, exklusivt och tillverkat enligt traditionellt hantverk. En emaljskylt behåller sin karaktär och blir en personlig detalj att uppskatta år efter år."
              : "Genuine enamel combines traditional craftsmanship with timeless appeal and is equally suited to classic signs and modern, personalised designs. Durable, exclusive and made using traditional craftsmanship, an enamel sign retains its character and becomes a personal detail to appreciate year after year."}
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE7}
            alt={
              language === "sv"
                ? "Personliga emaljskyltar"
                : "Personalised enamel signs"
            }
          />
        </div>
      </section>

      {/* TEXT VÄNSTER / BILD HÖGER */}

      <section className="enamel-row">
        <div className="enamel-text">
          <h2>
            {language === "sv"
              ? "Traditionellt hantverk"
              : "Traditional craftsmanship"}
          </h2>

          <p>
            {language === "sv"
              ? "Våra emaljskyltar tillverkas enligt den traditionella emaljeringsprocessen – ett äkta hantverk med mycket lång hållbarhet. Skyltarna tillverkas av 3 mm stål där varje färg appliceras och bränns separat i ugn."
              : "Our enamel signs are made using the traditional enamelling process – genuine craftsmanship that ensures exceptional durability. The signs are made from 3 mm steel, with each colour applied and fired separately in a kiln."}
          </p>

          <p>
            {language === "sv"
              ? "Dessutom får varje produkt ett extra lager emalj på baksidan för ökat skydd och hög kvalitet."
              : "Each product also receives an additional layer of enamel on the back for extra protection and lasting quality."}
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE2}
            alt={
              language === "sv"
                ? "Metallbearbetning av emaljskylt"
                : "Metalworking for an enamel sign"
            }
          />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}

      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>
            {language === "sv"
              ? "Tillverkningsprocessen"
              : "The manufacturing process"}
          </h2>

          <p>
            {language === "sv"
              ? "1. Metallbearbetning"
              : "1. Metalworking"}
          </p>
          <p>
            {language === "sv"
              ? "2. Applicera emaljpulver"
              : "2. Applying enamel powder"}
          </p>
          <p>
            {language === "sv"
              ? "3. Manuell schablonmålning"
              : "3. Manual stencil painting"}
          </p>
          <p>
            {language === "sv"
              ? "4. Manuell schablonmålning"
              : "4. Manual stencil painting"}
          </p>
          <p>
            {language === "sv"
              ? "5. Varje emaljfärg bränns separat i ugn"
              : "5. Each enamel colour is fired separately in a kiln"}
          </p>
          <p>
            {language === "sv"
              ? "6. Din personliga emaljskylt"
              : "6. Your personalised enamel sign"}
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE5}
            alt={
              language === "sv"
                ? "Emaljskylt i ugn"
                : "Enamel sign in a kiln"
            }
          />
        </div>
      </section>

      {/* TEXT VÄNSTER / BILD HÖGER */}

      <section className="enamel-row">
        <div className="enamel-text">
          <h2>
            {language === "sv"
              ? "Designa din egen emaljskylt"
              : "Design your own enamel sign"}
          </h2>

          <p>
            {language === "sv"
              ? "Vi erbjuder ett stort sortiment av måttbeställda emaljskyltar bland annat husnummerskyltar med eller utan extra text, gatunamnsskyltar, textskyltar och fotoskyltar. Välj själv text, storlek, färger och layout så vi hjälper till med designen och skickar korrektur vid behov innan produktion."
              : "We offer a wide range of custom-made enamel signs, including house number signs with or without additional text, street name signs, text signs and photo signs. Choose your own text, size, colours and layout, and we'll help with the design and provide a proof when needed before production."}
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE4}
            alt={
              language === "sv"
                ? "Design av personlig emaljskylt"
                : "Designing a personalised enamel sign"
            }
          />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}

      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>
            {language === "sv"
              ? "Standardprodukter"
              : "Standard products"}
          </h2>

          <p>
            {language === "sv"
              ? "Vi erbjuder även ett brett sortiment av färdiga emaljprodukter exempelvis skyltar med bil- och motormärken, företagsskyltar, WC-skyltar, säkerhetsskyltar, inom- och utomhustermometrar, klockor och mycket mer."
              : "We also offer a wide selection of ready-made enamel products, including signs featuring car and motorcycle brands, business signs, toilet signs, safety signs, indoor and outdoor thermometers, clocks and much more."}
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE1}
            alt={
              language === "sv"
                ? "Emaljprodukter"
                : "Enamel products"
            }
          />
        </div>
      </section>

      {/* TEXT VÄNSTER / BILD HÖGER */}

      <section className="enamel-row">
        <div className="enamel-text">
          <h2>
            {language === "sv"
              ? "Lokal produktion & leveranstid"
              : "Local production & delivery times"}
          </h2>

          <p>
            {language === "sv"
              ? "Emaljprodukterna är den enda delen av vårt sortiment som vi inte tillverkar själva i vår studio och verkstad. De produceras istället lokalt av en specialiserad emaljtillverkare enligt våra specifikationer."
              : "Our enamel products are the only items in our range that we don't manufacture ourselves in our studio and workshop. Instead, they are produced locally by a specialist enamel manufacturer according to our specifications."}
          </p>

          <p>
            {language === "sv"
              ? "Leveranstiden för måttbeställda produkter är normalt 4–6 veckor. Standardprodukter kan vanligtvis levereras inom 3 veckor."
              : "Delivery times for custom-made products are normally 4–6 weeks. Standard products can usually be delivered within 3 weeks."}
          </p>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE6}
            alt={
              language === "sv"
                ? "Färdig emaljskylt"
                : "Finished enamel sign"
            }
          />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}

      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>
            {language === "sv"
              ? "Specialbeställningar & större projekt"
              : "Custom orders & larger projects"}
          </h2>

          <p>
            {language === "sv"
              ? "Hittar du inte det du söker? Kontakta oss gärna. Vi hjälper även till med specialprodukter som inte finns i standardsortimentet och med större beställningar."
              : "Can't find what you're looking for? Feel free to contact us. We can also help with custom products that aren't part of our standard range, as well as larger orders."}
          </p>

          <p>
            {language === "sv"
              ? "Vi har erfarenhet av större skyltprojekt exempelvis komplett skyltning för bostadsområden och fastighetsprojekt."
              : "We have experience with larger signage projects, including complete signage solutions for residential areas and property developments."}
          </p>

          <div className="enamel-links">
            <Link to="/produkter/emalj/valj" className="enamel-link">
              {language === "sv"
                ? "Se emaljprodukter"
                : "View enamel products"}
            </Link>

            <Link to="/contact" className="enamel-link">
              {language === "sv" ? "Kontakta oss" : "Contact us"}
            </Link>
          </div>
        </div>

        <div className="enamel-image">
          <img
            src={BKAE3}
            alt={
              language === "sv"
                ? "Tillverkning av personlig emaljskylt"
                : "Making a personalised enamel sign"
            }
          />
        </div>
      </section>
    </div>
  );
}
