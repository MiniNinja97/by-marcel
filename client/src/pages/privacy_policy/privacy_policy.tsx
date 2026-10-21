
import { useLanguage } from "../../context/languageContext";
import "./privacy_policy.css";

const translations = {
  sv: {
    title: "Integritetspolicy",
    updated: "Senast uppdaterad: 4 september 2026",
    intro: [
      "Din integritet är viktig för oss. By Marcel behandlar personuppgifter på ett ansvarsfullt och säkert sätt och i enlighet med EU:s dataskyddsförordning (GDPR).",
      "Denna integritetspolicy beskriver vilka personuppgifter vi samlar in, varför vi behandlar dem, hur länge de sparas och vilka rättigheter du har.",
    ],
    company: "Företag:",
    registration: "Organisationsnummer:",
    vat: "VAT-nummer:",
    tradingName: "Särskilt företagsnamn:",
    address: "Adress:",
    email: "E-post:",
    country: "Sverige",
    sections: [
      {
        title: "1. Personuppgiftsansvarig",
        paragraphs: [
          "By Marcel är personuppgiftsansvarig för behandlingen av personuppgifter i vår webbutik.",
        ],
        contactDetails: true,
      },
      {
        title: "2. Vilka personuppgifter samlar vi in?",
        paragraphs: [
          "När du handlar hos oss eller kontaktar oss kan vi behandla uppgifter såsom:",
        ],
        items: [
          "Namn",
          "Adress och leveransadress",
          "E-postadress",
          "Telefonnummer",
          "Order- och köpinformation",
          "Betalningsrelaterad information",
          "Kommunikation med oss",
          "Bilder, fotografier, logotyper, texter och annat material som du skickar till oss för tillverkning av en personlig produkt",
        ],
        afterItems: [
          "Vi samlar endast in de uppgifter som behövs för respektive ändamål.",
        ],
      },
      {
        title: "3. Beställningar och leveranser",
        paragraphs: [
          "Vi behandlar dina personuppgifter för att kunna ta emot, administrera, tillverka och leverera din beställning samt hantera betalningar, kundservice, reklamationer och eventuella returer.",
          "Nödvändiga uppgifter kan delas med exempelvis betalningsleverantörer, transportföretag och andra leverantörer som behövs för att genomföra beställningen.",
        ],
      },
      {
        title: "4. Personliga produkter och kundbilder",
        paragraphs: [
          "Många produkter från By Marcel tillverkas individuellt efter kundens önskemål. Du kan därför skicka eller ladda upp fotografier, bilder, logotyper, texter eller annat material som ska användas vid design och tillverkning.",
          "Materialet används endast för att:",
        ],
        items: [
          "Ta fram design och korrektur",
          "Kommunicera med dig om utformningen",
          "Tillverka den beställda produkten",
          "Hantera eventuella frågor eller reklamationer kopplade till beställningen",
        ],
        afterItems: [
          "Vi använder inte dina privata bilder i marknadsföring, sociala medier, produktbilder eller andra offentliga sammanhang utan ditt uttryckliga tillstånd.",
          "Kundmaterial sparas inte längre än vad som är nödvändigt för beställningen, efterservice eller andra berättigade ändamål och raderas därefter på ett säkert sätt.",
        ],
      },
      {
        title: "5. Material som kunden skickar till oss",
        paragraphs: [
          "När du skickar bilder, logotyper, texter eller annat material till By Marcel ansvarar du för att du har rätt att använda materialet och att låta oss använda det för att tillverka den beställda produkten.",
          "By Marcel förbehåller sig rätten att avstå från att tillverka eller behandla en beställning om det finns rimliga tvivel om kundens rätt att använda materialet, om materialet kan innebära intrång i någon annans rättigheter eller om innehållet strider mot By Marcels värderingar, säkerhetskrav eller allmänna principer. Detta kan exempelvis gälla material som är olagligt, kränkande, hotfullt, diskriminerande, pornografiskt eller på annat sätt olämpligt.",
          "Om vi avstår från att tillverka en produkt kontaktar vi kunden så snart som möjligt och informerar om detta. Om betalning redan har genomförts återbetalas den i den mån det är tillämpligt enligt lag och våra köpevillkor.",
          "Om materialet innehåller bilder eller personuppgifter som rör andra personer ansvarar du för att du har rätt eller nödvändigt tillstånd att använda materialet för detta ändamål.",
        ],
      },
      {
        title: "6. Betalningar",
        paragraphs: [
          "Betalningar kan hanteras av externa betalningsleverantörer. By Marcel lagrar normalt inte fullständiga kortuppgifter.",
          "Betalningsleverantören behandlar de uppgifter som krävs för att genomföra betalningen enligt sina egna villkor och sin egen integritetspolicy.",
        ],
      },
      {
        title: "7. Leverans",
        paragraphs: [
          "För att leverera din beställning kan nödvändiga uppgifter, såsom namn, adress, telefonnummer och e-postadress, lämnas till det transportföretag eller den logistikpartner som används för leveransen.",
        ],
      },
      {
        title: "8. Bokföring",
        paragraphs: [
          "Vissa uppgifter om köp och betalningar måste sparas för att By Marcel ska kunna uppfylla sina rättsliga skyldigheter, bland annat enligt svensk bokföringslagstiftning. Sådana uppgifter sparas under den tid som krävs enligt svensk bokföringslag (7 år).",
        ],
      },
      {
        title: "9. Marknadsföring",
        paragraphs: [
          "Om du har lämnat ditt samtycke till exempelvis nyhetsbrev kan vi använda din e-postadress för sådan kommunikation. Du kan när som helst återkalla ditt samtycke och avsluta prenumerationen.",
          "Vi säljer inte dina personuppgifter till andra företag för deras marknadsföring.",
        ],
      },
      {
        title: "10. Hur länge sparar vi personuppgifter?",
        paragraphs: [
          "Vi sparar personuppgifter endast så länge som de behövs för det ändamål de samlades in för eller så länge vi är skyldiga att spara dem enligt lag. Olika uppgifter kan därför ha olika lagringstider.",
        ],
      },
      {
        title: "11. Dina rättigheter",
        paragraphs: [
          "Enligt GDPR har du under vissa förutsättningar rätt att:",
        ],
        items: [
          "Få information om vilka personuppgifter vi behandlar om dig",
          "Begära rättelse av felaktiga uppgifter",
          "Begära att uppgifter raderas",
          "Begära begränsning av behandlingen",
          "Invända mot viss behandling",
          "Återkalla ett lämnat samtycke",
          "Få ut vissa uppgifter i ett överförbart format (dataportabilitet)",
        ],
        afterItems: [
          "Om du vill använda någon av dina rättigheter kontaktar du oss på info@bymarcel.se.",
          "Du har även rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY) om du anser att dina personuppgifter behandlas på ett felaktigt sätt.",
        ],
      },
      {
        title: "12. Säkerhet",
        paragraphs: [
          "By Marcel vidtar rimliga tekniska och organisatoriska säkerhetsåtgärder för att skydda personuppgifter och kundmaterial mot obehörig åtkomst, förlust, ändring eller spridning.",
        ],
      },
      {
        title: "13. Externa leverantörer",
        paragraphs: [
          "För att kunna driva webbutiken använder By Marcel externa tjänsteleverantörer, exempelvis för webbhotell, betalningar, leveranser, e-post, bokföring och webbstatistik. Dessa får endast tillgång till personuppgifter i den omfattning som behövs för respektive tjänst och behandlar uppgifterna enligt tillämpliga dataskyddsregler.",
          "Om personuppgifter överförs utanför EU/EES säkerställer vi att det finns en laglig grund och lämpliga skyddsåtgärder för överföringen.",
        ],
      },
      {
        title: "14. Ändringar av integritetspolicyn",
        paragraphs: [
          "Vi kan uppdatera denna integritetspolicy när verksamheten, webbplatsen eller gällande regler förändras. Den senaste versionen finns alltid publicerad på vår webbplats.",
        ],
      },
      {
        title: "Kontakt",
        paragraphs: [
          "Har du frågor om hur By Marcel behandlar dina personuppgifter är du välkommen att kontakta oss.",
        ],
        contactDetails: true,
      },
    ],
  },

  en: {
    title: "Privacy Policy",
    updated: "Last updated: 4 September 2026",
    intro: [
      "Your privacy is important to us. By Marcel processes personal data responsibly and securely, in accordance with the EU General Data Protection Regulation (GDPR).",
      "This privacy policy explains what personal data we collect, why we process it, how long we retain it and what rights you have.",
    ],
    company: "Company:",
    registration: "Company registration number:",
    vat: "VAT number:",
    tradingName: "Registered business name:",
    address: "Address:",
    email: "Email:",
    country: "Sweden",
    sections: [
      {
        title: "1. Data Controller",
        paragraphs: [
          "By Marcel is the data controller responsible for the processing of personal data in our online shop.",
        ],
        contactDetails: true,
      },
      {
        title: "2. What personal data do we collect?",
        paragraphs: [
          "When you shop with us or contact us, we may process information such as:",
        ],
        items: [
          "Name",
          "Address and delivery address",
          "Email address",
          "Telephone number",
          "Order and purchase information",
          "Payment-related information",
          "Communications with us",
          "Images, photographs, logos, text and other materials you send us for the production of a personalised product",
        ],
        afterItems: [
          "We only collect the information necessary for each specific purpose.",
        ],
      },
      {
        title: "3. Orders and deliveries",
        paragraphs: [
          "We process your personal data to receive, administer, manufacture and deliver your order, as well as to handle payments, customer service, complaints and any returns.",
          "Necessary information may be shared with payment providers, transport companies and other suppliers required to fulfil your order.",
        ],
      },
      {
        title: "4. Personalised products and customer images",
        paragraphs: [
          "Many By Marcel products are individually manufactured according to the customer's wishes. You may therefore send or upload photographs, images, logos, text or other materials to be used in the design and production process.",
          "The material is used only to:",
        ],
        items: [
          "Prepare designs and proofs",
          "Communicate with you about the design",
          "Manufacture the ordered product",
          "Handle any questions or complaints related to the order",
        ],
        afterItems: [
          "We do not use your private images in marketing, social media, product images or other public contexts without your explicit permission.",
          "Customer materials are not retained longer than necessary for the order, after-sales service or other legitimate purposes, and are subsequently deleted securely.",
        ],
      },
      {
        title: "5. Materials submitted by customers",
        paragraphs: [
          "When you send images, logos, text or other materials to By Marcel, you are responsible for ensuring that you have the right to use the material and to authorise us to use it to manufacture the ordered product.",
          "By Marcel reserves the right to decline to manufacture or process an order if there are reasonable doubts about the customer's right to use the material, if the material may infringe the rights of others, or if its content conflicts with By Marcel's values, safety requirements or general principles. This may include material that is illegal, offensive, threatening, discriminatory, pornographic or otherwise inappropriate.",
          "If we decide not to manufacture a product, we will contact the customer as soon as possible and explain the situation. If payment has already been made, a refund will be issued where applicable under the law and our terms of purchase.",
          "If the material contains images or personal data relating to other individuals, you are responsible for ensuring that you have the right or necessary permission to use the material for this purpose.",
        ],
      },
      {
        title: "6. Payments",
        paragraphs: [
          "Payments may be processed by external payment providers. By Marcel does not normally store complete payment card details.",
          "The payment provider processes the information necessary to complete the payment in accordance with its own terms and privacy policy.",
        ],
      },
      {
        title: "7. Delivery",
        paragraphs: [
          "To deliver your order, necessary information such as your name, address, telephone number and email address may be shared with the transport company or logistics partner responsible for delivery.",
        ],
      },
      {
        title: "8. Accounting",
        paragraphs: [
          "Certain purchase and payment information must be retained so that By Marcel can fulfil its legal obligations, including those under Swedish accounting legislation. Such information is retained for the period required by Swedish accounting law (7 years).",
        ],
      },
      {
        title: "9. Marketing",
        paragraphs: [
          "If you have given your consent, for example to receive newsletters, we may use your email address for such communications. You can withdraw your consent and unsubscribe at any time.",
          "We do not sell your personal data to other companies for their marketing purposes.",
        ],
      },
      {
        title: "10. How long do we retain personal data?",
        paragraphs: [
          "We retain personal data only for as long as necessary for the purpose for which it was collected, or for as long as we are legally required to retain it. Different types of information may therefore have different retention periods.",
        ],
      },
      {
        title: "11. Your rights",
        paragraphs: [
          "Under the GDPR, you have the right, under certain conditions, to:",
        ],
        items: [
          "Receive information about the personal data we process about you",
          "Request correction of inaccurate information",
          "Request deletion of personal data",
          "Request restriction of processing",
          "Object to certain types of processing",
          "Withdraw previously given consent",
          "Receive certain data in a transferable format (data portability)",
        ],
        afterItems: [
          "If you wish to exercise any of your rights, please contact us at info@bymarcel.se.",
          "You also have the right to lodge a complaint with the Swedish Authority for Privacy Protection (Integritetsskyddsmyndigheten, IMY) if you believe your personal data is being processed improperly.",
        ],
      },
      {
        title: "12. Security",
        paragraphs: [
          "By Marcel takes reasonable technical and organisational security measures to protect personal data and customer materials against unauthorised access, loss, alteration or disclosure.",
        ],
      },
      {
        title: "13. External service providers",
        paragraphs: [
          "To operate our online shop, By Marcel uses external service providers, for example for web hosting, payments, deliveries, email, accounting and website analytics. These providers only receive access to personal data to the extent necessary for their respective services and process the information in accordance with applicable data protection regulations.",
          "If personal data is transferred outside the EU/EEA, we ensure that there is a lawful basis and appropriate safeguards for the transfer.",
        ],
      },
      {
        title: "14. Changes to this privacy policy",
        paragraphs: [
          "We may update this privacy policy when our business, website or applicable regulations change. The latest version is always published on our website.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          "If you have any questions about how By Marcel processes your personal data, please feel free to contact us.",
        ],
        contactDetails: true,
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const content = language === "sv" ? translations.sv : translations.en;

  return (
    <main className="privacy-policy">
      <article className="privacy-policy__content">
        <header className="privacy-policy__header">
          <h1>{content.title}</h1>
          <p>{content.updated}</p>
        </header>

        {content.intro.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        {content.sections.map((section, index) => (
          <section key={index}>
            <h2>{section.title}</h2>

            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}

            {"items" in section && section.items && (
              <ul>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}

            {"afterItems" in section &&
              section.afterItems?.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}

            {"contactDetails" in section && section.contactDetails && (
              <p>
                <strong>{content.company}</strong>{" "}
                Marcel Klaassen Development AB
                <br />

                <strong>{content.registration}</strong> 559575-6296
                <br />

                {index === 0 && (
                  <>
                    <strong>{content.vat}</strong> SE559575629601
                    <br />
                  </>
                )}

                <strong>{content.tradingName}</strong> By Marcel
                <br />

                <strong>{content.address}</strong>{" "}
                Gruvgatan 4, 712 60 Grythyttan, {content.country}
                <br />

                <strong>{content.email}</strong> info@bymarcel.se
              </p>
            )}
          </section>
        ))}
      </article>
    </main>
  );
}
