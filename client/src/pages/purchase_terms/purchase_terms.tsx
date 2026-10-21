import { useLanguage } from "../../context/languageContext";
import "./purchase_terms.css";

export default function PurchaseTerms() {
  const { language } = useLanguage();
  return language === "sv" ? (
    <main className="purchase-terms">
      <article className="purchase-terms__content">

        <header className="purchase-terms__header">
          <h1>Köpvillkor – By Marcel</h1>
          <p>Senast uppdaterad: 24 september 2026</p>
        </header>

        <p>
          Dessa köpvillkor gäller när du som konsument handlar produkter från
          By Marcel via vår webbutik. Genom att genomföra en beställning
          accepterar du dessa köpvillkor. Vi rekommenderar att du läser igenom
          villkoren innan du slutför ditt köp.
        </p>

        <section>
          <h2>1. Företagsinformation</h2>

          <p>
            <strong>Företag:</strong> Marcel Klaassen Development AB
            <br />
            <strong>Organisationsnummer:</strong> 559575-6296
            <br />
            <strong>VAT-nummer:</strong> SE559575629601
            <br />
            <strong>Särskilt företagsnamn:</strong> By Marcel
            <br />
            <strong>Adress:</strong> Gruvgatan 4 / 712 60 Grythyttan / Sverige
            <br />
            <strong>E-post:</strong> info@bymarcel.se
          </p>
        </section>

        <section>
          <h2>2. Leveransområde</h2>

          <p>By Marcel levererar till följande länder:</p>

          <p>
            <strong>Inom EU</strong>
          </p>

          <ul>
            <li>Danmark</li>
            <li>Finland</li>
            <li>Nederländerna</li>
            <li>Sverige</li>
            <li>Tyskland</li>
          </ul>

          <p>
            <strong>Utanför EU</strong>
          </p>

          <ul>
            <li>Island</li>
            <li>Norge</li>
          </ul>

          <p>
            Om du vill beställa leverans till ett annat land är du välkommen
            att kontakta oss före beställningen. Vi undersöker då om leverans
            är möjlig och återkommer med information om fraktkostnad,
            leveranstid och eventuella andra villkor.
          </p>

          <p>
            Tillgängliga leveransalternativ och aktuell fraktkostnad visas i
            kassan eller i samband med beställningen.
          </p>
        </section>

        <section>
          <h2>3. Priser</h2>

          <p>
            Alla priser i webbutiken anges i svenska kronor (SEK) och
            inkluderar svensk moms (25%), om inget annat uttryckligen anges.
            Eventuella kostnader för frakt och andra tillval visas innan
            beställningen slutförs.
          </p>

          <p>
            För leveranser till länder utanför EU, exempelvis Norge och Island,
            kan tull, importmoms och andra avgifter tillkomma enligt
            mottagarlandets regler. Sådana avgifter betalas normalt av kunden
            och ingår inte i By Marcels pris om inget annat uttryckligen anges
            vid beställningen.
          </p>
        </section>

        <section>
          <h2>4. Beställning</h2>

          <p>
            När du genomför en beställning får du en orderbekräftelse till den
            e-postadress som du har angett. Kontrollera alltid att uppgifterna i
            orderbekräftelsen är korrekta. Om något är fel ska du kontakta By
            Marcel så snart som möjligt. By Marcel förbehåller sig rätten att
            korrigera uppenbara skrivfel, prisfel och annan uppenbart felaktig
            information i webbutiken.
          </p>

          <p>
            Om vi inte kan genomföra en beställning kontaktar vi kunden och
            återbetalar eventuell redan genomförd betalning för den del av
            beställningen som inte kan levereras.
          </p>
        </section>

        <section>
          <h2>5. Specialtillverkade och personliga produkter</h2>

          <p>
            En stor del av By Marcels sortiment består av produkter som
            tillverkas individuellt för kunden. Det kan exempelvis vara
            produkter som tillverkas eller anpassas utifrån:
          </p>

          <ul>
            <li>Kundens fotografier eller andra bilder</li>
            <li>Namn eller annan personlig text</li>
            <li>Husnummer eller adress</li>
            <li>Egen design</li>
            <li>Logotyp eller företagsprofil</li>
            <li>Särskilda färger, mått eller utföranden</li>
            <li>Kundens övriga individuella önskemål</li>
          </ul>

          <p>
            När en produkt tillverkas enligt kundens anvisningar eller får en
            tydlig personlig prägel betraktas den som en
            specialtillverkad/personlig produkt.
          </p>
        </section>

        <section>
          <h2>6. Korrektur och kundens godkännande</h2>

          <p>
            För produkter där By Marcel tar fram en individuell design kan
            kunden få ett digitalt korrektur för godkännande före tillverkning.
            Kunden ansvarar för att noggrant kontrollera korrekturet, inklusive:
          </p>

          <ul>
            <li>Namn och stavning</li>
            <li>Datum och siffror</li>
            <li>Adresser och husnummer</li>
            <li>Bilder</li>
            <li>Placering</li>
            <li>Text</li>
            <li>Färgval</li>
            <li>Övriga individuella uppgifter</li>
          </ul>

          <p>
            När kunden har godkänt korrekturet betraktas designen som godkänd
            för produktion.
          </p>

          <p>
            Ändringar efter godkänt korrektur kan inte garanteras. Om
            produktionen ännu inte har påbörjats försöker vi naturligtvis hjälpa
            till men extra arbete kan medföra en ytterligare kostnad. Fel som
            fanns i ett korrektur som kunden uttryckligen har godkänt betraktas
            normalt inte som ett tillverkningsfel från By Marcels sida. Detta
            påverkar inte kundens rättigheter vid fel som By Marcel ansvarar för
            enligt tvingande konsumentlagstiftning.
          </p>
        </section>

        <section>
          <h2>7. Kundens bilder och annat material</h2>

          <p>
            När kunden skickar fotografier, bilder, logotyper, texter,
            illustrationer eller annat material till By Marcel ansvarar kunden
            för att kunden har rätt att använda materialet för den beställda
            produkten. Kunden ansvarar även för att nödvändiga tillstånd finns
            om materialet innehåller eller berör andra personer eller tredje
            parts rättigheter. By Marcel använder kundmaterial för att utforma
            och tillverka beställningen samt för nödvändig kommunikation och
            efterservice.
          </p>

          <p>
            Privata kundbilder används inte i By Marcels marknadsföring, sociala
            medier eller offentliga produktbilder utan kundens uttryckliga
            tillstånd.
          </p>

          <p>Läs även punkt 4 och 5 i vår integritetspolicy!</p>
        </section>

        <section>
          <h2>8. Material vi inte accepterar</h2>

          <p>
            By Marcel förbehåller sig rätten att avstå från att tillverka eller
            behandla en beställning om materialet är olagligt eller om det finns
            rimliga skäl att anta att användningen innebär intrång i någon
            annans rättigheter. Vi kan även avstå från beställningar med
            innehåll som exempelvis är hotfullt, grovt kränkande,
            diskriminerande, pornografiskt eller på annat sätt oförenligt med
            By Marcels värderingar, säkerhetskrav eller allmänna principer.
          </p>

          <p>
            Om vi avstår från en beställning informeras kunden så snart som
            möjligt. Redan erlagd betalning för en produkt som inte kommer att
            tillverkas återbetalas i tillämpliga fall.
          </p>

          <p>Läs även punkt 5 i vår integritetspolicy!</p>
        </section>

        <section>
          <h2>
            9. Ångerrätt och öppet köp – specialtillverkade produkter
          </h2>

          <p>
            Ångerrätt och öppet köp gäller inte för produkter som har
            tillverkats enligt kundens anvisningar eller som på annat sätt har
            fått en tydlig personlig prägel.
          </p>

          <p>Detta gäller exempelvis produkter med kundens:</p>

          <ul>
            <li>Fotografi eller bild</li>
            <li>Namn</li>
            <li>Personliga text</li>
            <li>Husnummer eller adress</li>
            <li>Logotyp</li>
            <li>Individuella design</li>
            <li>
              Individuellt valda mått eller annat särskilt kundanpassat
              utförande
            </li>
          </ul>

          <p>
            Undantaget från ångerrätten följer reglerna för distansavtal om
            varor som har tillverkats enligt konsumentens anvisningar eller som
            annars har fått en tydlig personlig prägel.
          </p>

          <p>
            Genom att beställa en sådan produkt är kunden införstådd med att den
            normala ångerrätten inte gäller för produkten. Att ångerrätten inte
            gäller påverkar inte kundens rätt att reklamera en produkt som är
            felaktig.
          </p>
        </section>

        <section>
          <h2>10. Ångerrätt för standardprodukter</h2>

          <p>
            Om By Marcel säljer en standardprodukt som inte har
            specialtillverkats eller anpassats för kunden gäller konsumentens
            lagstadgade ångerrätt vid distansköp. Ångerfristen är 14 dagar från
            den dag kunden tar emot varan. För att använda ångerrätten ska
            kunden meddela By Marcel inom ångerfristen.
          </p>

          <p>Kunden kan kontakta oss på E-post: info@bymarcel.se.</p>

          <p>
            Kunden kan även använda Konsumentverkets standardblankett för
            utövande av ångerrätt.
          </p>

          <p>
            Vid en giltig retur enligt ångerrätten ska produkten returneras utan
            onödigt dröjsmål och senast inom 14 dagar från det att kunden
            meddelade att ångerrätten används.
          </p>

          <p>
            Kunden står för den direkta kostnaden för returfrakten, om inget
            annat har avtalats.
          </p>

          <p>
            By Marcel återbetalar de betalningar som omfattas av ångerrätten
            enligt tillämplig lag. Vi kan under de förutsättningar som lagen
            medger avvakta med återbetalningen tills vi har fått tillbaka varan.
          </p>

          <p>
            Kunden får undersöka produkten på motsvarande sätt som i en fysisk
            butik. Om produkten har hanterats mer än vad som är nödvändigt för
            att fastställa dess egenskaper och funktion kan kunden bli ansvarig
            för produktens värdeminskning.
          </p>
        </section>

        <section>
          <h2>11. Avbeställning av specialtillverkad produkt</h2>

          <p>
            Kontakta By Marcel omedelbart om du vill avbeställa en
            specialtillverkad produkt.
          </p>

          <p>
            Om arbetet eller produktionen ännu inte har påbörjats försöker vi
            stoppa beställningen.
          </p>

          <p>
            Om arbete, design, materialberedning eller produktion redan har
            påbörjats kan By Marcel ha rätt till ersättning för kostnader och
            arbete som uppkommit till följd av beställningen och
            avbeställningen, i den utsträckning som följer av tillämplig lag.
            Att en produkt saknar ångerrätt innebär inte att kundens lagstadgade
            rätt att avbeställa en vara före leverans automatiskt försvinner.
          </p>
        </section>

        <section>
          <h2>12. Betalning</h2>

          <p>
            Tillgängliga betalningsalternativ visas i kassan. Betalningen kan
            hanteras av en extern betalningsleverantör. Betalningsleverantörens
            egna villkor kan då också gälla för själva betalningstjänsten. By
            Marcel lagrar normalt inte fullständiga kortuppgifter.
          </p>
        </section>

        <section>
          <h2>13. Produktion och leveranstid</h2>

          <p>
            Beräknad produktions- och leveranstid kan variera beroende på
            produkt, material, arbetsbelastning och leveransdestination.
          </p>

          <p>
            För specialtillverkade produkter börjar produktionstiden normalt
            räknas när nödvändigt kundmaterial har mottagits och, när korrektur
            används, efter att kunden har godkänt korrekturet.
          </p>

          <p>
            Eventuell beräknad leveranstid anges på produktsidan vid
            beställningen eller i kommunikationen med kunden.
            Specialtillverkade produkter kan ha längre leveranstid än
            standardprodukter.
          </p>
        </section>

        <section>
          <h2>14. Emaljprodukter</h2>

          <p>
            Vissa emaljprodukter tillverkas individuellt efter kundens
            beställning och kan därför ha längre produktionstid. När en
            emaljprodukt specialtillverkads enligt kundens anvisningar eller får
            en tydlig personlig prägel gäller undantaget från ångerrätten enligt
            punkt 8.
          </p>

          <p>
            Beräknad leveranstid anges i samband med produkten eller
            beställningen. Eventuella förseningar som vi får kännedom om
            kommuniceras till kunden så snart som möjligt.
          </p>
        </section>

        <section>
          <h2>15. Presentkort</h2>

          <p>
            Presentkort från By Marcel gäller i 3 år från inköpsdatum om inget
            annat anges på presentkortet.
          </p>

          <p>
            Presentkortet kan användas som betalning för produkter i By Marcels
            webbutik. Om ordervärdet överstiger presentkortets värde betalar
            kunden mellanskillnaden med något av de betalningsalternativ som
            erbjuds i kassan.
          </p>

          <p>
            Om hela presentkortets värde inte används vid ett köp finns
            eventuellt kvarvarande saldo kvar på presentkortet under den
            ursprungliga giltighetstiden förutsatt att webbutikens tekniska
            lösning stödjer detta.
          </p>

          <p>Presentkortet:</p>

          <ul>
            <li>Kan inte lösas in eller växlas mot kontanter</li>
            <li>Kan inte återbetalas kontant</li>
            <li>Gäller i 3 år från inköpsdatum</li>
            <li>Ska behandlas som en värdehandling</li>
          </ul>

          <p>
            Förlorade eller obehörigt använda presentkort eller
            presentkortskoder ersätts normalt inte, om inte annat följer av
            tvingande lag.
          </p>

          <p>
            Vid köp av en produkt med presentkort gäller By Marcels ordinarie
            köpvillkor för den aktuella produkten inklusive reglerna om
            ångerrätt för standardprodukter och undantaget från ångerrätt för
            specialtillverkade och personliga produkter.
          </p>
        </section>

        <section>
          <h2>16. Leverans och frakt</h2>

          <p>
            Tillgängliga leveransalternativ och aktuell fraktkostnad visas i
            kassan eller i samband med beställningen. Kunden ansvarar för att
            ange korrekt och fullständig leveransadress och korrekta
            kontaktuppgifter.
          </p>

          <p>
            Om en försändelse returneras till By Marcel på grund av felaktiga
            adressuppgifter, att kunden inte har hämtat ut försändelsen eller
            annan omständighet som kunden ansvarar för, kan kunden behöva betala
            kostnaden för en ny leverans och andra skäliga kostnader som
            uppstått i den utsträckning lagen tillåter.
          </p>
        </section>

        <section>
          <h2>17. Transportskador</h2>

          <p>
            Om ett paket eller en produkt är synligt skadad vid leveransen
            rekommenderar vi att kunden fotograferar:
          </p>

          <ul>
            <li>Ytteremballaget</li>
            <li>Transportetiketten</li>
            <li>Inneremballaget</li>
            <li>En skadade produkten</li>
          </ul>

          <p>
            Kontakta därefter By Marcel så snart som möjligt så att vi kan
            hjälpa till med ärendet.
          </p>

          <p>
            Att kunden inte fotograferar skadan eller kontaktar oss omedelbart
            innebär inte i sig att lagstadgade rättigheter vid fel i varan
            försvinner.
          </p>
        </section>

        <section>
          <h2>18. Reklamation</h2>

          <p>
            Om en produkt är felaktig har kunden rätt att reklamera enligt
            gällande svensk konsumentlagstiftning. En reklamation ska göras inom
            skälig tid efter att kunden märkt eller borde ha märkt felet. En
            reklamation som görs inom två månader från det att kunden märkte
            felet anses alltid ha gjorts i rätt tid.
          </p>

          <p>Kunden bör kontakta E-post: info@bymarcel.se</p>

          <p>
            Beskriv problemet och bifoga gärna fotografier som tydligt visar
            felet. Det hjälper oss att bedöma och lösa ärendet snabbare.
          </p>

          <p>
            Vid ett fel som By Marcel ansvarar för hanteras reklamationen enligt
            gällande konsumentlagstiftning. Beroende på omständigheterna kan det
            exempelvis bli aktuellt med avhjälpande, om leverans, prisavdrag
            eller hävning.
          </p>

          <p>
            Kundens lagstadgade reklamationsrätt begränsas inte av dessa
            köpevillkor.
          </p>
        </section>

        <section>
          <h2>19. Variationer i handgjorda och specialtillverkade produkter</h2>

          <p>
            Många av By Marcels produkter tillverkas individuellt och vissa
            moment kan utföras för hand.
          </p>

          <p>
            Mindre variationer i exempelvis färgton, struktur, gravyr, träets
            ådring, placering eller yta finish kan förekomma på grund av
            materialets naturliga egenskaper och tillverkningsmetoden.
          </p>

          <p>
            Bilder på webbplatsen är avsedda att ge en så rättvisande bild som
            möjligt. Färger kan dock återges något olika beroende på exempelvis
            skärm, skärminställningar och material. Sådana normala material- och
            tillverkningsvariationer utgör inte automatiskt ett fel i produkten.
          </p>

          <p>
            Detta begränsar inte kundens rättigheter om produkten faktiskt
            avviker från vad som har avtalats.
          </p>
        </section>

        <section>
          <h2>20. Bildkvalitet vid personliga produkter</h2>

          <p>
            Slutresultatet på produkter som tillverkas från kundens fotografier
            eller bilder påverkas av kvaliteten på det material som kunden
            skickar in.
          </p>

          <p>
            By Marcel kan bearbeta och anpassa materialet för den aktuella
            tillverkningsmetoden, exempelvis gravyr, tryck eller
            emaljproduktion. Om bildkvaliteten bedöms som otillräcklig kan vi
            kontakta kunden och be om en bättre bild.
          </p>

          <p>
            Ett godkänt korrektur visar designens huvudsakliga utformning. Det
            färdiga resultatet kan ändå skilja sig något från hur bilden visas
            på en digital skärm på grund av material och tillverkningsmetod.
          </p>
        </section>

        <section>
          <h2>21. Force majeure och omständigheter utanför vår kontroll</h2>

          <p>
            By Marcel ansvarar inte för förseningar eller bristande fullgörelse
            i den utsträckning detta beror på extraordinära omständigheter
            utanför vår rimliga kontroll och i den mån detta följer av
            tillämplig lag.
          </p>

          <p>
            Det kan exempelvis handla om allvarliga transportstörningar,
            naturkatastrofer, myndighetsbeslut, omfattande driftstörningar eller
            andra jämförbara händelser.
          </p>

          <p>
            Vi kontaktar kunden så snart som möjligt om en sådan situation
            påverkar en beställning.
          </p>
        </section>

        <section>
          <h2>22. Personuppgifter</h2>

          <p>
            By Marcel behandlar personuppgifter enligt vår Integritetspolicy.
          </p>

          <p>
            Information om användningen av cookies och liknande tekniker finns i
            vår Cookiepolicy.
          </p>
        </section>

        <section>
          <h2>23. Tvist</h2>

          <p>
            Vi hoppas alltid kunna lösa eventuella problem direkt tillsammans
            med kunden. Kontakta därför By Marcel i första hand om du inte är
            nöjd med en produkt eller hur ett ärende har hanterats.
          </p>

          <p>
            Om vi inte kan komma överens kan konsumenten vända sig till Allmänna
            reklamationsnämnden (ARN) för prövning, under förutsättning att
            ärendet uppfyller ARN:s krav. By Marcel följer svensk tvingande
            konsumentlagstiftning.
          </p>

          <p>Tvister kan även prövas av behörig domstol.</p>
        </section>

        <section>
          <h2>24. Ändringar av köpvillkoren</h2>

          <p>
            By Marcel kan uppdatera dessa köpevillkor när verksamheten,
            sortimentet eller gällande regler förändras. De villkor som gäller
            för en beställning är de villkor som var tillgängliga vid tidpunkten
            för köpet, om inte annat följer av tvingande lag. Den senaste
            versionen finns alltid publicerad på vår webbplats.
          </p>
        </section>

        <section>
          <h2>Kontakt</h2>

          <p>
            Har du frågor om hur By Marcel behandlar dina personuppgifter är du
            välkommen att kontakta oss.
          </p>

          <p>
            <strong>Företag:</strong> Marcel Klaassen Development AB
            <br />
            <strong>Organisationsnummer:</strong> 559575-6296
            <br />
            <strong>VAT-numret:</strong> SE559575629601
            <br />
            <strong>Särskilt företagsnamn:</strong> By Marcel
            <br />
            <strong>Adress:</strong> Gruvgatan 4 / 712 60 Grythyttan / Sverige
            <br />
            <strong>E-post:</strong> info@bymarcel.se
          </p>
        </section>

      </article>
    </main>
  
  ) : (
    <main className="purchase-terms">
      <article className="purchase-terms__content">
        <header className="purchase-terms__header">
          <h1>Purchase Terms – By Marcel</h1>
          <p>Last updated: 24 September 2026</p>
        </header>
        <p>These purchase terms apply when you, as a consumer, buy products from By Marcel through our online shop. By placing an order, you accept these purchase terms. We recommend that you read the terms before completing your purchase.</p>
        <section>
          <h2>1. Company information</h2>
          <p><strong>Company:</strong> Marcel Klaassen Development AB<br /><strong>Company registration number:</strong> 559575-6296<br /><strong>VAT number:</strong> SE559575629601<br /><strong>Registered business name:</strong> By Marcel<br /><strong>Address:</strong> Gruvgatan 4 / 712 60 Grythyttan / Sweden<br /><strong>Email:</strong> info@bymarcel.se</p>
        </section>
        <section>
          <h2>2. Delivery destinations</h2>
          <p>By Marcel delivers to the following countries:</p>
          <p><strong>Within the EU</strong></p>
          <ul><li>Denmark</li><li>Finland</li><li>Netherlands</li><li>Sweden</li><li>Germany</li></ul>
          <p><strong>Outside the EU</strong></p>
          <ul><li>Iceland</li><li>Norway</li></ul>
          <p>If you would like delivery to another country, please contact us before placing your order. We will check whether delivery is possible and provide information about shipping costs, delivery times and any other conditions.</p>
          <p>Available delivery options and current shipping costs are displayed at checkout or when placing the order.</p>
        </section>
        <section>
          <h2>3. Prices</h2>
          <p>All prices in the online shop are stated in Swedish kronor (SEK) and include Swedish VAT (25%), unless expressly stated otherwise. Any shipping costs and optional extras are displayed before the order is completed.</p>
          <p>For deliveries to countries outside the EU, such as Norway and Iceland, customs duties, import VAT and other charges may apply under the destination country’s rules. Such charges are normally paid by the customer and are not included in By Marcel’s price unless expressly stated otherwise when ordering.</p>
        </section>
        <section>
          <h2>4. Placing an order</h2>
          <p>When you place an order, an order confirmation is sent to the email address you provided. Always check that the information in the confirmation is correct. If anything is incorrect, contact By Marcel as soon as possible. By Marcel reserves the right to correct obvious typographical errors, pricing errors and other manifestly incorrect information in the online shop.</p>
          <p>If we cannot fulfil an order, we will contact the customer and refund any payment already made for the part of the order that cannot be delivered.</p>
        </section>
        <section>
          <h2>5. Custom-made and personalised products</h2>
          <p>A large part of By Marcel’s range consists of products made individually for customers. This may include products made or adapted using:</p>
          <ul><li>The customer’s photographs or other images</li><li>Names or other personalised text</li><li>House numbers or addresses</li><li>Original designs</li><li>Logos or corporate branding</li><li>Specific colours, dimensions or finishes</li><li>Other individual customer requests</li></ul>
          <p>When a product is made according to the customer’s instructions or has a clearly personalised character, it is considered a custom-made/personalised product.</p>
        </section>
        <section>
          <h2>6. Design proofs and customer approval</h2>
          <p>For products for which By Marcel creates an individual design, the customer may receive a digital proof for approval before production. The customer is responsible for carefully checking the proof, including:</p>
          <ul><li>Names and spelling</li><li>Dates and numbers</li><li>Addresses and house numbers</li><li>Images</li><li>Placement</li><li>Text</li><li>Colour choices</li><li>Other individual details</li></ul>
          <p>Once the customer has approved the proof, the design is considered approved for production.</p>
          <p>Changes after approval cannot be guaranteed. If production has not yet started, we will naturally try to help, but additional work may incur an extra charge. Errors present in a proof expressly approved by the customer are normally not regarded as manufacturing defects on By Marcel’s part. This does not affect the customer’s rights regarding defects for which By Marcel is responsible under mandatory consumer legislation.</p>
        </section>
        <section>
          <h2>7. Customer images and other materials</h2>
          <p>When the customer submits photographs, images, logos, texts, illustrations or other materials to By Marcel, the customer is responsible for having the right to use those materials for the ordered product. The customer is also responsible for obtaining any necessary permissions if the materials include or concern other people or third-party rights. By Marcel uses customer materials to design and manufacture the order and for necessary communication and after-sales service.</p>
          <p>Private customer images are not used in By Marcel’s marketing, social media or public product images without the customer’s express permission.</p>
          <p>Please also read sections 4 and 5 of our Privacy Policy!</p>
        </section>
        <section>
          <h2>8. Materials we do not accept</h2>
          <p>By Marcel reserves the right to decline to manufacture or process an order if the material is illegal or if there are reasonable grounds to believe its use would infringe someone else’s rights. We may also decline orders containing material that is, for example, threatening, seriously offensive, discriminatory, pornographic or otherwise incompatible with By Marcel’s values, safety requirements or general principles.</p>
          <p>If we decline an order, the customer will be informed as soon as possible. Payments already made for products that will not be manufactured will be refunded where applicable.</p>
          <p>Please also read section 5 of our Privacy Policy!</p>
        </section>
        <section>
          <h2>9. Right of withdrawal and voluntary returns – custom-made products</h2>
          <p>The right of withdrawal and voluntary returns do not apply to products made according to the customer’s instructions or otherwise given a clearly personalised character.</p>
          <p>This includes, for example, products featuring the customer’s:</p>
          <ul><li>Photograph or image</li><li>Name</li><li>Personalised text</li><li>House number or address</li><li>Logo</li><li>Individual design</li><li>Individually selected dimensions or other specially customised features</li></ul>
          <p>The exception to the right of withdrawal follows the rules on distance contracts for goods made according to the consumer’s specifications or otherwise clearly personalised.</p>
          <p>By ordering such a product, the customer acknowledges that the normal right of withdrawal does not apply to it. The absence of a right of withdrawal does not affect the customer’s right to complain about a defective product.</p>
        </section>
        <section>
          <h2>10. Right of withdrawal for standard products</h2>
          <p>If By Marcel sells a standard product that has not been custom-made or adapted for the customer, the consumer’s statutory right of withdrawal for distance purchases applies. The withdrawal period is 14 days from the day the customer receives the goods. To exercise this right, the customer must notify By Marcel within the withdrawal period.</p>
          <p>The customer can contact us by email at info@bymarcel.se.</p>
          <p>The customer may also use the Swedish Consumer Agency’s standard withdrawal form.</p>
          <p>For a valid return under the right of withdrawal, the product must be returned without undue delay and no later than 14 days after the customer notified us of the withdrawal.</p>
          <p>The customer pays the direct cost of return shipping unless otherwise agreed.</p>
          <p>By Marcel refunds payments covered by the right of withdrawal in accordance with applicable law. Where permitted by law, we may withhold the refund until we have received the goods back.</p>
          <p>The customer may inspect the product in the same way as in a physical shop. If the product has been handled beyond what is necessary to establish its characteristics and function, the customer may be responsible for any reduction in value.</p>
        </section>
        <section>
          <h2>11. Cancelling a custom-made product</h2>
          <p>Contact By Marcel immediately if you wish to cancel a custom-made product.</p>
          <p>If work or production has not yet begun, we will try to stop the order.</p>
          <p>If work, design, material preparation or production has already begun, By Marcel may be entitled to compensation for costs and work arising from the order and cancellation, to the extent permitted by applicable law. The fact that a product is exempt from the right of withdrawal does not automatically remove the customer’s statutory right to cancel an order for goods before delivery.</p>
        </section>
        <section>
          <h2>12. Payment</h2>
          <p>Available payment methods are displayed at checkout. Payment may be handled by an external payment provider, whose own terms may also apply to the payment service itself. By Marcel does not normally store complete card details.</p>
        </section>
        <section>
          <h2>13. Production and delivery times</h2>
          <p>Estimated production and delivery times may vary depending on the product, material, workload and delivery destination.</p>
          <p>For custom-made products, production time normally begins when the necessary customer materials have been received and, where proofs are used, after the customer has approved the proof.</p>
          <p>Any estimated delivery time is stated on the product page when ordering or in communication with the customer. Custom-made products may take longer to deliver than standard products.</p>
        </section>
        <section>
          <h2>14. Enamel products</h2>
          <p>Some enamel products are made individually to the customer’s order and may therefore require longer production times. When an enamel product is custom-made according to the customer’s instructions or has a clearly personalised character, the exception to the right of withdrawal applies as stated in section 8.</p>
          <p>Estimated delivery times are provided with the product or order. We communicate any delays of which we become aware to the customer as soon as possible.</p>
        </section>
        <section>
          <h2>15. Gift cards</h2>
          <p>By Marcel gift cards are valid for 3 years from the purchase date unless otherwise stated on the gift card.</p>
          <p>Gift cards can be used to pay for products in By Marcel’s online shop. If the order value exceeds the gift card value, the customer pays the difference using one of the payment methods offered at checkout.</p>
          <p>If the full value of the gift card is not used in one purchase, any remaining balance stays on the gift card for its original validity period, provided that the online shop’s technical solution supports this.</p>
          <p>The gift card:</p>
          <ul><li>Cannot be redeemed or exchanged for cash</li><li>Cannot be refunded in cash</li><li>Is valid for 3 years from the purchase date</li><li>Should be treated as a valuable document</li></ul>
          <p>Lost or unauthorisedly used gift cards or gift card codes are normally not replaced unless otherwise required by mandatory law.</p>
          <p>When purchasing a product with a gift card, By Marcel’s standard purchase terms apply to that product, including the rules on withdrawal for standard products and the exception for custom-made and personalised products.</p>
        </section>
        <section>
          <h2>16. Delivery and shipping</h2>
          <p>Available delivery options and current shipping costs are displayed at checkout or when ordering. The customer is responsible for providing a correct and complete delivery address and accurate contact details.</p>
          <p>If a shipment is returned to By Marcel because of an incorrect address, failure to collect the parcel or another circumstance for which the customer is responsible, the customer may need to pay for a new delivery and other reasonable costs incurred, to the extent permitted by law.</p>
        </section>
        <section>
          <h2>17. Shipping damage</h2>
          <p>If a parcel or product is visibly damaged on delivery, we recommend that the customer photographs:</p>
          <ul><li>The outer packaging</li><li>The shipping label</li><li>The inner packaging</li><li>The damaged product</li></ul>
          <p>Then contact By Marcel as soon as possible so we can help with the matter.</p>
          <p>Failure to photograph the damage or contact us immediately does not in itself remove the customer’s statutory rights concerning defective goods.</p>
        </section>
        <section>
          <h2>18. Complaints about defective products</h2>
          <p>If a product is defective, the customer has the right to make a complaint under applicable Swedish consumer legislation. A complaint must be made within a reasonable time after the customer noticed or should have noticed the defect. A complaint made within two months of noticing the defect is always considered to have been made in time.</p>
          <p>The customer should contact us by email at info@bymarcel.se.</p>
          <p>Describe the problem and preferably attach photographs clearly showing the defect. This helps us assess and resolve the matter more quickly.</p>
          <p>Where By Marcel is responsible for a defect, the complaint is handled in accordance with applicable consumer legislation. Depending on the circumstances, remedies may include repair, replacement delivery, a price reduction or cancellation of the purchase.</p>
          <p>These purchase terms do not limit the customer’s statutory right to complain about defective goods.</p>
        </section>
        <section>
          <h2>19. Variations in handmade and custom-made products</h2>
          <p>Many By Marcel products are individually manufactured, and some steps may be performed by hand.</p>
          <p>Minor variations in colour tone, texture, engraving, wood grain, placement or surface finish may occur due to the material’s natural properties and the manufacturing method.</p>
          <p>Images on the website are intended to provide as accurate a representation as possible. However, colours may appear slightly different depending on the screen, display settings and material. Such normal variations in materials and manufacturing do not automatically constitute a defect in the product.</p>
          <p>This does not limit the customer’s rights if the product actually differs from what was agreed.</p>
        </section>
        <section>
          <h2>20. Image quality for personalised products</h2>
          <p>The final result of products made from customer photographs or images is affected by the quality of the material submitted by the customer.</p>
          <p>By Marcel may edit and adapt the material for the relevant manufacturing method, such as engraving, printing or enamel production. If the image quality is considered insufficient, we may contact the customer and request a better image.</p>
          <p>An approved proof shows the main design. The finished result may nevertheless differ slightly from how the image appears on a digital screen due to the material and manufacturing method.</p>
        </section>
        <section>
          <h2>21. Force majeure and circumstances beyond our control</h2>
          <p>By Marcel is not responsible for delays or failure to perform to the extent caused by extraordinary circumstances beyond our reasonable control and insofar as permitted by applicable law.</p>
          <p>Examples include serious transport disruptions, natural disasters, government decisions, major operational disruptions or other comparable events.</p>
          <p>We contact the customer as soon as possible if such a situation affects an order.</p>
        </section>
        <section>
          <h2>22. Personal data</h2>
          <p>By Marcel processes personal data in accordance with our Privacy Policy.</p>
          <p>Information about the use of cookies and similar technologies can be found in our Cookie Policy.</p>
        </section>
        <section>
          <h2>23. Disputes</h2>
          <p>We always hope to resolve any problems directly with the customer. Please contact By Marcel first if you are dissatisfied with a product or how a matter has been handled.</p>
          <p>If we cannot reach an agreement, the consumer may refer the matter to the Swedish National Board for Consumer Disputes (ARN), provided the case meets ARN’s requirements. By Marcel complies with mandatory Swedish consumer legislation.</p>
          <p>Disputes may also be heard by a court of competent jurisdiction.</p>
        </section>
        <section>
          <h2>24. Changes to the purchase terms</h2>
          <p>By Marcel may update these purchase terms when the business, product range or applicable regulations change. The terms applicable to an order are those available at the time of purchase, unless otherwise required by mandatory law. The latest version is always published on our website.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>If you have any questions about how By Marcel processes your personal data, please feel free to contact us.</p>
          <p><strong>Company:</strong> Marcel Klaassen Development AB<br /><strong>Company registration number:</strong> 559575-6296<br /><strong>VAT number:</strong> SE559575629601<br /><strong>Registered business name:</strong> By Marcel<br /><strong>Address:</strong> Gruvgatan 4 / 712 60 Grythyttan / Sweden<br /><strong>Email:</strong> info@bymarcel.se</p>
        </section>
      </article>
    </main>
  );
}
