import { useState } from 'react';
import PropTypes from 'prop-types';
import BlogCard from './BlogCard';
import EditBlogForm from './EditBlogForm';
import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';

export default function BlogsList({ blogs, currentUserId, onDataChange }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleUpdate = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
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
                  <div className="btn-container">
                    <Button
                      variant="outline-dark"
                      className="m-3 align-self-end "
                      onClick={() => handleUpdate(blog)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-dark"
                      className="m-3 align-self-end "
                      onClick={() => handleDelete(blog.blog_id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )}
                <Button
                  // variant="primary"
                  onClick={() => setSelectedBlog(blog)}
                  className="mt-auto"
                  style={{ backgroundColor: '#123456', border: 'none' }}
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
      {isEditing && selectedBlog && (
        <Modal show={isEditing} onHide={() => setIsEditing(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Redigera Blogg</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditBlogForm
              blog={selectedBlog}
              onClose={() => setIsEditing(false)}
              onUpdate={onDataChange}
              userId={currentUserId}
            />
          </Modal.Body>
        </Modal>
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
  onDataChange: PropTypes.func.isRequired,
};
