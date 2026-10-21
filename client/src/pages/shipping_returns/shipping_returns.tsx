import { useLanguage } from "../../context/languageContext";
import "./shipping_returns.css";

export default function ShippingReturns() {
    const { language } = useLanguage();
    return (
        <main className="shipping-returns">
            <article className="shipping-returns__content">

                <header className="shipping-returns__header">
                    <h1>{language === "sv" ? "Leverans, retur & reklamation" : "Shipping, returns & complaints" }</h1>
                    <p>{language === "sv" ? "Senast uppdaterad: 5 september 2026" : "Last updated: 5 September 2026" }</p>
                </header>

                <p>{language === "sv" ? "Här hittar du information om leveranser, returer och reklamationer när du handlar hos By Marcel. Eftersom en stor del av vårt sortiment tillverkas personligen för varje kund gäller särskilda regler för specialtillverkade och personliga produkter." : "Here you can find information about deliveries, returns and complaints when shopping at By Marcel. As a large part of our range is made individually for each customer, special rules apply to custom-made and personalised products." }</p>


                <section>
                    <h2>{language === "sv" ? "1. Leveransområde" : "1. Delivery destinations" }</h2>

                    <p>{language === "sv" ? "By Marcel levererar inom Sverige samt till utvalda länder i Europa." : "By Marcel delivers within Sweden and to selected countries in Europe." }</p>

                    <p>{language === "sv" ? "Vilka leveransalternativ som är tillgängliga och aktuell fraktkostnad visas i webbutikens kassa." : "Available delivery options and current shipping costs are displayed at checkout." }</p>

                    <p>{language === "sv" ? "För leveranser utanför EU, exempelvis till Norge och Island, kan importmoms, tull och andra avgifter tillkomma enligt mottagarlandets regler. Sådana avgifter betalas normalt av mottagaren om inget annat uttryckligen anges vid beställningen." : "For deliveries outside the EU, such as to Norway and Iceland, import VAT, customs duties and other charges may apply under the destination country's rules. Such charges are normally paid by the recipient unless explicitly stated otherwise when ordering." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "2. Leveranstid" : "2. Delivery times" }</h2>

                    <p>{language === "sv" ? "Leveranstiden varierar beroende på vilken produkt du beställer och om produkten finns i lager eller tillverkas speciellt för dig. Beräknad produktions- eller leveranstid anges på respektive produktsida eller i samband med beställningen." : "Delivery times vary depending on the product you order and whether it is in stock or made especially for you. Estimated production or delivery times are stated on the relevant product page or when placing the order." }</p>

                    <p><strong>{language === "sv" ? "Standardprodukter" : "Standard products" }</strong></p>

                    <p>{language === "sv" ? "Produkter som finns färdiga i lager skickas normalt så snart som möjligt efter mottagen beställning och betalning." : "Products available in stock are normally dispatched as soon as possible after we receive the order and payment." }</p>

                    <p><strong>{language === "sv" ? "Specialtillverkade produkter" : "Custom-made products" }</strong></p>

                    <p>{language === "sv" ? "Personliga produkter börjar normalt produceras när vi har fått det material som behövs från kunden och, när korrektur används, efter att kunden har godkänt korrekturet." : "Production of personalised products normally begins once we have received the necessary materials from the customer and, where a proof is used, after the customer has approved it." }</p>

                    <p>{language === "sv" ? "Produktionstiden varierar beroende på produkt, material och tillverkningsmetod." : "Production times vary depending on the product, material and manufacturing method." }</p>

                    <p><strong>{language === "sv" ? "Specialtillverkade emaljprodukter" : "Custom-made enamel products" }</strong></p>

                    <p>{language === "sv" ? "Personliga emaljprodukter har en längre tillverkningsprocess eftersom produkterna tillverkas individuellt och går igenom flera produktionssteg." : "Personalised enamel products have a longer manufacturing process because each item is made individually and passes through several production stages." }</p>

                    <p>{language === "sv" ? "Aktuell beräknad leveranstid anges på produktsidan eller i samband med beställningen." : "The current estimated delivery time is stated on the product page or when placing the order." }</p>

                    <p>{language === "sv" ? "Observera att angiven leveranstid normalt är en uppskattning och kan påverkas av exempelvis produktion, materialtillgång och transport." : "Please note that the stated delivery time is normally an estimate and may be affected by production, material availability and transport." }</p>

                    <p>{language === "sv" ? "Om vi får kännedom om en väsentlig försening kontaktar vi dig så snart som möjligt." : "If we become aware of a significant delay, we will contact you as soon as possible." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "3. Fraktkostnad" : "3. Shipping costs" }</h2>

                    <p>{language === "sv" ? "Fraktkostnaden beräknas utifrån bland annat destination, produktens vikt och storlek samt valt leveransalternativ. Den aktuella fraktkostnaden visas i kassan innan du genomför köpet." : "Shipping costs are calculated based on factors including destination, product weight and dimensions, and the selected delivery option. The current shipping cost is shown at checkout before you complete your purchase." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "4. Leverans och transport" : "4. Delivery and transport" }</h2>

                    <p>{language === "sv" ? "Vi använder lämplig transportör beroende på produkt, destination, vikt och storlek." : "We use a suitable carrier depending on the product, destination, weight and dimensions." }</p>

                    <p>{language === "sv" ? "När spårbar leverans används får du normalt information som gör det möjligt att följa försändelsen." : "When tracked delivery is used, you will normally receive information enabling you to track the shipment." }</p>

                    <p>{language === "sv" ? "Kunden ansvarar för att namn, leveransadress, telefonnummer och övriga kontaktuppgifter som anges vid beställningen är korrekta." : "The customer is responsible for ensuring that the name, delivery address, telephone number and other contact details provided when ordering are correct." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "5. Ej uthämtade eller returnerade paket" : "5. Uncollected or returned parcels" }</h2>

                    <p>{language === "sv" ? "Kunden ansvarar för att hämta ut eller ta emot sin försändelse inom transportörens angivna tid. Om ett paket returneras till By Marcel på grund av att det inte hämtats ut, att leverans inte kunnat genomföras på grund av omständigheter som kunden ansvarar för eller att felaktiga adressuppgifter har lämnats, kan kunden behöva betala kostnaden för en ny leverans samt andra skäliga kostnader som uppstått." : "The customer is responsible for collecting or receiving their shipment within the period specified by the carrier. If a parcel is returned to By Marcel because it was not collected, delivery could not be completed due to circumstances for which the customer is responsible, or incorrect address details were provided, the customer may have to pay for redelivery and other reasonable costs incurred." }</p>

                    <p>{language === "sv" ? "Ett ej uthämtat paket räknas inte automatiskt som att kunden har använt sin ångerrätt." : "An uncollected parcel does not automatically mean that the customer has exercised their right of withdrawal." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "6. Transportskador" : "6. Damage in transit" }</h2>

                    <p>{language === "sv" ? "Vi packar våra produkter omsorgsfullt för att minimera risken för skador under transport." : "We carefully package our products to minimise the risk of damage during transport." }</p>

                    <p>{language === "sv" ? "Om paketet eller produkten har skadats under transporten ber vi dig kontakta By Marcel så snart som möjligt." : "If the parcel or product has been damaged in transit, please contact By Marcel as soon as possible." }</p>

                    <p>{language === "sv" ? "Fotografera gärna:" : "Please photograph:" }</p>

                    <ul>
                        <li>{language === "sv" ? "Ytteremballaget" : "The outer packaging" }</li>
                        <li>{language === "sv" ? "Transportetiketten" : "The shipping label" }</li>
                        <li>{language === "sv" ? "Inneremballaget" : "The inner packaging" }</li>
                        <li>{language === "sv" ? "Eventuell skada på produkten" : "Any damage to the product" }</li>
                    </ul>

                    <p>{language === "sv" ? "Spara även emballaget tills ärendet är löst." : "Please also keep the packaging until the matter has been resolved." }</p>

                    <p>{language === "sv" ? "Bilderna hjälper oss att snabbt bedöma skadan och hantera ärendet med transportören." : "The photographs help us assess the damage quickly and handle the matter with the carrier." }</p>

                    <p>{language === "sv" ? "Att du inte fotograferar skadan eller kontaktar oss omedelbart innebär dock inte i sig att dina lagstadgade rättigheter försvinner." : "However, failing to photograph the damage or contact us immediately does not in itself mean that you lose your statutory rights." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "7. Ångerrätt och retur för standardprodukter" : "7. Right of withdrawal and returns for standard products" }</h2>

                    <p>{language === "sv" ? "För standardprodukter som inte har tillverkats eller anpassats speciellt för kunden gäller normalt 14 dagars lagstadgad ångerrätt vid distansköp. Ångerfristen börjar normalt löpa den dag du tar emot produkten." : "For standard products that have not been manufactured or adapted specifically for the customer, a statutory 14-day right of withdrawal normally applies to distance purchases. The withdrawal period normally begins on the day you receive the product." }</p>

                    <p>{language === "sv" ? "Om du vill använda ångerrätten ska du meddela By Marcel inom ångerfristen:" : "If you wish to exercise your right of withdrawal, you must notify By Marcel within the withdrawal period:" }</p>

                    <p><strong>{language === "sv" ? "E-post:" : "Email:" }</strong> info@bymarcel.se</p>

                    <p>{language === "sv" ? "Meddelandet bör innehålla ditt namn, ordernummer och information om vilken produkt du vill returnera. Du kan även använda Konsumentverkets standardblankett för ångerrätt." : "Your message should include your name, order number and information about the product you wish to return. You may also use the Swedish Consumer Agency's standard withdrawal form." }</p>

                    <p>{language === "sv" ? "Efter att du meddelat oss ska produkten returneras utan onödigt dröjsmål och senast inom 14 dagar från ditt meddelande om att du vill använda ångerrätten." : "After notifying us, you must return the product without undue delay and no later than 14 days after notifying us of your decision to withdraw." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "8. Returkostnad" : "8. Return shipping costs" }</h2>

                    <p>{language === "sv" ? "Vid användning av den lagstadgade ångerrätten står kunden för den direkta kostnaden för returfrakten, om inget annat har avtalats." : "When exercising the statutory right of withdrawal, the customer pays the direct cost of return shipping unless otherwise agreed." }</p>

                    <p>{language === "sv" ? "Produkten ska förpackas på ett lämpligt och säkert sätt för returtransporten." : "The product must be packaged appropriately and securely for return transport." }</p>

                    <p>{language === "sv" ? "Kontakta gärna By Marcel innan du skickar tillbaka produkten så att vi kan ge dig rätt returinformation." : "Please contact By Marcel before returning the product so that we can provide the correct return instructions." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "9. Produktens skick vid retur" : "9. Condition of the product upon return" }</h2>

                    <p>{language === "sv" ? "Du har rätt att undersöka en standardprodukt på ungefär samma sätt som du skulle kunna göra i en fysisk butik. Om produkten har använts eller hanterats mer än vad som är nödvändigt för att fastställa dess egenskaper och funktion kan du bli ansvarig för produktens värdeminskning." : "You have the right to examine a standard product in approximately the same way as you would in a physical shop. If the product has been used or handled more than necessary to establish its characteristics and function, you may be responsible for any reduction in its value." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "10. Återbetalning vid ångerrätt" : "10. Refunds under the right of withdrawal" }</h2>

                    <p>{language === "sv" ? "Vid en giltig användning av ångerrätten återbetalar By Marcel de betalningar som ska återbetalas enligt gällande lag." : "When the right of withdrawal is validly exercised, By Marcel refunds the payments that must be refunded under applicable law." }</p>

                    <p>{language === "sv" ? "Återbetalningen sker normalt med samma betalningsmetod som användes vid köpet, om inget annat överenskommits." : "Refunds are normally made using the same payment method used for the purchase, unless otherwise agreed." }</p>

                    <p>{language === "sv" ? "Vi kan, under de förutsättningar som lagen medger, avvakta med återbetalningen tills vi har fått tillbaka produkten." : "Where permitted by law, we may withhold the refund until we have received the product back." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "11. Ingen ångerrätt för specialtillverkade produkter" : "11. No right of withdrawal for custom-made products" }</h2>

                    <p>{language === "sv" ? "Ångerrätten gäller inte för produkter som har tillverkats enligt kundens anvisningar eller som på annat sätt har fått en tydlig personlig prägel." : "The right of withdrawal does not apply to products manufactured according to the customer's instructions or otherwise clearly personalised." }</p>

                    <p>{language === "sv" ? "Det gäller exempelvis produkter som tillverkas med:" : "This includes, for example, products made with:" }</p>

                    <ul>
                        <li>{language === "sv" ? "Kundens fotografi eller bild" : "The customer's photograph or image" }</li>
                        <li>{language === "sv" ? "Namn" : "Names" }</li>
                        <li>{language === "sv" ? "Egen text" : "Custom text" }</li>
                        <li>{language === "sv" ? "Husnummer eller adress" : "House numbers or addresses" }</li>
                        <li>{language === "sv" ? "Logotyp" : "Logos" }</li>
                        <li>{language === "sv" ? "Individuell design" : "Individual designs" }</li>
                        <li>{language === "sv" ? "Särskilt kundanpassade mått eller utförande" : "Specially customised dimensions or finishes" }</li>
                        <li>{language === "sv" ? "Andra personliga anpassningar" : "Other personal customisations" }</li>
                    </ul>

                    <p>{language === "sv" ? "Detta innebär att en sådan produkt normalt inte kan returneras enbart på grund av att kunden har ändrat sig. Detta undantag påverkar inte kundens rätt att reklamera en produkt som är felaktig." : "This means that such a product normally cannot be returned solely because the customer has changed their mind. This exception does not affect the customer's right to complain about a defective product." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "12. Avbeställning av specialtillverkade produkter" : "12. Cancelling custom-made products" }</h2>

                    <p>{language === "sv" ? "Om du vill avbeställa en specialtillverkad produkt ska du kontakta By Marcel så snabbt som möjligt." : "If you wish to cancel a custom-made product, contact By Marcel as quickly as possible." }</p>

                    <p>{language === "sv" ? "Om design eller produktion ännu inte har påbörjats försöker vi stoppa beställningen." : "If design or production has not yet begun, we will try to stop the order." }</p>

                    <p>{language === "sv" ? "Om arbete eller produktion redan har påbörjats kan By Marcel ha rätt till ersättning för arbete, material och andra kostnader som uppstått till följd av beställningen och avbeställningen, i den utsträckning som följer av tillämplig lag." : "If work or production has already begun, By Marcel may be entitled to compensation for work, materials and other costs arising from the order and cancellation, to the extent permitted by applicable law." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "13. Reklamation" : "13. Complaints about defective products" }</h2>

                    <p>{language === "sv" ? "Om en produkt är felaktig har du rätt att reklamera den enligt svensk konsumentlagstiftning." : "If a product is defective, you have the right to make a complaint under Swedish consumer law." }</p>

                    <p>{language === "sv" ? "Det gäller både standardprodukter och specialtillverkade/personliga produkter." : "This applies to both standard products and custom-made or personalised products." }</p>

                    <p><strong>{language === "sv" ? "Kontakta:" : "Contact:" }</strong> info@bymarcel.se</p>

                    <p>{language === "sv" ? "Ange gärna:" : "Please provide:" }</p>

                    <ul>
                        <li>{language === "sv" ? "Namn" : "Name" }</li>
                        <li>{language === "sv" ? "Ordernummer" : "Order number" }</li>
                        <li>{language === "sv" ? "Vilken produkt reklamationen gäller" : "The product the complaint concerns" }</li>
                        <li>{language === "sv" ? "En kort beskrivning av problemet" : "A brief description of the problem" }</li>
                        <li>{language === "sv" ? "Fotografier som tydligt visar felet, när det är möjligt" : "Photographs clearly showing the defect, where possible" }</li>
                    </ul>

                    <p>{language === "sv" ? "Det gör att vi kan bedöma och lösa ärendet snabbare." : "This helps us assess and resolve the matter more quickly." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "14. När ska en reklamation göras?" : "14. When should a complaint be made?" }</h2>

                    <p>{language === "sv" ? "En reklamation ska göras inom skälig tid efter att du upptäckt eller borde ha upptäckt felet. En reklamation som görs inom två månader från det att du upptäckte felet anses alltid ha gjorts inom skälig tid." : "A complaint must be made within a reasonable time after you discovered or should have discovered the defect. A complaint made within two months of discovering the defect is always considered to have been made within a reasonable time." }</p>

                    <p>{language === "sv" ? "Enligt svensk konsumentlagstiftning kan en vara normalt reklameras för ursprungliga fel i upp till tre år från det att du tog emot varan." : "Under Swedish consumer law, a product can normally be the subject of a complaint concerning an original defect for up to three years from the date you received it." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "15. Vad händer vid en godkänd reklamation?" : "15. What happens when a complaint is accepted?" }</h2>

                    <p>{language === "sv" ? "Om produkten har ett fel som By Marcel ansvarar för hanterar vi reklamationen enligt gällande konsumentlagstiftning." : "If the product has a defect for which By Marcel is responsible, we handle the complaint in accordance with applicable consumer law." }</p>

                    <p>{language === "sv" ? "Beroende på omständigheterna kan det exempelvis bli aktuellt att:" : "Depending on the circumstances, this may involve:" }</p>

                    <ul>
                        <li>{language === "sv" ? "Avhjälpa felet" : "Remedying the defect" }</li>
                        <li>{language === "sv" ? "Tillverka eller leverera en ny produkt" : "Manufacturing or delivering a replacement product" }</li>
                        <li>{language === "sv" ? "Ge ett prisavdrag" : "Offering a price reduction" }</li>
                        <li>{language === "sv" ? "Återbetala köpet om förutsättningarna för hävning är uppfyllda" : "Refunding the purchase if the conditions for cancelling the contract are met" }</li>
                    </ul>

                    <p>{language === "sv" ? "Vid en berättigad reklamation står By Marcel för nödvändiga kostnader för att åtgärda felet enligt gällande regler." : "For a justified complaint, By Marcel covers the necessary costs of remedying the defect in accordance with applicable rules." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "16. Godkänt korrektur och personliga produkter" : "16. Approved proofs and personalised products" }</h2>

                    <p>{language === "sv" ? "För många personliga produkter skickar By Marcel ett digitalt korrektur innan produktionen startar." : "For many personalised products, By Marcel sends a digital proof before production begins." }</p>

                    <p>{language === "sv" ? "Kunden ansvarar för att kontrollera exempelvis:" : "The customer is responsible for checking, for example:" }</p>

                    <ul>
                        <li>{language === "sv" ? "Stavning" : "Spelling" }</li>
                        <li>{language === "sv" ? "Namn" : "Names" }</li>
                        <li>{language === "sv" ? "Datum" : "Dates" }</li>
                        <li>{language === "sv" ? "Husnummer" : "House numbers" }</li>
                        <li>{language === "sv" ? "Adresser" : "Addresses" }</li>
                        <li>{language === "sv" ? "Bilder" : "Images" }</li>
                        <li>{language === "sv" ? "Texter" : "Text" }</li>
                        <li>{language === "sv" ? "Placering" : "Placement" }</li>
                        <li>{language === "sv" ? "Färgval" : "Colour choices" }</li>
                        <li>{language === "sv" ? "Övriga personliga uppgifter" : "Other personal details" }</li>
                    </ul>

                    <p>{language === "sv" ? "När kunden har godkänt korrekturet används det som underlag för produktionen. Ett fel som redan fanns tydligt i ett korrektur som kunden har godkänt betraktas normalt inte som ett tillverkningsfel från By Marcels sida." : "Once the customer has approved the proof, it is used as the basis for production. An error that was already clearly visible in a proof approved by the customer is normally not considered a manufacturing defect on By Marcel's part." }</p>

                    <p>{language === "sv" ? "Om den färdiga produkten däremot avviker från den godkända designen på ett sätt som By Marcel ansvarar för kan det vara fråga om ett fel som kan reklameras." : "However, if the finished product differs from the approved design in a way for which By Marcel is responsible, this may constitute a defect that can be the subject of a complaint." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "17. Naturliga variationer" : "17. Natural variations" }</h2>

                    <p>{language === "sv" ? "Många av By Marcels produkter tillverkas individuellt och vissa moment utförs för hand." : "Many By Marcel products are individually manufactured, and some stages are carried out by hand." }</p>

                    <p>{language === "sv" ? "Material som trä, plywood, MDF, skiffer och andra natur- eller hantverksmateriel kan ha naturliga variationer." : "Materials such as wood, plywood, MDF, slate and other natural or craft materials may have natural variations." }</p>

                    <p>{language === "sv" ? "Mindre variationer i exempelvis färg, struktur, träådring, gravyr, ytfinish eller andra egenskaper kan därför förekomma." : "Minor variations in colour, texture, wood grain, engraving, surface finish or other characteristics may therefore occur." }</p>

                    <p>{language === "sv" ? "Även emalj och andra hantverksmässigt tillverkade produkter kan ha mindre variationer som är en naturlig följd av materialet och tillverkningsprocessen." : "Enamel and other handcrafted products may also have minor variations that are a natural result of the material and manufacturing process." }</p>

                    <p>{language === "sv" ? "Sådana normala variationer utgör inte automatiskt ett fel på produkten." : "Such normal variations do not automatically constitute a defect in the product." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "18. Bilder och färgåtergivning" : "18. Images and colour reproduction" }</h2>

                    <p>{language === "sv" ? "Vi försöker återge våra produkter så korrekt som möjligt i webbutiken. Färger och detaljer kan dock visas något olika beroende på skärm, skärminställningar, material och tillverkningsmetod." : "We try to represent our products as accurately as possible in our online shop. However, colours and details may appear slightly different depending on the screen, display settings, material and manufacturing method." }</p>

                    <p>{language === "sv" ? "För produkter som tillverkas från kundens egna fotografier påverkas resultatet även av originalbildens kvalitet och den valda tillverkningsmetoden." : "For products made from customers' own photographs, the result is also influenced by the quality of the original image and the chosen manufacturing method." }</p>
                </section>


                <section>
                    <h2>{language === "sv" ? "19. Frågor om leverans, retur eller reklamation" : "19. Questions about delivery, returns or complaints" }</h2>

                    <p>{language === "sv" ? "Har du frågor eller behöver hjälp med en beställning är du alltid välkommen att kontakta oss." : "If you have questions or need help with an order, you are always welcome to contact us." }</p>

                    <p><strong>{language === "sv" ? "Företag:" : "Company:"}</strong> Marcel Klaassen Development AB<br /><strong>{language === "sv" ? "Organisationsnummer:" : "Company registration number:"}</strong> 559575-6296<br /><strong>{language === "sv" ? "VAT-nummer:" : "VAT number:"}</strong> SE559575629601<br /><strong>{language === "sv" ? "Särskilt företagsnamn:" : "Registered business name:"}</strong> By Marcel<br /><strong>{language === "sv" ? "Adress:" : "Address:"}</strong> Gruvgatan 4, 712 60 Grythyttan, {language === "sv" ? "Sverige" : "Sweden"}<br /><strong>{language === "sv" ? "E-post:" : "Email:"}</strong> info@bymarcel.se</p>

                    <p>{language === "sv" ? "För fullständiga villkor för köp från By Marcel hänvisar vi även till våra Köpevillkor." : "For the full terms applicable to purchases from By Marcel, please also refer to our Terms of Purchase." }</p>
                </section>

            </article>
        </main>
    );
}