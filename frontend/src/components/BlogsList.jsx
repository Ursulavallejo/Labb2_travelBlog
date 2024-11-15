import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PropTypes from 'prop-types';
import BlogCard from './BlogCard';
import EditBlogForm from './EditBlogForm';
import {
  Card,
  Button,
  Container,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
  Modal,
  Toast,
} from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';

export default function BlogsList({ blogs, currentUserId, onDataChange }) {
  const [selectedBlogForReading, setSelectedBlogForReading] = useState(null);
  const [selectedBlogForEditing, setSelectedBlogForEditing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  const tooltipEdit = <Tooltip id="tooltip">Uppdatera inlägget</Tooltip>;
  const tooltipDelete = <Tooltip id="tooltip">Radera inlägget</Tooltip>;

  const confirmDelete = (blogId) => {
    setBlogIdToDelete(blogId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/blogs/${blogIdToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setToastMessage('Bloggen raderades framgångsrikt!');
        setToastVariant('success');
        onDataChange();
      } else {
        setToastMessage('Något gick fel vid radering');
        setToastVariant('danger');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setToastMessage('Ett fel inträffade vid radering');
      setToastVariant('danger');
    } finally {
      setShowDeleteModal(false);
      setShowToast(true);
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
                effect="blur"
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
                    <OverlayTrigger placement="top" overlay={tooltipEdit}>
                      <Button
                        onClick={() => handleUpdate(blog)}
                        className="my-3 mx-2 align-self-end"
                        style={{ cursor: 'pointer' }}
                        variant="outline-dark"
                      >
                        <FaEdit />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" overlay={tooltipDelete}>
                      <Button
                        onClick={() => confirmDelete(blog.blog_id)}
                        className="my-3 mx-2 align-self-end"
                        style={{ cursor: 'pointer' }}
                        variant="outline-dark"
                      >
                        <FaTrash />{' '}
                      </Button>
                    </OverlayTrigger>
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
          Är du säker på att du vill ta bort detta inlägg?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Avbryt
          </Button>
          <Button variant="danger" onClick={handleDelete}>
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
