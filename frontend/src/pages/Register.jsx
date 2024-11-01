export default function Register() {
  return (
    //////////// form to post customer data to  store in DB ////////
    <div id="containerReg">
      <form className="d-flex flex-column" action="">
        <label htmlFor="username">Ange användarenamn:</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Andvändare namn..."
        />
        <label htmlFor="emailReg">Ange email:</label>
        <input
          id="emailReg"
          name="emailReg"
          type="text"
          placeholder="Email..."
        />
        <label htmlFor="passwordReg">Ange lösenord:</label>
        <input
          id="passwordReg"
          name="passwordReg"
          type="passwordReg"
          placeholder="Password..."
        />
        <button type="submit">Bekräfta</button>
      </form>
    </div>
  );
}
