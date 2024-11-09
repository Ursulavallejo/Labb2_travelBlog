import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

export default function EditCommentForm({ comment, onUpdate, onCancel }) {
  const [updatedText, setUpdatedText] = useState(comment.text_comment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/comments/${comment.comment_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text_comment: updatedText }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        onUpdate(updatedComment);
      } else {
        alert('Error updating comment.');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="editCommentText">
        <Form.Label>Redigera din kommentar</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={updatedText}
          onChange={(e) => setUpdatedText(e.target.value)}
        />
      </Form.Group>
      <Button
        style={{ backgroundColor: '#123456', border: 'none' }}
        type="submit"
        className="mt-2 ms-2 blue"
      >
        Uppdatera
      </Button>
      <Button variant="secondary" onClick={onCancel} className="mt-2 ms-2">
        Avbryt
      </Button>
    </Form>
  );
}

EditCommentForm.propTypes = {
  comment: PropTypes.shape({
    comment_id: PropTypes.number.isRequired,
    text_comment: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
