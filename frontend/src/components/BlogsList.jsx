import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PropTypes from 'prop-types';
import BlogCard from './BlogCard';
import EditBlogForm from './EditBlogForm';
import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function BlogsList({ blogs, currentUserId, onDataChange }) {
  const [selectedBlogForReading, setSelectedBlogForReading] = useState(null);
  const [selectedBlogForEditing, setSelectedBlogForEditing] = useState(null);

  const handleDelete = async (blogId) => {
    const isConfirmed = window.confirm(
      'Är du säker på att du vill ta bort detta inlägg?'
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/blogs/${blogId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          onDataChange();
        } else {
          alert('Något gick fel!');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleUpdate = (blog) => {
    setSelectedBlogForEditing(blog);
  };

  const handleRead = (blog) => {
    setSelectedBlogForReading(blog);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        {blogs.map((blog) => (
          <Col
            data-aos="fade-up"
            key={blog.blog_id}
            md={6}
            lg={4}
            className="mb-4 d-flex align-items-stretch"
          >
            <Card style={{ width: '100%', minHeight: '300px' }}>
              <LazyLoadImage
                alt={blog.title_blog}
                src={blog.image_blog}
                height={200}
                width="100%"
                style={{ objectFit: 'cover' }}
                effect="blur" // Puedes elegir otros efectos como 'opacity' o 'black-and-white'
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{blog.title_blog}</Card.Title>
                <Card.Text>
                  <strong>Författare:</strong> {blog.username} <br />
                  <strong>Datum:</strong>{' '}
                  {new Date(blog.date).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </Card.Text>
                {blog.user_id === Number(currentUserId) && (
                  <div className="btn-container">
                    <Button
                      variant="outline-dark"
                      aria-label="Uppdatera"
                      className="my-3 mx-2 align-self-end "
                      onClick={() => handleUpdate(blog)}
                    >
                      <FaEdit
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Uppdatera"
                      />
                    </Button>
                    <Button
                      variant="outline-dark"
                      aria-label="Radera"
                      className="my-3 mx-2 align-self-end "
                      onClick={() => handleDelete(blog.blog_id)}
                    >
                      <FaTrash
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Radera"
                      />
                    </Button>
                  </div>
                )}
                <Button
                  onClick={() => handleRead(blog)}
                  className="mt-auto blue"
                  style={{ backgroundColor: '#123456', border: 'none' }}
                >
                  Läsa Bloggpost
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedBlogForReading && (
        <BlogCard
          blog={selectedBlogForReading}
          onClose={() => setSelectedBlogForReading(null)}
        />
      )}

      {selectedBlogForEditing && (
        <Modal
          show={!!selectedBlogForEditing}
          onHide={() => setSelectedBlogForEditing(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Redigera Blogg</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EditBlogForm
              blog={selectedBlogForEditing}
              onClose={() => setSelectedBlogForEditing(null)}
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
  currentUserId: PropTypes.number,
  onDataChange: PropTypes.func.isRequired,
};
