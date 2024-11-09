import { useState, useContext } from 'react';
import { Navbar, Nav, Button, Modal } from 'react-bootstrap';
import AddBlogForm from './AddBlogForm';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserContext } from '../Context/UserContext';

export default function NavBar({ onPostCreated }) {
  const [showModal, setShowModal] = useState(false);
  const { ID } = useContext(UserContext);
  const navigate = useNavigate();

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleLogout = () => {
    ID(null);
    navigate('/');
  };

  return (
    <>
      <Navbar expand="lg" fixed="top" style={{ backgroundColor: '#123456' }}>
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <img
            src="/travel.svg"
            width="60"
            height="60"
            className="d-inline-block align-center"
            alt="Travel Icon"
            style={{ marginRight: '18px', marginLeft: '18px' }}
          />
          <span style={{ color: '#e27e0a', fontWeight: '600' }}>
            Travel Blog
          </span>
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="outline-light m-2 " onClick={handleShow}>
            Nytt Inlägg
          </Button>
          <Link to={'/profile'}>
            <Button
              variant="outline-light m-2 d-flex align-items-center"
              onClick={() => {}}
            >
              <FaUser className="me-1" />
              User konto
            </Button>
          </Link>
          <Button
            variant="secondary m-2 d-flex align-items-center "
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-1" />
            Log Out
          </Button>
        </Nav>
      </Navbar>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Skapa Nytt Blogginlägg</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddBlogForm onClose={handleClose} onPostCreated={onPostCreated} />
        </Modal.Body>
      </Modal>
    </>
  );
}

NavBar.propTypes = {
  onPostCreated: PropTypes.func.isRequired,
};
