import { useState } from 'react';
import { Form, Button, Toast } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function EditForm({ blog, onClose, onUpdate, userId }) {
  const [title, setTitle] = useState(blog.title_blog);
  const [content, setContent] = useState(blog.text_blog);
  const [image, setImage] = useState(null);
  const [country, setCountry] = useState(blog.land_name);

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
      formData.append('user_id', userId);

      if (title !== blog.title_blog) {
        formData.append('title_blog', title);
      }
      if (content !== blog.text_blog) {
        formData.append('text_blog', content);
      }
      if (country !== blog.land_name) {
        formData.append('land_name', country);
      }
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.patch(
        `/api/blogs/${blog.blog_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setToastMessage('Blogg uppdaterad framgångsrikt!');
        setToastVariant('success');
        setShowToast(true);
        onUpdate();
        setTimeout(() => onClose(), 1000); // Delay close to allow toast display
      } else {
        setToastMessage('Något gick fel vid uppdatering');
        setToastVariant('danger');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      setToastMessage(
        error.response?.data?.error || 'Det gick inte att uppdatera bloggen'
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
          <Form.Label>Ny Bild (valfritt)</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
          <Form.Text className="text-muted">
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
        <div className="d-flex justify-content-end my-4">
          <Button
            style={{ backgroundColor: '#123456', border: 'none' }}
            type="submit"
            className="mt-2 ms-2 blue"
          >
            Uppdatera
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

EditForm.propTypes = {
  blog: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};
