import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function EditForm({ blog, onClose, onUpdate, userId }) {
  const [title, setTitle] = useState(blog.title_blog);
  const [content, setContent] = useState(blog.text_blog);
  const [image, setImage] = useState(null); // Cambia a null para almacenar un nuevo archivo
  const [country, setCountry] = useState(blog.land_name);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Almacena el archivo seleccionado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title_blog', title);
      formData.append('text_blog', content);
      formData.append('land_name', country);
      formData.append('user_id', userId); // Incluye el ID del usuario

      // Añade la nueva imagen si fue seleccionada
      if (image) {
        formData.append('image', image);
      } else {
        // Si no se seleccionó una nueva imagen, mantiene la imagen actual
        formData.append('image_blog', blog.image_blog);
      }

      const response = await axios.put(`/api/blogs/${blog.blog_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Blogg uppdaterad!');
        onUpdate();
        onClose();
      } else {
        alert('Något gick fel vid uppdatering');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
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
        <Form.Label>Ny Bild (valfritt)</Form.Label>
        <Form.Control type="file" onChange={handleFileChange} />
        <Form.Text className="text-muted">
          Lämna tom om du vill behålla den nuvarande bilden.
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
  );
}

EditForm.propTypes = {
  blog: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};
