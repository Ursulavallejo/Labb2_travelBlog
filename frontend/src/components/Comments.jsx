import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AddCommentForm from './AddCommentForm';
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

export default function CommentModal({ blogId, username }) {
  const [comments, setComments] = useState([]);

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
    fetchComments();
  }, [blogId]);

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
    <div style={{ marginTop: '1rem' }}>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.comment_id} style={{ marginBottom: '1rem' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <strong>Användare:</strong> {comment.username}
                {/* {comment.username === username && ( */}
                <Button
                  variant="danger"
                  className="mx-2"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  <FaTrash />
                </Button>
                {/* )} */}
                {/* {comment.username === username && ( */}
                <Button
                  variant="warning"
                  className="mx-2"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  <FaEdit />
                </Button>
                {/* )} */}
              </span>

              <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </p>
            <p>{comment.text_comment}</p>
          </div>
        ))
      ) : (
        <p>Inga kommentarer.</p>
      )}
      <AddCommentForm
        blogId={blogId}
        onCommentAdded={handleCommentAdded}
        username={username}
      />
    </div>
  );
}

CommentModal.propTypes = {
  blogId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
};
