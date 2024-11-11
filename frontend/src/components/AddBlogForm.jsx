import { Form, Button } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function AddBlogForm({ onClose, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // Change to store file
  const [country, setCountry] = useState('');
  const { ID, username } = useContext(UserContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB en bytes

    if (file && !allowedTypes.includes(file.type)) {
      alert('Solo se permiten archivos JPG y PNG');
      setImage(null);
    } else if (file && file.size > maxSize) {
      alert('El tamaño máximo de archivo es 2MB');
      setImage(null);
    } else {
      setImage(file); // save the file if file format and size are correct
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit triggered');

    try {
      const formData = new FormData();
      formData.append('title_blog', title);
      formData.append('author', username);
      formData.append('text_blog', content);
      formData.append('land_name', country);
      formData.append('date', new Date().toISOString());
      formData.append('user_id', ID);

      // Append image file if selected
      if (image) {
        formData.append('image', image);
        console.log('Image appended:', image);
      }

      const response = await axios.post('/api/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response received:', response);

      if (response.status === 200 || response.status === 201) {
        onClose();
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        console.error('Unexpected response status:', response.status);

        alert('Något gick fel!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      console.error(
        'Axios error:',
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
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
        <Form.Control type="file" onChange={handleFileChange} />
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
  );
}

// PropTypes validation
AddBlogForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onPostCreated: PropTypes.func.isRequired,
};
