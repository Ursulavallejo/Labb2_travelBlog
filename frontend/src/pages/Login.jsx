import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import travelImage from '../assets/travel.svg';
import { Toast, ToastContainer, Form } from 'react-bootstrap';

export default function Login() {
  const { setID, setUsername } = useContext(UserContext);
  const [finish, setFinish] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success'); // 'success' or 'danger'
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (finish) {
      navigate('/blogs');
    }
  }, [finish, navigate]);

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const isFieldValid = (field) => {
    const input = document.getElementById(field);
    return input.checkValidity();
  };

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
      .then(async (resp) => {
        if (resp.ok) {
          const user = await resp.json();
          const userID = user.data.user_id;
          const username = user.data.username;
          const token = user.token;

          setID(userID);
          setUsername(username);

          localStorage.setItem('ID', userID);
          localStorage.setItem('username', username);
          localStorage.setItem('token', token);

          setToastMessage('Inloggningen lyckades!');
          setToastVariant('success');
          setShowToast(true);

          document.getElementById('login').reset();

          setTimeout(() => {
            setFinish(true);
          }, 3000);
        } else {
          const errorMessage = await resp.text();
          throw new Error(errorMessage);
        }
      })
      .catch((err) => {
        console.error(err);
        setToastMessage(err.message);
        setToastVariant('danger');
        setShowToast(true);
      });
  }

  return (
    <div className="login-page">
      <div className="image-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
          <img
            key={num}
            src={`https://unsplash.it/${600 + num * 50}/${400 + num * 50}`}
            alt={`RandomImage${num}`}
            className={`grid-image grid-image-${num}`}
            loading="lazy"
          />
        ))}
      </div>

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
        <Form
          id="login"
          className="d-flex flex-column mx-auto login-form was-validated"
          onSubmit={loginForm}
        >
          <Form.Group>
            <Form.Label
              className="text-white"
              htmlFor="email"
              style={{ fontSize: '0.85rem' }}
            >
              Ange email:
            </Form.Label>
            <Form.Control
              id="email"
              name="email"
              type="text"
              placeholder="Email..."
              required
              onBlur={() => handleBlur('email')}
            />

            <div
              className={`invalid-feedback fs-6 ${
                touchedFields.email && !isFieldValid('email')
                  ? 'd-block'
                  : 'd-none'
              }`}
            >
              Lämna inte fälten tomt!
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label
              htmlFor="password"
              className="mt-3 text-white"
              style={{ fontSize: '0.85rem' }}
            >
              Ange lösenord:
            </Form.Label>
            <Form.Control
              id="password"
              name="password"
              type="password"
              placeholder="Lösenord..."
              required
              onBlur={() => handleBlur('password')}
            />
            <div
              className={`invalid-feedback fs-6 ${
                touchedFields.password && !isFieldValid('password')
                  ? 'd-block'
                  : 'd-none'
              }`}
            >
              Lämna inte fälten tomt!
            </div>
          </Form.Group>
          <button
            type="submit"
            className="w-50 mx-auto mt-3 rounded-2 btn blue"
          >
            Logga in
          </button>
          <Link
            className="text-center text-warning d-block mt-3"
            to="/register"
          >
            Inget konto? Registrera dig!
          </Link>
        </Form>
      </div>

      <ToastContainer className="p-3" position="top-end">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          bg={toastVariant}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
