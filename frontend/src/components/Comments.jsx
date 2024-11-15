import { useContext, useState, useEffect, useCallback } from 'react';
import { UserContext } from '../Context/UserContext';
import PropTypes from 'prop-types';
import AddCommentForm from './AddCommentForm';
import EditCommentForm from './EditCommentForm';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Button, Modal, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function Comments({ blogId }) {
  const [comments, setComments] = useState([]);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const { ID } = useContext(UserContext);

  const tooltipEdit = <Tooltip id="tooltip">Uppdatera</Tooltip>;
  const tooltipDelete = <Tooltip id="tooltip">Radera</Tooltip>;

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
    setCommentToEdit(null);
  };

  const handleCloseEdit = () => {
    setCommentToEdit(null);
  };

  const handleEditComment = (comment) => {
    setCommentToEdit(comment);
  };

  const confirmDelete = (commentId) => {
    setCommentIdToDelete(commentId);
    setShowDeleteModal(true);
  };

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(`/api/comments/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter(
            (comment) => comment.comment_id !== commentIdToDelete
          )
        );
        setToastMessage('Kommentaren raderades framgångsrikt!');
        setToastVariant('success');
      } else {
        setToastMessage('Något gick fel vid borttagning.');
        setToastVariant('danger');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setToastMessage('Ett fel inträffade vid borttagning.');
      setToastVariant('danger');
    } finally {
      setShowDeleteModal(false);
      setShowToast(true);
    }
  };

  return (
    <div
      className="d-flex flex-column border-top border-secondary"
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
              <span className="d-flex align-items-center ">
                <strong>{comment.username} : </strong>
                {Number(comment.fk_users) === Number(ID) && (
                  <>
                    <OverlayTrigger placement="top" overlay={tooltipEdit}>
                      <span>
                        <FaEdit
                          onClick={() => handleEditComment(comment)}
                          className="fs-2 p-2"
                          style={{ cursor: 'pointer' }}
                        />{' '}
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={tooltipDelete}>
                      <span>
                        <FaTrash
                          onClick={() => confirmDelete(comment.comment_id)}
                          className="fs-2 p-2"
                          style={{ cursor: 'pointer' }}
                        />{' '}
                      </span>
                    </OverlayTrigger>
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
        <p className="mx-auto my-2">Inga kommentarer än.</p>
      )}
      <AddCommentForm blogId={blogId} onCommentAdded={handleCommentAdded} />

      {/* Confirm Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Bekräfta Radering</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Är du säker på att du vill ta bort denna kommentar?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Avbryt
          </Button>
          <Button variant="danger" onClick={handleDeleteComment}>
            Radera
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        className="position-fixed bottom-0 end-0 m-3"
        bg={toastVariant}
      >
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
}

Comments.propTypes = {
  blogId: PropTypes.number.isRequired,
};
