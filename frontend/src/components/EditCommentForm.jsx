import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

function EditCommentForm({ comment, onUpdate, onCancel }) {
  const [textComment, setTextComment] = useState(comment.text_comment);

  const handleEdit = async (e) => {
    e.preventDefault();
    const updatedComment = { text_comment: textComment };
    onUpdate(comment.comment_id, updatedComment);
  };

  return (
    <div>
      <Form onSubmit={handleEdit} className="d-flex align-items-center">
        <textarea
          className="mx-2"
          placeholder="Edit Comment"
          value={textComment}
          onChange={(e) => setTextComment(e.target.value)}
          required
        />
        <Button className="mx-2 p-1" type="submit" variant="success">
          Uppdatera
        </Button>
        <Button
          className="mx-2 p-1"
          type="button"
          variant="danger"
          onClick={onCancel}
        >
          Avbryt
        </Button>
      </Form>
    </div>
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

export default EditCommentForm;
