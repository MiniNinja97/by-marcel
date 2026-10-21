import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/languageContext";
import "./enamelInfo.css";

import bildgravyr1 from "./boxes-img/bildgravyr1.jpeg";
import bildgravyr5 from "./boxes-img/bildgravyr5.jpeg";
import bildgravyr3 from "./boxes-img/bildgravyr3.jpeg";
import brudpar from "./boxes-img/brudpar.jpg";
import bildgravyr4 from "./boxes-img/bildgravyr4.jpeg";
import bildgravyr2 from "./boxes-img/bildgravyr2.jpeg";

export default function PhotoEngraving() {
  const { language } = useLanguage();
  return (
    <div className="enamel-info">
      <h1 className="enamel-title">{language === "sv" ? "BILDGRAVYR" : "PHOTO ENGRAVING"}</h1>

      {/* TEXT VÄNSTER / BILD HÖGER */}
      <section className="enamel-row">
        <div className="enamel-text">
          <h2>{language === "sv" ? "Personlig bildgravyr i trä" : "Personalised photo engraving on wood"}</h2>
          <h3>{language === "sv" ? "En personlig produkt, skapad från dina bilder" : "A personalised product created from your photos"}</h3>

          <p>{language === "sv" ? "Gör dina egna favoritbilder till en personlig och unik tavla. Hos By Marcel skapar vi produkter som passar livets viktigaste stunder familjen, barnen, bröllop, dop, student, minnesgåvor eller en fin bild på ett älskat husdjur med eller utan text till." : "Turn your favourite photos into a unique, personalised piece of wall art. At By Marcel, we create products for life's most important moments – family, children, weddings, christenings, graduations, memorial gifts or a beautiful picture of a beloved pet, with or without text."}</p>

          <p>{language === "sv" ? "Det som gör våra produkter unika är att vi inte bara återskapar ett foto, utan skapar en personlig design anpassad för materialet och känslan i motivet. Varje detalj formas med omsorg för att lyfta fram det som är viktigast i bilden." : "What makes our products unique is that we do more than simply reproduce a photo. We create a personalised design tailored to the material and the feeling of the image. Every detail is carefully crafted to highlight what matters most in the picture."}</p>

          <p>{language === "sv" ? "Vi kan kombinera flera av era ”vanliga” fotografier i designen." : "We can combine several of your ordinary photographs into one design."}</p>

          <p>{language === "sv" ? "Resultatet blir därför mer än en bild i trä, det blir en unik, personlig design som bär känslan från ditt minne på ett helt nytt sätt." : "The result is more than just an image on wood: it is a unique, personalised design that captures the feeling of your memory in a completely new way."}</p>
        </div>

        <div className="enamel-image">
          <img src={bildgravyr1} alt={language === "sv" ? "Bildgravyr" : "Photo engraving"} />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}
      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>{language === "sv" ? "Från foto till unik personlig design" : "From photograph to unique personalised design"}</h2>

          <p>{language === "sv" ? "Det viktigaste i vårt arbete är inte själva fotot i sig utan hur vi förvandlar det till en helt unik design anpassad för gravyr i trä." : "The most important part of our work is not the photograph itself, but how we transform it into a completely unique design adapted for engraving on wood."}</p>

          <p>{language === "sv" ? "Vi arbetar inte med standardfilter eller enkel bildöverföring. Varje bild tolkas, analyseras och omformas manuellt för att passa materialets struktur, djup och karaktär. Det innebär att vi kan kombinera eller förändra delar av olika bilder, plocka ut specifika personer, ansikten, husdjur eller objekt och sätta ihop dem till en ny helhet." : "We do not use standard filters or simple image transfers. Each image is interpreted, analysed and manually reworked to suit the material's texture, depth and character. This means we can combine or alter parts of different photos, select particular people, faces, pets or objects, and bring them together into a new composition."}</p>

          <p>{language === "sv" ? "Vid behov kan vi även restaurera äldre eller skadade bilder, förbättra detaljer eller ta bort störande bakgrunder. Detta gör att även bilder med låg kvalitet ofta kan bli till en vacker och användbar gravyr." : "When needed, we can also restore old or damaged photos, enhance details or remove distracting backgrounds. This means even lower-quality images can often become beautiful, usable engravings."}</p>

          <p>{language === "sv" ? "Vi skapar därefter en specialdesignad komposition där ljus, kontraster, detaljer och uttryck anpassas för att ge ett konstnärligt och levande resultat. Slutligen optimeras bilden specifikt för högkvalitativ gravyr i trä, där varje linje och detalj är anpassad för materialets egenskaper." : "We then create a custom composition, adjusting lighting, contrast, details and expression to achieve an artistic, lifelike result. Finally, the image is optimised specifically for high-quality wood engraving, with every line and detail adapted to the properties of the material."}</p>

          <p>{language === "sv" ? "Resultatet blir därför inte bara en gravyr av ett foto utan en personlig design skapad specifikt för just din bild och just det material du valt. Det är detta som gör varje produkt unik." : "The result is not simply an engraving of a photo, but a personalised design created specifically for your image and your chosen material. This is what makes every product unique."}</p>

          <p>{language === "sv" ? "Varje bild är unik och behöver därför bearbetas för att ge ett fint resultat vid gravyr. Vi anpassar bland annat ljus, kontrast, detaljer, beskärning och bakgrund efter motivet och det material du har valt." : "Every image is unique and therefore needs processing to achieve a beautiful engraved result. We adjust lighting, contrast, details, cropping and backgrounds to suit the subject and your chosen material."}</p>

          <p>{language === "sv" ? "När designen är klar får du alltid ett digitalt korrektur. Vi börjar inte gravera förrän du har godkänt resultatet." : "Once the design is ready, you will always receive a digital proof. We do not start engraving until you have approved the result."}</p>
        </div>

        <div className="enamel-image">
          <img
            src={bildgravyr5}
            alt={language === "sv" ? "Bildgravyr" : "Photo engraving"}
            className="bildgravyr-large-image"
          />
        </div>
      </section>

      {/* TEXT VÄNSTER / BILD HÖGER */}
      <section className="enamel-row">
        <div className="enamel-text">
          <h2>{language === "sv" ? "Material och specialbeställningar" : "Materials and custom orders"}</h2>

          <p>{language === "sv" ? "Vi arbetar idag med MDF och plywood i olika storlekar, former och färger. Sortimentet utvecklas löpande." : "We currently work with MDF and plywood in different sizes, shapes and colours. Our range is continually expanding."}</p>

          <p>{language === "sv" ? "Bildgravyrerna finns i flera storlekar från 15 × 20 cm upp till 40 × 60 cm, i flera former och färger. Du kan välja mellan MDF och plywood, i 6 eller 12 mm tjocklek." : "Our photo engravings are available in several sizes, from 15 × 20 cm up to 40 × 60 cm, in various shapes and colours. You can choose MDF or plywood in thicknesses of 6 or 12 mm."}</p>

          <p>{language === "sv" ? "Ytan finns i tre utföranden:" : "There are three surface finishes available:"}</p>

          <ul>
            <li>{language === "sv" ? "Original / natur – materialets naturliga karaktär bevaras." : "Original / natural – preserves the material's natural character."}</li>
            <li>{language === "sv" ? "Transparent vit – en ljusare yta där materialets struktur fortfarande syns." : "Translucent white – a lighter surface that still reveals the material's texture."}</li>
            <li>{language === "sv" ? "Helvit lackerad – ett rent och modernt uttryck med tydlig kontrast mot graveringen." : "Fully white-painted – a clean, modern look with clear contrast against the engraving."}</li>
          </ul>

          <p>{language === "sv" ? "Vi erbjuder flera standardformer för att passa olika tillfällen:" : "We offer several standard shapes to suit different occasions:"}</p>

          <ul>
            <li>{language === "sv" ? "Rektangel – klassisk form för alla typer av motiv" : "Rectangle – a classic shape for all kinds of images"}</li>
            <li>{language === "sv" ? "Oval – mjuk och elegant form som passar porträtt och minnesbilder" : "Oval – a soft, elegant shape suited to portraits and memorial images"}</li>
            <li>{language === "sv" ? "Cirkel – modern och stilren form som passar många motiv" : "Circle – a modern, stylish shape suited to many images"}</li>
            <li>{language === "sv" ? "Hjärta – perfekt för bröllop, alla hjärtans dag och romantiska gåvor" : "Heart – perfect for weddings, Valentine's Day and romantic gifts"}</li>
            <li>{language === "sv" ? "Övriga – livets viktigaste stunder" : "Other – life's most important moments"}</li>
          </ul>

          <p>{language === "sv" ? "Om du önskar något utöver vårt standardutbud såsom speciella former, andra material, specialstorlekar eller unika lösningar är du alltid välkommen att kontakta oss, så tar vi fram en anpassad lösning." : "If you would like something beyond our standard range, such as special shapes, different materials, custom sizes or unique solutions, you are always welcome to contact us so we can create a tailored solution."}</p>
        </div>

        <div className="enamel-image">
          <img src={bildgravyr3} alt={language === "sv" ? "Bildgravyr" : "Photo engraving"} />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}
      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>{language === "sv" ? "Premium Epoxyfinish – handgjord" : "Premium epoxy finish – handmade"}</h2>

          <p>{language === "sv" ? "Ge din gravyr en exklusiv finish med ett 3–5 mm tjockt lager klar epoxy. Epoxyn appliceras och färdigställs för hand av oss, vilket gör varje produkt unik och ger en djup, blank och glasliknande yta som framhäver gravyrens detaljer och ger motivet extra djup och lyster." : "Give your engraving a premium finish with a 3–5 mm layer of clear epoxy. We apply and finish the epoxy by hand, making each product unique and creating a deep, glossy, glass-like surface that highlights the engraved details and adds extra depth and lustre to the image."}</p>

          {/* <p>{language === "sv" ? "Läs mer om Epoxyfinish här." : "Accessories for your engraving"}</p> */}
        </div>

        <div className="enamel-image">
          <img src={brudpar} alt={language === "sv" ? "Brudpar" : "Wedding couple"} />
        </div>
      </section>

      {/* TEXT VÄNSTER / BILD HÖGER */}
      <section className="enamel-row">
        <div className="enamel-text">
          <h2>{language === "sv" ? "Tillbehör till din gravyr" : "You can order your engraving as a wooden panel on its own, or add accessories to display your picture."}</h2>

          <p>{language === "sv" ? "Du kan beställa din gravyr som enbart träskiva, eller komplettera den med olika tillbehör för hur du visar upp bilden." : "We offer stands for tabletop display, wall mounting directly against the wall, or spacers to create a floating effect."}</p>

          <p>{language === "sv" ? "Vi erbjuder bland annat hållare för stående placering, väggupphängning direkt mot väggen eller med distans för en svävande effekt." : "As an optional extra, we offer backlighting for your engraving. The light behind the artwork highlights the image and creates an elegant floating effect against the wall, especially striking in darker surroundings."}</p>

          <p>{language === "sv" ? "Som tillval erbjuder vi bakgrundsbelysning till din gravyr. Ljuset bakom tavlan framhäver motivet och skapar en exklusiv svävande effekt mot väggen, särskilt effektfullt i mörkare miljöer." : "How we work"}</p>

          {/* <p>{language === "sv" ? "Läs mer om Tillbehör här." : "1. Choose the material, shape, size, colour and other options."}</p> */}
        </div>

        <div className="enamel-image">
          <img src={bildgravyr4} alt={language === "sv" ? "Bildgravyr" : "Photo engraving"} />
        </div>
      </section>

      {/* BILD VÄNSTER / TEXT HÖGER */}
      <section className="enamel-row enamel-row-reverse">
        <div className="enamel-text">
          <h2>{language === "sv" ? "Hur vi jobbar" : "2. Upload 1 to 3 photos, optionally one sketch with your own design ideas, and a short description of any specific requests."}</h2>

          <p>{language === "sv" ? "1. Välj material, form, storlek, färg med mera." : "3. Enter your details and delivery address, and complete payment."}</p>

          <p>{language === "sv" ? "2. Ladda upp 1 till 3 bilder, eventuellt 1 skiss med egna designförslag och en kort beskrivning med specifika önskemål." : "4. You will immediately receive confirmation and an order number."}</p>

          <p>{language === "sv" ? "3. Ange dina uppgifter, leveransadress och utför betalningen." : "5. We transform ordinary photos into a unique design tailored to your chosen material."}</p>

          <p>{language === "sv" ? "4. Du får omgående bekräftelse och ordernummer." : "6. You will receive a digital proof within 3 working days at the latest. If you have feedback or want to try different photos, we will prepare a new proof. Once you approve the proof, we begin producing your personalised engraving."}</p>

          <p>{language === "sv" ? "5. Vi transformerar ”vanliga” bilder till unik design, anpassad för det valda materialet." : "7. We aim to deliver within 1–2 weeks after the proof is approved. During busy periods, it may take up to 4 weeks. Products with an epoxy finish require approximately 1 week just for curing."}</p>

          <p>{language === "sv" ? "6. Senast inom 3 arbetsdagar får ni korrektur. Om ni har synpunkter eller vill prova nya bilder, då gör vi nytt korrektur. Efter godkänt korrektur börjar vi tillverkningen av din personliga gravyr." : "8. We ship the product to you."}</p>

          <p>{language === "sv" ? "7. Vi försöker att leverera inom 1–2 veckor efter godkänt korrektur. Under hektiska perioder kan det ta upp till 4 veckor. Produkter med epoxyfinish tar cirka 1 vecka enbart för att härda." : "Create your personalised photo engraving"}</p>

          <p>{language === "sv" ? "8. Vi skickar produkten till dig." : "Turn your favourite photos into a unique, personalised product. Explore our photo engravings or contact us if you have questions, special requests or would like to discuss a custom order."}</p>
        </div>

        <div className="enamel-image">
          <img src={bildgravyr2} alt={language === "sv" ? "Bildgravyr" : "Photo engraving"} />
        </div>
      </section>

      {/* TEXT VÄNSTER / BILD HÖGER */}
      <section className="enamel-row">
        <div className="enamel-text">
          <h2>{language === "sv" ? "Skapa din personliga bildgravyr" : "View photo engraving products"}</h2>

          <p>{language === "sv" ? "Gör dina favoritbilder till en unik och personlig produkt. Utforska våra bildgravyrer eller kontakta oss om du har frågor, egna önskemål eller vill diskutera en specialbeställning." : "Contact us"}</p>

          <div className="enamel-links">
            <Link to="/produkter/bildgravyr" className="enamel-link">{language === "sv" ? "Se bildgravyrprodukter" : "View photo engraving products"}</Link>

            <Link to="/contact" className="enamel-link">{language === "sv" ? "Kontakta oss" : "Contact us"}</Link>
          </div>
        </div>

        <div className="enamel-image">{/* Bild läggs till här */}</div>
      </section>
    </div>
  );
}