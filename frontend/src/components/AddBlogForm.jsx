import { Form, Button } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { UserContext } from '../Context/UserContext';
import PropTypes from 'prop-types';

export default function AddBlogForm({ onClose, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [country, setCountry] = useState('');
  const { ID, username } = useContext(UserContext);

  const handleSubmit = async (e) => {
    console.log('ID', ID);
    console.log('username', username);
    e.preventDefault();
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title_blog: title,
          author: username, // use username using context
          text_blog: content,
          image_blog: image,
          land_name: country,
          date: new Date().toISOString(),
          user_id: ID,
        }),
      });
      if (response.ok) {
        onClose();
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        alert('Något gick fel!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
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
