import { Link } from "react-router-dom";
import { useLanguage } from "../../context/languageContext";
import "./about.css";

export default function About() {
  const { language } = useLanguage();

  return (
    <div className="about">
      <div className="about-start">
        <h2>{language === "sv" ? "Om oss" : "About us"}</h2>

        <p>
          {language === "sv"
            ? "Kort textsnutt om Om oss sidan"
            : "Short introduction to the About us page"}
        </p>
      </div>

      <div className="about-boxes">
        <div className="box-1">
          <div className="box-img">{language === "sv" ? "Bild" : "Image"}</div>

          <div className="box-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Necessitatibus distinctio unde quis, illum odit consequuntur
            doloremque, velit ea, saepe inventore nulla facilis quia?
            Voluptatibus non molestias rerum ut, ipsam nobis?
          </div>
        </div>

        <div className="box-2">
          <div className="box-img">{language === "sv" ? "Bild" : "Image"}</div>

          <div className="box-text">
            {language === "sv" ? "Text om oss" : "Text about us"}
          </div>
        </div>
      </div>

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
