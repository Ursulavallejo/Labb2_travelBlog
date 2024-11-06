export default function Register() {
  function registerForm(e) {
    e.preventDefault();
    document.getElementById("register").reset();
  }
  return (
    //////////// form to post customer data to  store in DB ////////

    <div className="d-flex flex-column justify-content-center align-items-center my-auto">
      <div
        id="containerReg"
        className="d-flex rounded-5 p-5"
        style={{ background: "#0077B6" }}
      >
        <form
          id="register"
          className="d-flex flex-column mx-auto"
          action=""
          onSubmit={registerForm}
        >
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
          <button type="submit" className="w-50 mx-auto mt-3 rounded-2">
            Bekräfta
          </button>
        </form>
      </div>
    </div>
  );
}
