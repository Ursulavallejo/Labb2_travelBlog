import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function PostForm({ onClose, onPostCreated, username }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [country, setCountry] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title_blog: title,
          author: username, // Usamos el username pasado como prop
          text_blog: content,
          image_blog: image,
          land_name: country,
          date: new Date().toISOString(),
        }),
      })
      if (response.ok) {
        alert('Post skapad!')
        onClose()
        if (onPostCreated) {
          onPostCreated()
        }
      } else {
        alert('Något gick fel!')
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Titel</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formCountry">
        <Form.Label>Land</Form.Label>
        <Form.Control
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formImage">
        <Form.Label>Bild URL</Form.Label>
        <Form.Control
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formContent">
        <Form.Label>Innehåll</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Skapa Inlägg
      </Button>
    </Form>
  )
}

// PropTypes validation
PostForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onPostCreated: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired, // Validación del username como string requerido
}
