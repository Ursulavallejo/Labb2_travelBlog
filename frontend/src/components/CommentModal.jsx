import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import CommentForm from './CommentForm';
import { FaTrash } from 'react-icons/fa';

export default function CommentModal({ blogId, username }) {
  const [comments, setComments] = useState([]);
  const [show, setShow] = useState(false);

  // Fetch comments for the specific blog
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?blogId=${blogId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    if (show) fetchComments();
  }, [show, blogId]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCommentAdded = () => {
    fetchComments(); // Refresh comments after a new one is added
  };

  const handleDeleteComment = async (commentId) => {
    const isConfirmed = window.confirm(
      'Är du säker på att du vill ta bort denna kommentar?'
    );

    if (isConfirmed) {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Kommentar borttagen!');
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.comment_id !== commentId)
          );
        } else {
          alert('Något gick fel vid borttagning.');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Visa Kommentarer
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Kommentarer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.comment_id}>
                <h5>{comment.username}</h5>
                <p>{comment.text_comment}</p>
                <small>{new Date(comment.date).toLocaleDateString()}</small>
                {/* {comment.username === username && ( // Check if the logged-in user is the one who wrote the comment */}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  <FaTrash />
                </Button>
                {/* )} */}
              </div>
            ))
          ) : (
            <p>Inga kommentarer.</p>
          )}
          <CommentForm
            blogId={blogId}
            onCommentAdded={handleCommentAdded}
            username={username}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Stäng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

CommentModal.propTypes = {
  blogId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
};
