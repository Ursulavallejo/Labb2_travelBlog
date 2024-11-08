import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import AddCommentForm from './AddCommentForm';
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

export default function CommentModal({ blogId, username }) {
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?blogId=${blogId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [blogId]);

  useEffect(() => {
    fetchComments();
  }, [blogId, fetchComments]);

  const handleCommentAdded = () => {
    fetchComments();
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
    <div
      className="d-flex flex-column border-top border-secondary "
      style={{ marginTop: '3rem' }}
    >
      <h5
        className="mx-auto my-2"
        style={{ color: '#0dcaf0', fontWeight: 'bolder' }}
      >
        Kommentarer
      </h5>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.comment_id} style={{ margin: '1rem' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="d-flex ">
                <strong className="me-2">Användare: </strong> {comment.username}{' '}
                {/* {comment.username === username && ( */}
                <Button
                  className="d-flex align-items-center"
                  variant="outline-dark"
                  size="sm"
                  style={{
                    border: 'none',
                    padding: '0 2px',
                    margin: '2px 4px',
                  }}
                  onClick={() => handleDeleteComment(comment.comment_id)}
                >
                  <FaTrash />
                </Button>
                {/* )} */}
                {/* {comment.username === username && ( */}
                <Button
                  className="d-flex align-items-center"
                  variant="outline-dark"
                  size="sm"
                  style={{
                    border: 'none',
                    padding: '0 2px',

                    margin: '2px 4px',
                  }}
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
        <p className="mx-auto my-2">Inga kommentarer.</p>
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
