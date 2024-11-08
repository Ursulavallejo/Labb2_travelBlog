import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function EditForm({ blog, onClose, onUpdate, userId }) {
  const [title, setTitle] = useState(blog.title_blog);
  const [content, setContent] = useState(blog.text_blog);
  const [image, setImage] = useState(blog.image_blog);
  const [country, setCountry] = useState(blog.land_name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/blogs/${blog.blog_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title_blog: title,
          text_blog: content,
          image_blog: image,
          land_name: country,
          user_id: userId, // check id_user
        }),
      });

      if (response.ok) {
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
        <Form.Label>Bild URL</Form.Label>
        <Form.Control
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
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
      <Button variant="primary" type="submit">
        Uppdatera Blogg
      </Button>
    </Form>
  );
}

EditForm.propTypes = {
  blog: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};
