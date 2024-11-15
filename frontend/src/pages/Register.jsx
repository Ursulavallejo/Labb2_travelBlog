import { Navigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/images/istockphoto-1071294112-612x612.avif';
import { Container, Form, Button, Modal, Toast } from 'react-bootstrap';
import { UserContext } from '../Context/UserContext';
import { useState, useContext } from 'react';

export default function Register() {
  const { setID, setUsername } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [isRegistered, setIsRegistered] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  function registerForm(e) {
    e.preventDefault();

    if (!consentChecked) {
      setToastMessage('Du måste godkänna samtycket!');
      setToastVariant('danger');
      setShowToast(true);
      return;
    }

    const fname = e.target.fname.value;
    const lname = e.target.lname.value;
    const username = e.target.username.value;
    const email = e.target.emailReg.value;
    const phone = e.target.phoneReg.value;
    const pass = e.target.passwordReg.value;

    fetch('/users/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        first_name: fname,
        last_name: lname,
        username: username,
        email: email,
        phone: phone,
        pass_word: pass,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === 'Registreringen lyckad!!' && data.data) {
          const userID = data.data.user_id;
          const username = data.data.username;
          const token = data.token;

          setID(userID);
          setUsername(username);
          localStorage.setItem('ID', userID);
          localStorage.setItem('username', username);
          localStorage.setItem('token', token);

          setToastMessage('Du har nu registrerats!');
          setToastVariant('success');
          setShowToast(true);

          setTimeout(() => {
            setIsRegistered(true);
          }, 2000);
        } else {
          setToastMessage(
            data.message || 'Error en el registro. Inténtalo igen.'
          );
          setToastVariant('danger');
          setShowToast(true);
        }
      })
      .catch((err) => {
        console.error('Error en el registro:', err);
        setToastMessage('Serverfel, försök igen senare.');
        setToastVariant('danger');
        setShowToast(true);
      });
  }

  if (isRegistered) {
    return <Navigate to="/blogs" replace={true} />;
  }

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
        className="p-2"
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: '#123456',
          borderRadius: '10px',
          padding: '2rem',
          maxHeight: '95vh',
          overflowY: 'auto',
        }}
      >
        <h2
          className="heading text-center text-white mb-3 mt-3"
          style={{ fontSize: '1.4rem' }}
        >
          Registrera dig
        </h2>
        <Form
          onSubmit={registerForm}
          style={{ width: '85%' }}
          className="mb-2 mx-auto "
        >
          <Form.Group className="mb-2" controlId="fname">
            <Form.Label className="text-white" style={{ fontSize: '0.85rem' }}>
              Ange förnamn:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Förnamn..."
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="lname">
            <Form.Label className="text-white" style={{ fontSize: '0.85rem' }}>
              Ange efternamn:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Efternamn..."
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="username">
            <Form.Label className="text-white" style={{ fontSize: '0.85rem' }}>
              Ange användarnamn:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Användarnamn..."
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="emailReg">
            <Form.Label className="text-white" style={{ fontSize: '0.85rem' }}>
              Ange e-post:
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="E-post..."
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="phoneReg">
            <Form.Label className="text-white" style={{ fontSize: '0.85rem' }}>
              Ange telefonnummer:
            </Form.Label>
            <Form.Control
              type="tel"
              placeholder="0700000000"
              pattern="[0-9]{10}"
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="passwordReg">
            <Form.Label className="text-white" style={{ fontSize: '0.85rem' }}>
              Ange lösenord:
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Lösenord..."
              required
              size="sm"
            />
          </Form.Group>

          <Form.Group
            className="d-flex align-items-center mb-2"
            style={{ fontSize: '0.7rem' }}
          >
            <Form.Check
              type="checkbox"
              id="samtycke"
              required
              className="me-2"
              checked={consentChecked}
              onChange={() => setConsentChecked(!consentChecked)}
            />
            <Form.Label className="text-white mb-0" htmlFor="samtycke">
              Jag samtycker till att mina personuppgifter hanteras enligt
              integritetspolicyn och GDPR.
            </Form.Label>
          </Form.Group>

          <Button
            variant="outline-warning"
            className="w-100 mb-2"
            onClick={() => setShowModal(true)}
            style={{ fontSize: '0.8rem' }}
            type="button"
          >
            Läs mer om samtycke
          </Button>
          <Button
            type="submit"
            variant="warning"
            className="w-100 mb-2"
            style={{ fontSize: '0.8rem' }}
          >
            Bekräfta
          </Button>
          <Link
            className="text-center text-warning d-block"
            to="/"
            style={{ fontSize: '0.8rem' }}
          >
            Har du redan ett konto?
          </Link>
        </Form>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Hur vi hanterar dina uppgifter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Genom att använda vår tjänst godkänner du att vi{' '}
              <strong>samlar in</strong>, <strong>behandlar</strong> och{' '}
              <strong>lagrar dina personuppgifter</strong> i enlighet med GDPR.
            </p>
            <p>
              Vi hanterar dina uppgifter för att kunna erbjuda en{' '}
              <strong>säker och personlig upplevelse</strong> samt för att
              uppfylla våra åtaganden gentemot dig. Dina uppgifter används
              endast för de ändamål som du har <strong>samtyckt till</strong>,
              och du kan när som helst <strong>återkalla ditt samtycke</strong>.
            </p>
            <p>
              Genom att ladda upp bilder i vår tjänst intygar du att du har{' '}
              <strong>upphovsrätten</strong> eller tillståndet att använda
              bilderna. Plattformen tar <strong>inget ansvar</strong> för
              eventuella upphovsrättsintrång som uppstår från användargenererat
              innehåll.
            </p>
            <p>
              Vi vill också uppmana till en respektfull och vänlig ton i alla
              kommentarer. Inlägg eller kommentarer med{' '}
              <strong>rasistiskt</strong>, <strong>sexistiskt</strong> eller{' '}
              <strong>etniskt kränkande innehåll</strong> kommer inte att
              tolereras och kan leda till att kontot blockeras.
            </p>
            <p>
              För mer information om hur vi{' '}
              <strong>skyddar din integritet</strong> och behandlar dina
              personuppgifter, vänligen läs vår{' '}
              <strong>integritetspolicy</strong>.
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Link
              to="/gdpr"
              className="btn btn-outline-info"
              onClick={() => setShowModal(false)}
            >
              Mer om GDPR
            </Link>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Stäng
            </Button>
          </Modal.Footer>
        </Modal>

        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          className="position-fixed bottom-0 end-0 m-3"
          bg={toastVariant}
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </Container>
    </div>
  );
}
