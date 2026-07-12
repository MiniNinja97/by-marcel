import './home.css';
import logo from '../../assets/logo.png'


export default function Home () {

    return (
        <div className="home">
            <div className="hero" id="hero">
                 <div className="hero-slides">
        <div className="hero-slide slide-1"></div>
        <div className="hero-slide slide-2"></div>
        <div className="hero-slide slide-3"></div>
    </div>

    <div className="hero-overlay"></div>
                <div className="hero-content" id="hero-content"> 

                    

                    <div className="logo">
                        <img src={logo} alt="By Marcel" />
                    </div>

                    <div className="hero_content">

                    <div className="hero-text">
                        <h2>Handgjorda produkter * Tillverkat i Sverige</h2>

                </div>

                <button className="hero-button" id="hero-button">Utforska sortimentet</button>

                </div>
                </div>
            </div>

            <div className="home-content" id="home-content"> 

                <div className="home-content-top" id="home-content-top"> 
                    <h3 id="home-content-title">Home Content</h3>
                    <h2>Handplockat åt dig</h2>

                    <div className="tripple-btn" id="tripple-btn">
                        <button className="tripple-btn-item" id="tripple-btn-item">Utvalda</button>
                        <button className="tripple-btn-item" id="tripple-btn-item">Nyheter</button>
                        <button className="tripple-btn-item" id="tripple-btn-item">Säsong</button>
                    </div>
                </div>
                <div className="product-cards" id="product-cards">
                    <div className="product-card1" id="product-card1">
                        <img/>
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                        <div/>
                    </div>
                    <div className="product-card2" id="product-card2">
                        <img/>
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                        <div/>
                    </div>
                    <div className="product-card3" id="product-card3">
                        <img/>
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                        <div/>
                    </div>
                </div>
                <div className="devider"> </div>
                <div className="home-content-bottom" id="home-content-bottom">
                    <h2> Gör det personligt</h2>
                    <div className="product-card-bottom">
                        <img/>
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                        <div/>
                    </div>
                    <div className="product-card-bottom">
                        <img/>
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                        <div/>
                    </div><div className="product-card-bottom">
                        <img/>
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                        <div/>
                    </div><div className="product-card-bottom">
                        <img/>
                        <h2>Produktnamn</h2>
                        <p>Produktbeskrivning</p>
                        <p>Pris</p>
                        <div/>
                    </div>
                </div>

            </div>
        </div>
    )
}