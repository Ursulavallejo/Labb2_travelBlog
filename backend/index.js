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

app.get('/', (req, res) => {
  res.send(
    'Hej! Det är hemsida. Kolla din GET resultat med http://localhost:3000/api/tabelname. Jag letade efter längre trots att allt var på gång :D '
  )
})

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
    res.status(400).send({ eeror: error })
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
    res.send('Registeration successful!')
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

// GET - blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const query = `
      SELECT blogs.blog_id, blogs.land_name, blogs.image_blog, blogs.title_blog, blogs.text_blog,
             blogs.date, blogs.author, users.username
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

// GET - comments
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
    console.log(rows)
  } catch (error) {
    console.error('Error fetching comments:', error)
  }
})

//

//

//

//

// Serve frontend files
app.use(express.static(path.join(path.resolve(), 'dist')))
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`)
})
