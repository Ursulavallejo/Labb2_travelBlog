export default function Login() {
  return (
    //////////// form to send login data to DB ////////
    <div id="container">
      <form className="d-flex flex-column" action="">
        <label htmlFor="email">Ange email:</label>
        <input id="email" name="email" type="text" placeholder="Email..." />
        <label htmlFor="password">Ange lösenord:</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password..."
        />
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}
