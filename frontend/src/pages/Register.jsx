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
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="d-flex flex-column justify-content-center align-items-center my-auto w-25 mx-auto">
        <h2 className="heading">Registrera dig</h2>
        <div
          id="containerReg"
          className="d-flex mx-auto   justify-content-center align-items-center rounded-5 px-4 py-2"
          style={{ maxWidth: '300px' }}
        >
          <form
            id="register"
            className="d-flex flex-column mx-auto  "
            onSubmit={registerForm}
          >
            <label htmlFor="fname" className="mt-3 registerLabel">
              Ange förnamn:
            </label>
            <input
              id="fname"
              name="fname"
              type="text"
              placeholder="Förnamn..."
              required
              className="registerInput"
            />
            <label htmlFor="lname" className="mt-3 registerLabel">
              Ange efternamn:
            </label>
            <input
              id="lname"
              name="lname"
              type="text"
              placeholder="Efternamn..."
              required
              className="registerInput"
            />
            <label htmlFor="username" className="mt-3 registerLabel">
              Ange användarnamn:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Andvändarnamn..."
              required
              className="registerInput"
            />
            <label htmlFor="emailReg" className="mt-3 registerLabel">
              Ange e-post:
            </label>
            <input
              id="emailReg"
              name="emailReg"
              type="text"
              placeholder="E-post..."
              required
              className="registerInput"
            />
            <label htmlFor="phoneReg" className="mt-3 registerLabel">
              Ange telefonnumber:
            </label>
            <input
              id="phoneReg"
              name="phoneReg"
              type="tel"
              placeholder="0700000000"
              pattern="[0-9]{10}"
              required
              className="registerInput"
            />
            <label htmlFor="passwordReg" className="mt-3 registerLabel">
              Ange lösenord:
            </label>
            <input
              id="passwordReg"
              name="passwordReg"
              type="password"
              placeholder="Lösenord..."
              required
              className="registerInput"
            />
            <div
              className="d-flex"
              style={{ gap: '40px', padding: '20px 5px 0px 10px' }}
            >
              <input
                type="checkbox"
                id="samtycke"
                name="samtycke"
                value="ok"
                required
              />
              <label htmlFor="samtycke" id="samtycke">
                Jag samtycker till att mina personuppgifter hanteras enligt
                integritetspolicyn och GDPR.
              </label>
            </div>
            <button
              className=" mx-auto btn btn-outline-warning"
              data-bs-toggle="modal"
              data-bs-target="#samtyckeModal"
            >
              Läs mer om samtycke
            </button>
            <button
              type="submit"
              className="w-50 mx-auto mt-3 rounded-2 btn btn-warning"
            >
              Bekräfta
            </button>
            <Link
              className=" link text-warning mx-auto rounded-3 mt-3 btn  p-2"
              to="/"
            >
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
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Hur vi hanterar dina uppgifter
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  Genom att använda vår tjänst godkänner du att vi samlar in,
                  behandlar och lagrar dina personuppgifter i enlighet med GDPR.
                  Vi hanterar dina uppgifter för att kunna erbjuda en säker och
                  personlig upplevelse samt för att uppfylla våra åtaganden
                  gentemot dig. Dina uppgifter används endast för de ändamål som
                  du har samtyckt till, och du kan när som helst återkalla ditt
                  samtycke. För mer information om hur vi skyddar din integritet
                  och behandlar dina personuppgifter, vänligen läs vår
                  integritetspolicy.
                </div>
                <div className="modal-footer">
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
    </div>
  );
}
