import { Link } from 'react-router-dom';

export default function Login() {
  function loginForm(e) {
    e.preventDefault();
    document.getElementById('login').reset();
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
      <div id="container" className="login-container d-flex rounded-5 p-5">
        <div>
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
          <button type="submit" className="w-50 mx-auto mt-3 rounded-2">
            Logga in
          </button>
        </form>
        <button className="mx-auto">
          <Link to="/blogs">TO HOME Temporal button</Link>
        </button>
      </div>
    </div>

    // >>>>>>>   WHAT WE HAD BEFORE !! I Comment it in case you prefer the previous version <<<<<<<

    // <div className="d-flex flex-column justify-content-center align-items-center my-auto">
    //   <div
    //     id="container"
    //     className="d-flex rounded-5 p-5"
    //     style={{ background: '#0077B6' }}
    //   >
    //     <form
    //       id="login"
    //       className="d-flex flex-column mx-auto"
    //       action=""
    //       onSubmit={loginForm}
    //     >
    //       <label htmlFor="email">Ange email:</label>
    //       <input
    //         id="email"
    //         name="email"
    //         type="text"
    //         placeholder="Email..."
    //         required
    //       />
    //       <label htmlFor="password" className="mt-3">
    //         Ange lösenord:
    //       </label>
    //       <input
    //         id="password"
    //         name="password"
    //         type="password"
    //         placeholder="Password..."
    //         required
    //       />
    //       <button type="submit" className="w-50 mx-auto mt-3 rounded-2">
    //         Logga in
    //       </button>
    //     </form>
    //   </div>
    //   {/* temporal button */}
    //   <button className="mx-auto">
    //     <Link to="/blogs">TO HOME Temporal button</Link>
    //   </button>
    // </div>
  );
}
