import { useContext, useState, useEffect, useCallback } from 'react';
import { UserContext } from '../Context/UserContext';
import PropTypes from 'prop-types';
import AddCommentForm from './AddCommentForm';
import EditCommentForm from './EditCommentForm';
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

export default function Comments({ blogId }) {
  const [comments, setComments] = useState([]);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const { ID } = useContext(UserContext);

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

  const handleCommentUpdated = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.comment_id === updatedComment.comment_id
          ? updatedComment
          : comment
      )
    );
    setCommentToEdit(null); // Stänger redigeringsläget
  };

  // Funktion för att avbryta redigering
  const handleCloseEdit = () => {
    setCommentToEdit(null);
  };

  // Funktion för att välja en kommentar för redigering
  const handleEditComment = (comment) => {
    setCommentToEdit(comment);
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
        style={{ color: '#123456', fontWeight: 'bolder' }}
      >
        Kommentarer
      </h5>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.comment_id}
            style={{ margin: '0.5rem' }}
            className="speech-bubble"
          >
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="d-flex ">
                <strong>{comment.username} : </strong>
                {Number(comment.fk_users) === Number(ID) && (
                  <>
                    <Button
                      className="d-flex align-items-center"
                      variant="outline-dark"
                      size="sm"
                      style={{
                        border: 'none',
                        padding: '0 2px',
                        margin: '2px 4px',
                      }}
                      onClick={() => handleEditComment(comment)}
                    >
                      <FaEdit />
                    </Button>
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
                  </>
                )}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                {new Date(comment.date).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            </p>
            <div className="my-4">
              {' '}
              {commentToEdit &&
                commentToEdit.comment_id === comment.comment_id && (
                  <EditCommentForm
                    comment={commentToEdit}
                    onUpdate={handleCommentUpdated}
                    onCancel={handleCloseEdit}
                  />
                )}
            </div>
            <p>{comment.text_comment}</p>
          </div>
        ))
      ) : (
        <p className="mx-auto my-2">Inga kommentarer.</p>
      )}
      <AddCommentForm blogId={blogId} onCommentAdded={handleCommentAdded} />
    </div>
  );
}

Comments.propTypes = {
  blogId: PropTypes.number.isRequired,
};
