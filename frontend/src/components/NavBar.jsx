export default function NavBar() {
  return (
    <nav className='navbar navbar-light bg-light'>
      <a className='navbar-brand' href='#'>
        {/* Select an image */}
        <img
          src='../assets/images/react.svg'
          width='30'
          height='30'
          className='d-inline-block align-top'
          alt=''
        />
        Find an image / Header Travel Blog
      </a>
    </nav>
  );
}
