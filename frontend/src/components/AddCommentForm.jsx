import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function CommentForm({ blogId, onCommentAdded }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_comment: commentText,
          date: new Date().toISOString(),
          FK_blogs: blogId,
          user_id: 1, // TODO Tillfälligt
          username: 'PHK', //TODO
        }),
      });
      if (response.ok) {
        alert('Kommentar skapad!');
        setCommentText('');
        onCommentAdded();
      } else {
        alert('Något gick fel!');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <Form className=" my-2" onSubmit={handleSubmit}>
      <Form.Group controlId="formCommentText">
        <Form.Label>Din kommentar:</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
        />
      </Form.Group>
      <div className="d-flex justify-content-end my-4">
        <Button variant="success" type="submit">
          Skicka
        </Button>
      </div>
    </Form>
  );
}

CommentForm.propTypes = {
  blogId: PropTypes.number.isRequired,
  onCommentAdded: PropTypes.func.isRequired,
};