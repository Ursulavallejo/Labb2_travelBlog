import { Modal, Button } from 'react-bootstrap';
import Comments from './Comments';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { FaCommentAlt, FaCommentSlash } from 'react-icons/fa';

export default function BlogCard({ blog, onClose }) {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const imageUrl = blog.image_blog.startsWith('/images/')
    ? blog.image_blog.slice(7) // Remove the first 7 characters
    : blog.image_blog;

  return (
    <Modal show={!!blog} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{blog.title_blog}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="image-container-card">
          <img
            src={imageUrl}
            alt={blog.title_blog}
            className="image-content-card"
          />
        </div>
        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            <strong>Författare:</strong> {blog.username}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'gray' }}>
            {new Date(blog.date).toLocaleDateString()}
          </span>
        </p>
        <p>{blog.text_blog}</p>
        {showComments && <Comments blogId={blog.blog_id} />}
        <div className="d-flex">
          <Button
            variant="outline"
            className="my-2 mx-auto comment-button"
            onClick={toggleComments}
            style={{
              color: 'rgb(116, 200, 233)',
              borderColor: 'rgb(116, 200, 233)',
            }}
          >
            {showComments ? (
              <>
                Dölj <FaCommentSlash />
              </>
            ) : (
              <>
                Visa <FaCommentAlt />
              </>
            )}
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
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
