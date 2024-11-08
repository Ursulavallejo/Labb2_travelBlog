import { Modal, Button } from 'react-bootstrap';
import Comments from './Comments';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function BlogCard({ blog, onClose }) {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <Modal show={!!blog} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{blog.title_blog}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={blog.image_blog}
          alt={blog.title_blog}
          style={{
            width: '50%',
            display: 'block',
            margin: '0 auto 1rem auto',
            borderRadius: '5px',
          }}
        />
        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            <strong>Author:</strong> {blog.author}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'gray' }}>
            {new Date(blog.date).toLocaleDateString()}
          </span>
        </p>
        <p>{blog.text_blog}</p>
        {showComments && <Comments blogId={blog.blog_id} />}
        <Button variant="warning" className="m-2" onClick={toggleComments}>
          {showComments ? 'Dölja Kommentarer' : 'Visa Kommentarer'}
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Stäng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// PropTypes validation
BlogCard.propTypes = {
  blog: PropTypes.shape({
    blog_id: PropTypes.number.isRequired,
    land_name: PropTypes.string.isRequired,
    image_blog: PropTypes.string.isRequired,
    title_blog: PropTypes.string.isRequired,
    text_blog: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
