import { Link } from "react-router-dom";

export default function Login() {
  return (
    //////////// form to send login data to DB ////////
    <div className='d-flex flex-column'>
      <div id='container' className='d-flex'>
        <form className='d-flex flex-column mx-auto' action=''>
          <label htmlFor='email'>Ange email:</label>
          <input id='email' name='email' type='text' placeholder='Email...' />
          <label htmlFor='password'>Ange lösenord:</label>
          <input
            id='password'
            name='password'
            type='password'
            placeholder='Password...'
          />
          <button type='submit'>Logga in</button>
        </form>
      </div>
      {/* temporal button */}
      <button className='mx-auto'>
        <Link to='/blogs'>TO HOME Temporal button</Link>
      </button>
    </div>
  );
}
