import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

export default function CommentModal() {
  const [comments, setComments] = useState([]);
  const [show, setShow] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await fetch("/api/comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant='primary' onClick={handleShow}>
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
                <small>{comment.date}</small>
              </div>
            ))
          ) : (
            <p>Inga kommentarer.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Stäng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
