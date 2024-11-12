import { Link } from 'react-router-dom';
import backgroundImage from '../assets/images/istockphoto-1071294112-612x612.jpg';

export default function Register() {
  function registerForm(e) {
    e.preventDefault();

    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const username = document.getElementById('username');
    const email = document.getElementById('emailReg');
    const phone = document.getElementById('phoneReg');
    const pass = document.getElementById('passwordReg');

    fetch('/users/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        first_name: fname.value,
        last_name: lname.value,
        username: username.value,
        email: email.value,
        phone: phone.value,
        pass_word: pass.value,
      }),
    })
      .then((resp) => resp.json())
      .then(() => {
        alert('Du har nu registrerats!');
        document.getElementById('register').reset();
      })
      .catch((err) => {
        console.error(err);
      });
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
      <div
        className="d-flex flex-column justify-content-center"
        style={{
          maxWidth: '450px',
          width: '100%',
          backgroundColor: '#123456',
          borderRadius: '10px',
          padding: '30px',
          margin: '2rem',
        }}
      >
        <h2 className="heading text-center text-white">Registrera dig</h2>
        <form
          id="register"
          className="w-100 mx-auto"
          onSubmit={registerForm}
          style={{
            textAlign: 'left', // Asegura que el texto de las etiquetas quede alineado a la izquierda
            margin: '0 auto', // Centra el formulario en el contenedor
          }}
        >
          {[
            { id: 'fname', label: 'Ange förnamn:', placeholder: 'Förnamn...' },
            {
              id: 'lname',
              label: 'Ange efternamn:',
              placeholder: 'Efternamn...',
            },
            {
              id: 'username',
              label: 'Ange användarnamn:',
              placeholder: 'Användarnamn...',
            },
            {
              id: 'emailReg',
              label: 'Ange e-post:',
              placeholder: 'E-post...',
              type: 'email',
            },
            {
              id: 'phoneReg',
              label: 'Ange telefonnummer:',
              placeholder: '0700000000',
              type: 'tel',
              pattern: '[0-9]{10}',
            },
            {
              id: 'passwordReg',
              label: 'Ange lösenord:',
              placeholder: 'Lösenord...',
              type: 'password',
            },
          ].map((input, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <label
                htmlFor={input.id}
                className="registerLabel text-white text-center"
                style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '5px',
                }}
              >
                {input.label}
              </label>
              <input
                id={input.id}
                name={input.id}
                type={input.type || 'text'}
                placeholder={input.placeholder}
                required
                pattern={input.pattern || undefined}
                className="registerInput form-control mx-auto"
                style={{ width: '100%' }}
              />
            </div>
          ))}

          <div
            className="d-flex align-items-center"
            style={{ gap: '10px', marginTop: '20px' }}
          >
            <input
              type="checkbox"
              id="samtycke"
              name="samtycke"
              value="ok"
              required
            />
            <label htmlFor="samtycke" className="text-white">
              Jag samtycker till att mina personuppgifter hanteras enligt
              integritetspolicyn och GDPR.
            </label>
          </div>

          <button
            className="btn btn-outline-warning w-100 mt-3"
            data-bs-toggle="modal"
            data-bs-target="#samtyckeModal"
          >
            Läs mer om samtycke
          </button>
          <button type="submit" className="btn btn-warning w-100 mt-3">
            Bekräfta
          </button>
          <Link className="text-center text-warning d-block mt-3" to="/">
            Har du redan ett konto?
          </Link>
        </form>

        <div
          className="modal fade"
          id="samtyckeModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Hur vi hanterar dina uppgifter
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Genom att använda vår tjänst godkänner du att vi{' '}
                  <strong>samlar in</strong>, <strong>behandlar</strong> och{' '}
                  <strong>lagrar dina personuppgifter</strong> i enlighet med
                  GDPR.
                </p>

                <p>
                  Vi hanterar dina uppgifter för att kunna erbjuda en{' '}
                  <strong>säker och personlig upplevelse</strong> samt för att
                  uppfylla våra åtaganden gentemot dig. Dina uppgifter används
                  endast för de ändamål som du har{' '}
                  <strong>samtyckt till</strong>, och du kan när som helst{' '}
                  <strong>återkalla ditt samtycke</strong>.
                </p>

                <p>
                  För mer information om hur vi{' '}
                  <strong>skyddar din integritet</strong> och behandlar dina
                  personuppgifter, vänligen läs vår{' '}
                  <strong>integritetspolicy</strong>.
                </p>

                <p>
                  När du laddar upp bilder är du{' '}
                  <strong>
                    ansvarig för att ha de nödvändiga rättigheterna
                  </strong>{' '}
                  till bilderna och att inte bryta mot upphovsrätten.
                </p>

                <p>
                  Vi förväntar oss även att du håller en{' '}
                  <strong>respektfull ton</strong> i dina interaktioner och att
                  du avstår från att publicera innehåll som är{' '}
                  <strong>olämpligt, sexuellt explicit</strong> eller{' '}
                  <strong>olagligt</strong>.
                </p>

                <p>
                  Användning av vår tjänst innebär att du{' '}
                  <strong>samtycker till dessa riktlinjer</strong> och att vi
                  förbehåller oss rätten att vidta åtgärder om de inte följs.
                </p>
              </div>

              <div className="modal-footer">
                <Link
                  to="/gdpr"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() =>
                    document.querySelector('.modal').classList.remove('show')
                  }
                >
                  Mer om GDPR
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Stäng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
