
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/languageContext";
import "./about.css";

import aboutpic from "./about-img/aboutpic.jpeg";
import BKOO5 from "./about-img/BKOO-5.jpeg";
import BKOO8 from "./about-img/BKOO-8.jpg";
import BKOO6 from "./about-img/BKOO-6.jpg";
import äktaemalj from "./boxes/boxes-img/äktaemalj.jpg";
import bildgravyr1 from "./boxes/boxes-img/bildgravyr1.jpeg";
import grafiskDesignImage from "./boxes/grafisk-img/BKGD.jpg";

export default function About() {
  const { language } = useLanguage();

  return (
    <div className="about">
      <div className="about-start">
        <h2>{language === "sv" ? "Om oss" : "About us"}</h2>
      </div>

      {/* BAKOM KULISSERNA */}

      <div className="img-boxes">
        <Link to="/akta-emalj" className="imgbox-1">
          <div className="imgbox-img">
            <img
              src={äktaemalj}
              alt={language === "sv" ? "Äkta emalj" : "Genuine enamel"}
            />
          </div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Äkta Emalj" : "Genuine Enamel"}</h3>

            <p>
              {language === "sv"
                ? "Läs mer om äkta emalj och våra emaljskyltar."
                : "Learn more about genuine enamel and our enamel signs."}
            </p>
          </div>
        </Link>

        <Link to="/bildgravyr-info" className="imgbox-2">
          <div className="imgbox-img">
            <img
              src={bildgravyr1}
              alt={language === "sv" ? "Bildgravyr" : "Photo engraving"}
            />
          </div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Bildgravyr" : "Photo engraving"}</h3>

            <p>
              {language === "sv"
                ? "Läs mer om bildgravyr på trä."
                : "Learn more about photo engraving on wood."}
            </p>
          </div>
        </Link>

        <Link to="/grafisk-design" className="imgbox-3">
          <div className="imgbox-img">
            <img
              src={grafiskDesignImage}
              alt={language === "sv" ? "Grafisk design" : "Graphic design"}
            />
          </div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Grafisk design" : "Graphic design"}</h3>

            <p>
              {language === "sv"
                ? "Läs mer om vår grafiska design, bildredigering och personliga service."
                : "Learn more about our graphic design, photo editing and personalised service."}
            </p>
          </div>
        </Link>

        <Link to="/tragravyr" className="imgbox-4">
          <div className="imgbox-img">
            {/* Här lägger vi in huvudbilden senare */}
          </div>

          <div className="imgbox-info">
            <h3>{language === "sv" ? "Trägravyr" : "Wood engraving"}</h3>

            <p>
              {language === "sv"
                ? "Läs mer om våra olika material för bildgravyr och hur de påverkar resultatet."
                : "Learn more about our different photo engraving materials and how they affect the final result."}
            </p>
          </div>
        </Link>

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

      {/* OM MARCEL OCH BY MARCEL */}

      <div className="about-boxes">
        <section className="about-row">
          <div className="about-text">
            <h2>
              {language === "sv"
                ? "Hej, jag är Marcel."
                : "Hi, I'm Marcel."}
            </h2>

            <p>
              {language === "sv"
                ? "Jag är industridesigner och maskiningenjör med omkring 30 års erfarenhet från olika länder, branscher och projekt. Mina rötter finns i Nederländerna men sedan 2007 är Sverige mitt hem."
                : "I'm an industrial designer and mechanical engineer with around 30 years of experience across different countries, industries and projects. My roots are in the Netherlands, but Sweden has been my home since 2007."}
            </p>

            <p>
              {language === "sv"
                ? "Vid sidan av mitt yrkesliv har det alltid funnits en annan passion att skapa unika och personliga produkter. I över 20 år har jag arbetat med att designa och tillverka personliga produkter från olika material och med olika tekniker. Det som länge varit en passion vid sidan av mitt övriga arbete tar nu nästa steg och blir en formell verksamhet. By Marcel är nytt som företag men erfarenheten, hantverket och idéerna bakom har vuxit fram under många år."
                : "Alongside my professional career, I've always had another passion: creating unique and personalised products. For more than 20 years, I've been designing and making personalised products using different materials and techniques. What has long been a passion alongside my other work is now taking the next step and becoming an established business. By Marcel is a new company, but the experience, craftsmanship and ideas behind it have developed over many years."}
            </p>
          </div>

          <div className="about-image">
            <img src={BKOO8} alt="Marcel – By Marcel" />
          </div>
        </section>

        <section className="about-row about-row-reverse">
          <div className="about-text">
            <h2>
              {language === "sv"
                ? "Det här är By Marcel."
                : "This is By Marcel."}
            </h2>

            <p>
              {language === "sv"
                ? "En personlig verksamhet där design, hantverk och modern teknik möts. Det som började som ett kreativt sidoprojekt har idag vuxit till en professionell men fortfarande mycket personlig verksamhet."
                : "A personal business where design, craftsmanship and modern technology come together. What began as a creative side project has grown into a professional business while remaining deeply personal."}
            </p>

            <p>
              {language === "sv"
                ? "Jag gör det inte ensam utan tillsammans med min nära och kära utvecklar, designar och tillverkar vi produkter i liten skala med stor frihet att göra varje idé personlig. Jag delar min tid mellan Grythyttan och Göteborg med vår tillverkning i Grythyttan."
                : "I don't do it alone. Together with my loved ones, we develop, design and manufacture products on a small scale, giving us the freedom to make every idea personal. I divide my time between Grythyttan and Gothenburg, with our production based in Grythyttan."}
            </p>
          </div>

          <div className="about-image">
            <img
              src={BKOO6}
              alt={
                language === "sv"
                  ? "By Marcel verkstad"
                  : "By Marcel workshop"
              }
            />
          </div>
        </section>

        <section className="about-row">
          <div className="about-text">
            <p>
              {language === "sv"
                ? "Vi tar själv hand om hela processen från den första idén och designen till den färdiga produkten. Vi utgår från råmaterial som vi helt själva bearbetar. Med lasergravyr, storformatskrivare, textiltryck mm gör vi det själva. Det enda undantaget är våra produkter i äkta emalj. De tillverkas lokalt av en specialist med traditionella, gammaldags metoder och ett hantverkskunnande som uppbyggt upp under generationer."
                : "We take care of the entire process ourselves, from the initial idea and design to the finished product. We start with raw materials that we process entirely in-house. Using laser engraving, large-format printing, textile printing and other techniques, we create our products ourselves. The only exception is our genuine enamel products. These are produced locally by a specialist using traditional, time-honoured methods and craftsmanship developed over generations."}
            </p>
          </div>

          <div className="about-image">
            <img
              src={BKOO5}
              alt={
                language === "sv"
                  ? "Tillverkning hos By Marcel"
                  : "Production at By Marcel"
              }
            />
          </div>
        </section>

        <section className="about-row about-row-reverse">
          <div className="about-text">
            <p>
              {language === "sv"
                ? "Under hösten 2026 lanserar vi de första produkterna i webbutiken och mycket mer är på väg. By Marcel lanseras stegvis. Vi börjar med ett utvalt sortiment och låter verksamheten växa i takt med våra idéer. Flera nya och unika produkter är redan under utveckling och kommer att komma inom kort."
                : "During autumn 2026, we're launching the first products in our online shop, with much more to come. By Marcel is being launched in stages. We're starting with a carefully selected range and allowing the business to grow alongside our ideas. Several new and unique products are already in development and will be available soon."}
            </p>

            <p>
              {language === "sv"
                ? "Om du inte hittar det du söker så gärna kontakta oss."
                : "If you can't find what you're looking for, please feel free to contact us."}
            </p>

            <p>
              <strong>
                {language === "sv"
                  ? "Välkommen till By Marcel"
                  : "Welcome to By Marcel"}
              </strong>
            </p>
          </div>

          <div className="about-image">
            <img src={aboutpic} alt="By Marcel" />
          </div>
        </section>
      </div>
    </div>
  );
}
