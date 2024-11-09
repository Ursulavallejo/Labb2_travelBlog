import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

export default function Login() {
  const { setID, setUsername } = useContext(UserContext);
  const [finish, setFinish] = useState(false);
  const navigate = useNavigate();

  console.log('setID:', setID); // Verifica si setID está definido
  console.log('setUsername:', setUsername); // Verifica si setUsername está definido

  useEffect(() => {
    if (finish) {
      navigate('/blogs');
    }
  }, [finish, navigate]);

  function loginForm(e) {
    e.preventDefault();

    const email = document.getElementById('email');
    const pass = document.getElementById('password');

    fetch('users/login', {
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
        const username = user.data[0].username;

        console.log(userID, username);

        setID(userID); // Asegúrate de que setID está disponible
        setUsername(username); // Asegúrate de que setUsername está disponible

        localStorage.setItem('ID', userID);
        localStorage.setItem('username', username);
        alert('Loggat in!');
        document.getElementById('login').reset();
        setFinish(true);
      })
      .catch((err) => {
        console.error(err);
        alert('Felaktig lösenord eller email!');
      });
  }

  return (
    <div className="login-page">
      {/* Container mosaic photos */}
      <div className="image-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
          <img
            key={num}
            src={`https://unsplash.it/${600 + num * 50}/${400 + num * 50}`}
            alt={`RandomImage${num}`}
            className={`grid-image grid-image-${num}`}
          />
        ))}
      </div>

      {/* Container form logIn */}
      <div id="container" className="login-container rounded-5 p-5">
        <div className="d-flex align-items-center">
          <img
            src="/travel.svg"
            width="60"
            height="60"
            className="d-inline-block align-center"
            alt="Travel Icon"
            style={{ margin: '1.2rem' }}
          />
          <span
            style={{ color: '#e27e0a', fontWeight: '600', fontSize: '1.5rem' }}
          >
            Travel Blog
          </span>
        </div>
        <form
          id="login"
          className="d-flex flex-column mx-auto login-form"
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
          <button type="submit" className="w-50 mx-auto mt-3 rounded-2 blue">
            Logga in
          </button>
        </form>
        <button className="mx-auto">
          <Link to="/blogs">TO HOME Temporal button</Link>
        </button>
      </div>
    </div>
  );
}
