import { Link } from 'react-router-dom';

export default function Login() {
  function loginForm(e) {
    e.preventDefault();
    document.getElementById('login').reset();
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center my-auto">
      <div
        id="container"
        className="d-flex rounded-5 p-5"
        style={{ background: '#0077B6' }}
      >
        <form
          id="login"
          className="d-flex flex-column mx-auto"
          action=""
          onSubmit={loginForm}
        >
          <label htmlFor="email">Ange email:</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Email..."
            required
          />
          <label htmlFor="password" className="mt-3">
            Ange lösenord:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password..."
            required
          />
          <button type="submit" className="w-50 mx-auto mt-3 rounded-2">
            Logga in
          </button>
        </form>
      </div>
      {/* temporal button */}
      <button className="mx-auto">
        <Link to="/blogs">TO HOME Temporal button</Link>
      </button>
    </div>
  );
}
