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
            width: '400px',
            height: '300px',
            display: 'block',
            margin: '0 auto 1rem auto',
            borderRadius: '5px',
          }}
        />
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
