import { Container, Card } from 'react-bootstrap';
import backgroundImage from '../assets/images/istockphoto-1071294112-612x612.jpg';

export default function GdprView() {
  return (
    <div
      className="background-image-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        minHeight: '100vh',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container
        className="my-4 p-0 gdpr-container"
        style={{ maxWidth: '700px' }}
      >
        <Card className="p-4">
          <Card.Body>
            <h1 className="text-center mb-4">Integritetsskyddspolicy</h1>
            <p>
              Vi värnar om din integritet och strävar efter att skydda dina
              personuppgifter i enlighet med GDPR. Denna policy beskriver hur vi
              samlar in, använder och lagrar dina uppgifter när du använder vår
              tjänst.
            </p>
            <h3>Vilka uppgifter vi samlar in</h3>
            <p>
              När du skapar ett konto på vår reseblogg samlar vi in följande
              information:
            </p>
            <ul>
              <li>
                <strong>Kontaktinformation:</strong> namn, e-postadress och
                telefonnummer.
              </li>
              <li>
                <strong>Kontoinformation:</strong> användarnamn och lösenord.
              </li>
              <li>
                <strong>Interaktionsdata:</strong> kommentarer och blogginlägg
                som du publicerar.
              </li>
            </ul>

            <h3>Varför vi samlar in uppgifter</h3>
            <p>
              Vi använder dessa uppgifter för att kunna erbjuda dig en säker och
              personlig upplevelse. Dina uppgifter används för att hantera ditt
              konto, underlätta interaktioner på bloggen, och för att förbättra
              våra tjänster.
            </p>

            <h3>Skydd av dina uppgifter</h3>
            <p>
              Vi använder tekniska och organisatoriska säkerhetsåtgärder för att
              skydda dina personuppgifter från obehörig åtkomst och hantering.
              Dina data lagras säkert och endast behöriga personer har tillgång
              till den.
            </p>

            <h3>Dina rättigheter</h3>
            <p>
              Enligt GDPR har du rätt att begära tillgång till, ändra eller
              radera dina personuppgifter när som helst. Du kan också återkalla
              ditt samtycke och begära att vi slutar använda dina data för
              specifika ändamål.
            </p>

            <h3>Ansvar vid uppladdning av innehåll</h3>
            <p>
              När du laddar upp innehåll som bilder eller kommentarer är du
              ansvarig för att ha rättigheter till detta material och att det
              inte bryter mot upphovsrätten.
            </p>

            <h3>Riktlinjer för användning</h3>
            <p>
              Genom att använda vår tjänst förbinder du dig att följa våra
              riktlinjer, vilket inkluderar att hålla en respektfull ton och
              avstå från att publicera olämpligt, sexuellt explicit eller
              olagligt innehåll.
            </p>

            <p>
              Vid frågor om vår integritetspolicy eller om dina rättigheter,
              vänligen kontakta oss.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
