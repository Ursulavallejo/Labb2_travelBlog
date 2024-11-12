import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import travelImage from '../assets/travel.svg';

export default function Login() {
  const { setID, setUsername } = useContext(UserContext);
  const [finish, setFinish] = useState(false);
  const navigate = useNavigate();

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
        const userID = user.data.user_id;
        const username = user.data.username;
        const token = user.token;

        setID(userID);
        setUsername(username);

        localStorage.setItem('ID', userID);
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);

        // alert('Loggat in!');
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
        <div className="d-flex align-items-center justify-content-evenly">
          <img
            src={travelImage}
            width="60"
            height="60"
            alt="Travel Icon"
            style={{ margin: '1.2rem' }}
          />
          <span
            style={{ color: '#ffc107', fontWeight: '600', fontSize: '1.5rem' }}
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
          <button
            type="submit"
            className="w-50 mx-auto mt-3 rounded-2 btn blue"
          >
            Logga in
          </button>
          <Link to="/register" className="link mx-auto">
            <button className="rounded-3 mt-3 btn blue">
              Inget konto? Registrera här!
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
