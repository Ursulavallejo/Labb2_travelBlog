export default function Register() {
  function registerForm(e) {
    e.preventDefault();

    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const username = document.getElementById('username');
    const email = document.getElementById('emailReg');
    const pass = document.getElementById('passwordReg');

    fetch('http://localhost:8080/users/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        first_name: fname.value,
        last_name: lname.value,
        username: username.value,
        email: email.value,
        pass_word: pass.value,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        document.getElementById('register').reset();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center my-auto">
      <div
        id="containerReg"
        className="d-flex rounded-5 p-5"
        style={{ background: '#0077B6' }}
      >
        <form
          id="register"
          className="d-flex flex-column mx-auto"
          action=""
          onSubmit={registerForm}
        >
          <label htmlFor="fname" className="mt-3">
            Ange förnamn:
          </label>
          <input
            id="fname"
            name="fname"
            type="text"
            placeholder="Förnamn..."
            required
          />
          <label htmlFor="lname" className="mt-3">
            Ange efternamn:
          </label>
          <input
            id="lname"
            name="lname"
            type="text"
            placeholder="Efternamn..."
            required
          />
          <label htmlFor="username" className="mt-3">
            Ange användarenamn:
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Andvändare namn..."
            required
          />
          <label htmlFor="emailReg" className="mt-3">
            Ange email:
          </label>
          <input
            id="emailReg"
            name="emailReg"
            type="text"
            placeholder="Email..."
            required
          />
          <label htmlFor="passwordReg" className="mt-3">
            Ange lösenord:
          </label>
          <input
            id="passwordReg"
            name="passwordReg"
            type="passwordReg"
            placeholder="Password..."
            required
          />
          <label htmlFor="samtycke">
            <input
              type="checkbox"
              id="samtycke"
              name="samtycke"
              value="ok"
              required
            />
            Jag samtycker till att mina personuppgifter hanteras enligt
            integritetspolicyn och GDPR.{' '}
          </label>
          <button type="submit" className="w-50 mx-auto mt-3 rounded-2">
            Bekräfta
          </button>
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
      <button
        className="w-50 mx-auto mt-3 rounded-2"
        data-bs-toggle="modal"
        data-bs-target="#samtyckeModal"
      >
        läs mer om samtycke
      </button>
    </div>
  );
}
