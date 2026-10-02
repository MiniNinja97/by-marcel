import { Link } from "react-router-dom";
import { useLanguage } from "../../context/languageContext";
import "./about.css";
import BKOO2 from "./about-img/BKOO-2.jpg";
import BKOO3 from "./about-img/BKOO-3.jpg";
import BKOO4 from "./about-img/BKOO-4.jpg";
import BKOO8 from "./about-img/BKOO-8.jpg";
import BKOO6 from "./about-img/BKOO-6.jpg";

export default function About() {
  const { language } = useLanguage();

  return (
    <div className="about">
      <div className="about-start">
        <h2>{language === "sv" ? "Om oss" : "About us"}</h2>

        
      </div>

      <div className="about-boxes">
        <section className="about-row">
  <div className="about-text">

      <h2>Hej, jag är Marcel.</h2>

    <p>
      Jag är industridesigner och
      maskiningenjör med omkring 30 års erfarenhet från olika länder,
      branscher och projekt. Mina rötter finns i Nederländerna men sedan
      2007 är Sverige mitt hem.
    </p>

    <p>
      Vid sidan av mitt yrkesliv har det alltid funnits
      en annan passion att skapa unika och personliga produkter.
      I över 20 år har jag arbetat med att designa och tillverka personliga
      produkter från olika material och med olika tekniker. Det som länge
      varit en passion vid sidan av mitt övriga arbete tar nu nästa steg och
      blir en formell verksamhet. By Marcel är nytt som företag men
      erfarenheten, hantverket och idéerna bakom har vuxit fram under många år.
    </p>
  </div>

  <div className="about-image">
    <img src={BKOO8} alt="Marcel – By Marcel" />
  </div>
</section>

        <section className="about-row about-row-reverse">
  <div className="about-text">
    <h2>Det här är By Marcel.</h2>
    <p>
      
      En personlig verksamhet där design, hantverk och modern teknik möts.
      Det som började som ett kreativt sidoprojekt har idag vuxit till en
      professionell men fortfarande mycket personlig verksamhet.
    </p>

    <p>
      Jag gör det inte ensam utan tillsammans med min nära och kära utvecklar,
      designar och tillverkar vi produkter i liten skala med stor frihet att
      göra varje idé personlig. Jag delar min tid mellan Grythyttan och
      Göteborg med vår tillverkning i Grythyttan.
    </p>
  </div>

  <div className="about-image">
    <img src={BKOO6} alt="By Marcel verkstad" />
  </div>
</section>

        <section className="about-row">
  <div className="about-text">
    <p>
      Vi tar själv hand om hela processen från den första idén
      och designen till den färdiga produkten. Vi utgår från råmaterial som
      vi helt själva bearbetar. Med lasergravyr, storformatskrivare,
      textiltryck mm gör vi det själva. Det enda undantaget är våra
      produkter i äkta emalj. De tillverkas lokalt av en specialist med
      traditionella, gammaldags metoder och ett hantverkskunnande som uppbyggt
      upp under generationer. 
    </p>
  </div>

  <div className="about-image">
    <img src={BKOO4} alt="Tillverkning hos By Marcel" />
  </div>
</section>
<section className="about-row about-row-reverse">
  <div className="about-text">
    <p>
      Under hösten 2026 lanserar vi de första produkterna i
      webbutiken och mycket mer är på väg. By Marcel lanseras stegvis.
      Vi börjar med ett utvalt sortiment och låter verksamheten växa i takt
      med våra idéer. Flera nya och unika produkter är redan under utveckling
      och kommer att komma inom kort.
    </p>

    {/* <p>
      Vill du veta mer om materialen, teknikerna och arbetet bakom produkterna
      hittar du det under <strong>Bakom kulisserna</strong>.
    </p> */}

    <p>
      Om du inte hittar det du söker så gärna kontakta oss.
    </p>

    {/* <p>
      <strong>Upptäck mer från By Marcel!</strong> Prenumerera på vårt{" "}
      <strong>nyhetsbrev</strong> för nyheter, inspiration och exklusiva
      erbjudanden direkt i din inkorg.
    </p> */}

    <p>
      <strong>Välkommen till By Marcel</strong>
    </p>
  </div>

  <div className="about-image">
    <img src={BKOO3} alt="By Marcel" />
  </div>
</section>
      </div>

      {/* <div className="box-2">
        <div className="box-img">{language === "sv" ? "Bild" : "Image"}</div>

        <div className="box-text">
          {language === "sv" ? "Text om oss" : "Text about us"}
        </div>
      </div> */}

      <div className="img-boxes">
        <Link to="/akta-emalj" className="imgbox-1">
          <div className="imgbox-img"></div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Äkta Emalj" : "Genuine Enamel"}</h3>

            <p>
              {language === "sv"
                ? "Läs mer om äkta emalj och våra emaljskyltar."
                : "Learn more about genuine enamel and our enamel signs."}
            </p>
          </div>
        </Link>

        <div className="imgbox-2">
          <div className="imgbox-img"></div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Namn" : "Name"}</h3>

            <p>
              {language === "sv" ? "Kort beskrivning" : "Short description"}
            </p>
          </div>
        </div>

        <div className="imgbox-3">
          <div className="imgbox-img"></div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Namn" : "Name"}</h3>

            <p>
              {language === "sv" ? "Kort beskrivning" : "Short description"}
            </p>
          </div>
        </div>

        <div className="imgbox-4">
          <div className="imgbox-img"></div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Namn" : "Name"}</h3>

            <p>
              {language === "sv" ? "Kort beskrivning" : "Short description"}
            </p>
          </div>
        </div>

        <div className="imgbox-5">
          <div className="imgbox-img"></div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Namn" : "Name"}</h3>

            <p>
              {language === "sv" ? "Kort beskrivning" : "Short description"}
            </p>
          </div>
        </div>

        <div className="imgbox-6">
          <div className="imgbox-img"></div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Namn" : "Name"}</h3>

            <p>
              {language === "sv" ? "Kort beskrivning" : "Short description"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
