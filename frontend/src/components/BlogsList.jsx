import { useState } from 'react';
import PropTypes from 'prop-types';
import BlogCard from './BlogCard';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

export default function BlogsList({ blogs, currentUserId, onDataChange }) {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleDelete = async (blogId) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Inlägg borttaget!');
        onDataChange();
      } else {
        alert('Något gick fel!');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        {blogs.map((blog) => (
          <Col
            key={blog.blog_id}
            md={6}
            lg={4}
            className="mb-4 d-flex align-items-stretch"
          >
            <Card style={{ width: '100%', minHeight: '300px' }}>
              <Card.Img
                variant="top"
                src={blog.image_blog}
                alt={blog.title_blog}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{blog.title_blog}</Card.Title>
                <Card.Text>
                  <strong>Author:</strong> {blog.username} <br />
                  <strong>Date:</strong>{' '}
                  {new Date(blog.date).toLocaleDateString()}
                </Card.Text>
                {blog.user_id === currentUserId && (
                  <Button
                    variant="outline-dark"
                    className="mt-2 align-self-end delete-btn"
                    onClick={() => handleDelete(blog.blog_id)}
                  >
                    <FaTrash className="delete-icon" />
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={() => setSelectedBlog(blog)}
                  className="mt-auto"
                >
                  Visa Bloggpost
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedBlog && (
        <BlogCard blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
    </Container>
  );
}

// PropTypes validation
BlogsList.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      blog_id: PropTypes.number.isRequired,
      title_blog: PropTypes.string.isRequired,
      image_blog: PropTypes.string,
      date: PropTypes.string.isRequired,
      user_id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentUserId: PropTypes.number.isRequired,
  onDataChange: PropTypes.func.isRequired, // Validación para onDataChange
};
