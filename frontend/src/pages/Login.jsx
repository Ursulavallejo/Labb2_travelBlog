import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

export default function Login() {
  const { setID } = useContext(UserContext);

  function loginForm(e) {
    e.preventDefault();

    const email = document.getElementById('email');
    const pass = document.getElementById('password');

    fetch('http://localhost:8080s/users/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        pass_word: pass.value,
      }),
    })
      .then((resp) => resp.json())
      .then((user) => {
        const userID = user.data[0].user_id;
        setID(userID);
        localStorage.setItem('ID', userID);
        alert('Loggat in!');
        document.getElementById('login').reset();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center my-auto">
      <h2>Logga in</h2>

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
