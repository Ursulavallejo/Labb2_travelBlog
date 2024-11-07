// Here all the post should be showed >>>  using Blog_Card for each post
import { useEffect, useState } from 'react'
// import BlogCard from './BlogCard'
// import PropTypes from 'prop-types'
import { Card, Button, Container, Row, Col } from 'react-bootstrap'

export default function BlogsList() {
  const [data, setData] = useState([])
  // const [showBlogCard, setShowBlogCard] = useState(false)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/blogs')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  // Vi kan använda router params för att hämta varje land. Det är en temporary lösning för att se.
  return (
    <Container>
      <h2>Travel Blogs</h2>
      <Row>
        {data.map((blog) => (
          <Col key={blog.blog_id} md={4} className="mb-3">
            <Card>
              <Card.Img
                variant="top"
                src={blog.image_blog}
                alt={blog.title_blog}
              />
              <Card.Body>
                <Card.Title>{blog.title_blog}</Card.Title>
                <Card.Text>
                  <strong>Author:</strong> {blog.author} <br />
                  <strong>Country:</strong> {blog.land_name} <br />
                  <strong>Date:</strong>{' '}
                  {new Date(blog.date).toLocaleDateString()}
                </Card.Text>
                <Button variant="primary">Read More</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    // <>
    //   <h2>Här visas alla blogginlägg</h2>
    //   <p>Klicka för att visa en bloggpost</p>
    //   data.map
    //   <button
    //     className="btn btn-success"
    //     onClick={() => setShowBlogCard(!showBlogCard)}
    //   >
    //     {showBlogCard ? 'Dölj Bloggpost' : 'Visa Bloggpost'}
    //   </button>
    //   {showBlogCard && <BlogCard />}
    // </>
  )
}
