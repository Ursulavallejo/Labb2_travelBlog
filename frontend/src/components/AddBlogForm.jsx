import { Form, Button, Toast } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function AddBlogForm({ onClose, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [country, setCountry] = useState('');
  const { ID, username } = useContext(UserContext);

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success'); // 'success' for green, 'danger' for red

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024;

    if (file && !allowedTypes.includes(file.type)) {
      setToastMessage('Endast JPG- och PNG-filer är tillåtna');
      setToastVariant('danger');
      setShowToast(true);
      setImage(null);
    } else if (file && file.size > maxSize) {
      setToastMessage('Maximal filstorlek är 2 MB');
      setToastVariant('danger');
      setShowToast(true);
      setImage(null);
    } else {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title_blog', title);
      formData.append('author', username);
      formData.append('text_blog', content);
      formData.append('land_name', country);
      formData.append('date', new Date().toISOString());
      formData.append('user_id', ID);

      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('/api/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setToastMessage('Inlägg skapades framgångsrikt!');
        setToastVariant('success');
        setShowToast(true);

        setTimeout(() => {
          onClose();
          if (onPostCreated) {
            onPostCreated();
          }
        }, 1000);
      } else {
        setToastMessage('Något gick fel!');
        setToastVariant('danger');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setToastMessage(
        error.response?.data?.error || 'Det gick inte att skapa inlägget'
      );
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Titel</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formCountry">
          <Form.Label>Land</Form.Label>
          <Form.Control
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formImage">
          <Form.Label>Bild</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} required />
          <Form.Text style={{ fontStyle: 'italic', color: '#555555' }}>
            Endast JPG- och PNG-filer är tillåtna. Maximal storlek på 2MB.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formContent">
          <Form.Label>Innehåll</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <div className="d-flex justify-content-end my-2 mt-4">
          <Button variant="success" type="submit">
            Skapa Inlägg
          </Button>
        </div>
      </Form>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        className="position-fixed bottom-0 end-0 m-3"
        bg={toastVariant}
      >
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
}

// PropTypes validation
AddBlogForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onPostCreated: PropTypes.func.isRequired,
};
