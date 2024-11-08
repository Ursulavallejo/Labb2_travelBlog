import { useState } from 'react';
import { Navbar, Nav, Button, Modal } from 'react-bootstrap';
import PostForm from './PostForm';
import PropTypes from 'prop-types';

export default function NavBar({ onPostCreated }) {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">
          <img
            src="/travel.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Travel Icon"
            style={{ marginRight: '8px' }}
          />
          Travel Blog
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Button variant="primary" onClick={handleShow}>
            Nytt Inlägg
          </Button>
        </Nav>
      </Navbar>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Skapa Nytt Blogginlägg</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PostForm onClose={handleClose} onPostCreated={onPostCreated} />
        </Modal.Body>
      </Modal>
    </>
  );
}

NavBar.propTypes = {
  onPostCreated: PropTypes.func.isRequired,
};
