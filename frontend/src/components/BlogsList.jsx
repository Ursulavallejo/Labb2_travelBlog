import { useEffect, useState } from 'react'
import BlogCard from './BlogCard'
// import PropTypes from 'prop-types'
import { Card, Button, Container, Row, Col } from 'react-bootstrap'

export default function BlogsList() {
  const [blogs, setBlogs] = useState([])
  const [selectedBlog, setSelectedBlog] = useState(null)
  // const [showBlogCard, setShowBlogCard] = useState(false)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/blogs')
      const result = await response.json()
      setBlogs(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Container>
      <h3 className="text-center">
        Ett fantastiskt äventyr runt om i världen genom våra resenärers ögon,
        som delar sina historier i sina bloggar. Välkommen att uppleva detta
        äventyr med oss...
      </h3>
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
  )
}
