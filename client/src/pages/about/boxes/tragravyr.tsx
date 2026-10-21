

import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/languageContext";
import "./tragravyr.css";

export default function Tragravyr() {
  const { language } = useLanguage();

  return (
    <div className="tragravyr-info">
      <h1 className="tragravyr-title">
        {language === "sv"
          ? "MATERIAL FÖR BILDGRAVYR"
          : "MATERIALS FOR PHOTO ENGRAVING"}
      </h1>

      {/* INTRODUKTION */}
      <section className="tragravyr-row">
        <div className="tragravyr-text">
          <h2>
            {language === "sv"
              ? "Bildgravyr, olika material – olika uttryck"
              : "Photo engraving – different materials, different results"}
          </h2>

          <p>
            {language === "sv"
              ? "Materialet och ytbehandlingen har stor betydelse för hur en bildgravyr blir. Samma bild kan få helt olika uttryck beroende på ytans struktur, hårdhet och färg. Det finns inget fel material att välja – framför allt är det er smak och känslan ni vill skapa som styr. Här beskriver vi skillnaderna mellan våra material för att hjälpa er hitta det som passar er bild och inredning."
              : "The material and surface finish have a significant impact on the final appearance of a photo engraving. The same image can look completely different depending on the surface's texture, hardness and colour. There is no wrong material to choose – what matters most is your personal taste and the atmosphere you want to create. Here, we explain the differences between our materials to help you find the one that best suits your image and interior."}
          </p>
        </div>

        <div className="tragravyr-image">
          {/* Bild läggs till senare */}
        </div>
      </section>

      {/* DEKORPANEL */}
      <section className="tragravyr-row tragravyr-row-reverse">
        <div className="tragravyr-text">
          <h2>
            {language === "sv"
              ? "Dekorpanel – modernt och detaljrikt"
              : "Decorative panels – modern and detailed"}
          </h2>

          <p>
            {language === "sv"
              ? "Vår dekorpanel har en helt vit, hård och jämn (faner)yta som ger en stabil och detaljrik gravyr. Resultatet får ett rent och modernt uttryck med tydliga detaljer och jämna kontraster. Inom kort kommer flera fanerfarger till."
              : "Our decorative panel has a completely white, hard and smooth veneer surface that produces consistent, highly detailed engravings. The result is a clean, modern appearance with sharp details and even contrast. More veneer colours will be available soon."}
          </p>
        </div>

        <div className="tragravyr-image">
          {/* Bild läggs till senare */}
        </div>
      </section>

      {/* PLYWOOD */}
      <section className="tragravyr-row">
        <div className="tragravyr-text">
          <h2>
            {language === "sv"
              ? "Plywood – naturligt och levande"
              : "Plywood – natural and full of character"}
          </h2>

          <p>
            {language === "sv"
              ? "Plywood är en naturprodukt där träets ådring och variationer i ytans hårdhet påverkar gravyren. Det ger varje bild ett eget uttryck. Naturlig plywood ger ett varmt, rustikt resultat med synlig trästruktur. Kontrasten är mjukare och de allra minsta detaljerna kan bli mindre framträdande jämfört med dekorpanel."
              : "Plywood is a natural material in which the wood grain and variations in surface hardness influence the engraving. This gives every image its own unique appearance. Natural plywood produces a warm, rustic result with visible wood grain. The contrast is softer, and the finest details may be less pronounced than on decorative panels."}
          </p>

          <p>
            {language === "sv"
              ? "Transparent vitlackerad plywood ger tydligare detaljer och bättre kontrast, samtidigt som träets ådring och naturliga känsla finns kvar. Helt vitlackerad plywood ger ännu tydligare kontraster och detaljer. Den vita ytan täcker träets ådring, medan gravyren får ett levande uttryck med varierande bruntoner."
              : "Plywood with a translucent white finish provides clearer details and stronger contrast while preserving the wood grain and its natural character. Fully white-painted plywood offers even sharper contrast and detail. The white surface conceals the wood grain, while the engraving develops a lively appearance with varying shades of brown."}
          </p>
        </div>

        <div className="tragravyr-image">
          {/* Bilder läggs till senare */}
        </div>
      </section>

      {/* MDF */}
      <section className="tragravyr-row tragravyr-row-reverse">
        <div className="tragravyr-text">
          <h2>
            {language === "sv"
              ? "MDF – varmt och jämnt"
              : "MDF – warm and consistent"}
          </h2>

          <p>
            {language === "sv"
              ? "MDF har en jämn struktur utan träådring, vilket ger ett mer enhetligt uttryck. Naturlig MDF ger en varm och rustik bild med mjukare kontraster. De minsta detaljerna kan bli mindre tydliga. Transparent vitlackerad MDF ger ljusare bakgrund och tydligare kontraster, samtidigt som materialets varma karaktär finns kvar. Beroende på motivet kan resultatet kännas både nostalgiskt och modernt. Helt vitlackerad MDF ger en mycket detaljrik gravyr med jämna, mörkbruna toner mot den vita bakgrunden."
              : "MDF has a uniform structure without wood grain, creating a more consistent appearance. Natural MDF produces a warm, rustic image with softer contrast, although the finest details may be less distinct. MDF with a translucent white finish provides a lighter background and clearer contrast while retaining the material's warm character. Depending on the image, the result can feel both nostalgic and modern. Fully white-painted MDF produces a highly detailed engraving with even, dark brown tones against the white background."}
          </p>
        </div>

        <div className="tragravyr-image">
          {/* Bild läggs till senare */}
        </div>
      </section>

      {/* VITA YTOR */}
      <section className="tragravyr-row">
        <div className="tragravyr-text">
          <h2>
            {language === "sv"
              ? "Vita ytor – olika resultat"
              : "White surfaces – different results"}
          </h2>

          <p>
            {language === "sv"
              ? "Helt vit dekorpanel, vitlackerad plywood och vitlackerad MDF kan se liknande ut före graveringen, men ger olika resultat."
              : "Fully white decorative panels, white-painted plywood and white-painted MDF may look similar before engraving, but they produce different results."}
          </p>

          <p>
            {language === "sv"
              ? "Dekorpanelens hårda yta ger ett rent och jämnt uttryck. MDF och plywood är mjukare och kan ge en djupare gravyr med mer struktur och en tydligare känsla av relief. MDF ger jämna, mörkbruna toner, medan plywood får större variationer i bruntonerna."
              : "The hard surface of decorative panels creates a clean, uniform appearance. MDF and plywood are softer and can produce deeper engravings with more texture and a stronger sense of relief. MDF produces consistent, dark brown tones, while plywood shows greater variation in its shades of brown."}
          </p>
        </div>

        <div className="tragravyr-image">
          {/* Jämförelsebilder läggs till senare */}
        </div>
      </section>

      {/* BILDBEARBETNING */}
      <section className="tragravyr-row tragravyr-row-reverse">
        <div className="tragravyr-text">
          <h2>
            {language === "sv"
              ? "Vi anpassar bilden efter ert val"
              : "We adapt your image to your chosen material"}
          </h2>

          <p>
            {language === "sv"
              ? "Vi anpassar bildbearbetningen och korrekturet efter materialet och ytbehandlingen ni väljer. De flesta bilder fungerar bra på samtliga material, men ibland kan ett annat material eller en justering av motivet ge ett bättre resultat. På helt vita ytor behöver bilden exempelvis ha tillräckliga kontraster för att gravyren ska bli tydlig och inte upplevas som för ljus eller svag. Om vi ser möjlighet att förbättra resultatet kontaktar vi er."
              : "We adapt the image editing and digital proof to your chosen material and surface finish. Most images work well on all our materials, but sometimes a different material or an adjustment to the image can produce a better result. On completely white surfaces, for example, the image needs sufficient contrast to ensure the engraving is clear and doesn't appear too light or faint. If we identify an opportunity to improve the result, we'll contact you."}
          </p>
        </div>

        <div className="tragravyr-image">
          {/* Bilder läggs till senare */}
        </div>
      </section>

      {/* ANDRA MATERIAL */}
      <section className="tragravyr-row">
        <div className="tragravyr-text">
          <h2>
            {language === "sv"
              ? "Skiffer, sten och andra material"
              : "Slate, stone and other materials"}
          </h2>

          <p>
            {language === "sv"
              ? "I bildgalleriet finns även exempel på gravyr på skiffer, sten och andra material. Naturmaterial har egna förutsättningar för detaljer, kontrast och färgtoner. Samtidigt tillför deras struktur och variationer en speciell känsla och karaktär."
              : "Our image gallery also includes examples of engraving on slate, stone and other materials. Natural materials have their own characteristics that influence detail, contrast and colour tones. At the same time, their textures and natural variations add a distinctive feel and character."}
          </p>
        </div>

        <div className="tragravyr-image">
          {/* Bild läggs till senare */}
        </div>
      </section>

      {/* AVSLUTNING */}
      <section className="tragravyr-row tragravyr-row-reverse">
        <div className="tragravyr-text">
          <h2>
            {language === "sv"
              ? "Hitta rätt material för din bild"
              : "Find the right material for your image"}
          </h2>

          <p>
            {language === "sv"
              ? "Titta gärna i bildgalleriet och jämför materialen för att hitta inspiration. Det finns inget fel val – det handlar om vilket uttryck som passar er bäst. Vill ni ha hjälp att välja? Kontakta oss på info@bymarcel.se så hjälper vi er att hitta rätt material för just er bild."
              : "Explore our image gallery and compare the different materials for inspiration. There's no wrong choice – it's all about finding the appearance that suits you best. Need help deciding? Contact us at info@bymarcel.se and we'll help you find the right material for your image."}
          </p>

          <div className="tragravyr-links">
            <Link to="/produkter/bildgravyr" className="tragravyr-link">
              {language === "sv"
                ? "Se bildgravyrprodukter"
                : "View photo engraving products"}
            </Link>

            <Link to="/contact" className="tragravyr-link">
              {language === "sv" ? "Kontakta oss" : "Contact us"}
            </Link>
          </div>
        </div>

        <div className="tragravyr-image">
          {/* Bilder läggs till senare */}
        </div>
      </section>
    </div>
  );
}
