const path = require('path')

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { Client } = require('pg')

const app = express()
app.use(express.json())
app.use(cors())

dotenv.config()

const client = new Client({
  connectionString: process.env.PGURI,
})
client.connect()

// refresher, GET users
app.get('/users', async (req, res) => {
  try {
    const query = `
  SELECT * FROM users ORDER BY user_id ASC
  `
    const { rows } = await client.query(query)
    res.json(rows)
    res.send({ succes: 'true', users: rows })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(400).send({ error: error })
  }
})

// POST user
app.post('/users/register', async (req, res) => {
  const { first_name, last_name, username, email, pass_word } = req.body
  const query = `
  INSERT INTO users (first_name, last_name, username, email, pass_word) VALUES ($1 ,$2, $3, $4, $5)
  `
  const values = [first_name, last_name, username, email, pass_word]

  try {
    await client.query(query, values)
    res.status(201).send('Registration successful!')
  } catch (error) {
    console.error(error)
    res.status(500).send('Failed to submit!')
  }
})

// POST user and compare user login request with DB
app.post('/users/login', async (req, res) => {
  let email = req.body.email
  let password = req.body.pass_word

  if (email && password) {
    const query = `
    SELECT * FROM users WHERE email = $1 AND password = $2
    `
    const values = [email, password]
    try {
      const results = await client.query(query, values)
      if (results.rows.length > 0) {
        res.status(200).send('Login successful!')
      } else {
        res.status(401).send('Invalid email or password')
      }
    } catch (error) {
      console.error(error)
      res.status(500).send('Failed to submit!')
    }
  } else {
    res.status(400).send('Missing email or password!')
  }
})

// DELETE user
app.delete('/users/delete', async (req, res) => {
  const { email, pass_word } = req.body
  const query = `
DELETE FROM users WHERE email = $1 AND pass_word = $2
`
  const values = [email, pass_word]
  try {
    const results = await client.query(query, values)
    if (results.rowCount === 0) {
      res.status(404).send({ message: 'User not found or incorrect input' })
    }
    res.status(200).send('User deletion successful!')
  } catch (error) {
    res.status(400).send({ error: error })
    console.error('Error: ', error)
  }
})

// GET - blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const query = `
      SELECT blogs.blog_id, blogs.land_name, blogs.image_blog, blogs.title_blog, blogs.text_blog,
             blogs.date, blogs.author, users.username, users.user_id
      FROM blogs
      JOIN users ON blogs.FK_users = users.user_id
      ORDER BY blogs.date DESC
    `
    const { rows } = await client.query(query)
    res.json(rows)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    res.status(500).send('Error fetching blogs')
  }
})

// POST - Create a new blog post
app.post('/api/blogs', async (req, res) => {
  const { title_blog, author, text_blog, image_blog, land_name, date } =
    req.body

  const query = `
    INSERT INTO blogs (title_blog, author, text_blog, image_blog, land_name, date, FK_users)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `
  const values = [
    title_blog,
    author,
    text_blog,
    image_blog,
    land_name,
    date,
    /* FK_users */ 1,
  ] // Change the value of the user depend of the user is logedIn

  try {
    const result = await client.query(query, values)
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'Error creating post' })
  }
})

// GET - alla comments
app.get('/api/comments', async (req, res) => {
  try {
    const query = `
            SELECT comments.comment_id, comments.text_comment, comments.date,
                   users.username, blogs.land_name
            FROM comments
            JOIN users ON comments.FK_users = users.user_id
            JOIN blogs ON comments.FK_blogs = blogs.blog_id
            ORDER BY comments.date DESC
        `
    const { rows } = await client.query(query)
    res.json(rows)
    // console.log(rows);
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({ error: 'Server error fetching comment.' })
  }
})

//GET - a comment by Id
app.get('/api/comments/:id', async (req, res) => {
  const { id } = req.params

  try {
    const query = `
      SELECT comments.comment_id, comments.text_comment, comments.date,
             users.username, blogs.land_name
      FROM comments
      JOIN users ON comments.FK_users = users.user_id
      JOIN blogs ON comments.FK_blogs = blogs.blog_id
      WHERE comments.comment_id = $1;
    `
    const { rows } = await client.query(query, [id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    res.json(rows[0])
  } catch (error) {
    console.error('Error fetching comment:', error)
  }
})

//POST- comments
app.post('/api/comments', async (req, res) => {
  const { text_comment, FK_users, FK_blogs, username } = req.body

  try {
    const query = `
      INSERT INTO comments (text_comment, FK_users, FK_blogs, username)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `
    const values = [text_comment, FK_users, FK_blogs, username]
    const { rows } = await client.query(query, values)
    res.status(201).json(rows[0])
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({ error: 'Server error adding comment.' })
  }
})

//PUT- comments
app.put('/api/comments/:id', async (req, res) => {
  const { id } = req.params
  const { text_comment } = req.body

  try {
    const query = `
      UPDATE comments
      SET text_comment = $1, date = CURRENT_TIMESTAMP
      WHERE comment_id = $2
      RETURNING *;
    `
    const values = [text_comment, id]
    const { rows } = await client.query(query, values)

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    res.json(rows[0])
  } catch (error) {
    console.error('Error updating comment:', error)
    res.status(500).json({ error: 'Server error updating comment.' })
  }
})

// DELETE -comments
app.delete('/api/comments/:id', async (req, res) => {
  const { id } = req.params

  try {
    const query = `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;
    `
    const { rows } = await client.query(query, [id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    res.status(500).json({ error: 'Server error deleting comment.' })
  }
})

// Serve frontend files
app.use(express.static(path.join(path.resolve(), 'dist')))
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`)
})
