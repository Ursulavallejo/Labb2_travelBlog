const path = require('path');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Client } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

// refresher, GET users
app.get('/users', async (req, res) => {
  try {
    const query = `
  SELECT * FROM users ORDER BY user_id ASC
  `;
    const { rows } = await client.query(query);
    res.send({ succes: 'true', users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(400).send({ error: error });
  }
});

// GET users by id
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const query = `
  SELECT * FROM users WHERE user_id = $1
  `;
    const values = [userId];
    const { rows } = await client.query(query, values);
    if (rows.length > 0) {
      res.status(200).send({ success: 'true', user: rows[0] });
    } else {
      res
        .status(404)
        .res.send({ success: 'fail', message: 'User could not be found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(400).send({ error: error });
  }
});

// POST user
app.post('/users/register', async (req, res) => {
  const { first_name, last_name, username, email, pass_word } = req.body;
  const query = `
  INSERT INTO users (first_name, last_name, username, email, phone, pass_word) VALUES ($1 ,$2, $3, $4, $5, $6)
  `;
  const values = [first_name, last_name, username, email, phone, pass_word];

  try {
    const results = await client.query(query, values);
    res
      .status(201)
      .send({ message: 'Registration successful!', data: results.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to submit!', error });
  }
});

// POST user and compare user login request with DB
app.post('/users/login', async (req, res) => {
  let email = req.body.email;
  let pass_word = req.body.pass_word;

  if (email && pass_word) {
    const query = `
    SELECT * FROM users WHERE email = $1 AND pass_word = $2
    `;
    const values = [email, pass_word];
    try {
      const results = await client.query(query, values);
      if (results.rows.length > 0) {
        console.log('Loggat in!');
        res
          .status(200)
          .send({ message: 'Login successful!', data: results.rows });
      } else {
        res.status(401).send('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to submit!');
    }
  } else {
    res.status(400).send('Missing email or password!');
  }
});

app.patch('/users/edit/:id', async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, username, phone, email } = req.body;
  const query = `
  UPDATE users SET
  first_name = COALESCE(NULLIF( $1, ''), first_name),
  last_name = COALESCE(NULLIF( $2, ''), last_name),
  username = COALESCE(NULLIF( $3, ''), username),
  phone = COALESCE(NULLIF( $4, ''), phone),
  email = COALESCE(NULLIF( $5, ''), email)
WHERE user_id = $6;
  `;
  const values = [first_name, last_name, username, phone, email, userId];

  try {
    const update = await client.query(query, values);
    if (update.rowCount > 0) {
      res.status(200).send({ success: true, data: update.rows });
    } else {
      res
        .status(400)
        .send({ success: false, message: 'Could not update user details' });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

// DELETE user
app.delete('/users/delete', async (req, res) => {
  const { email, pass_word } = req.body;
  const query = `
DELETE FROM users WHERE email = $1 AND pass_word = $2
`;
  const values = [email, pass_word];
  try {
    const results = await client.query(query, values);
    if (results.rowCount === 0) {
      res.status(404).send({ message: 'User not found or incorrect input' });
    }
    res.status(200).send('User deletion successful!');
  } catch (error) {
    res.status(400).send({ error: error });
    console.error('Error: ', error);
  }
});

// GET - blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const query = `
      SELECT blogs.blog_id, blogs.land_name, blogs.image_blog, blogs.title_blog, blogs.text_blog,
             blogs.date, blogs.author, users.username, users.user_id
      FROM blogs
      JOIN users ON blogs.FK_users = users.user_id
      ORDER BY blogs.date DESC
    `;
    const { rows } = await client.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Error fetching blogs');
  }
});

// POST - Create a new blog post
app.post('/api/blogs', async (req, res) => {
  const {
    title_blog,
    author,
    text_blog,
    image_blog,
    land_name,
    date,
    user_id,
  } = req.body;

  const query = `
    INSERT INTO blogs (title_blog, author, text_blog, image_blog, land_name, date, FK_users)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
  `;
  const values = [
    title_blog,
    author,
    text_blog,
    image_blog,
    land_name,
    date,
    user_id,
    /* FK_users */
  ];

  try {
    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
});

// PUT- Update blog by blog_id
app.put('/api/blogs/:id', async (req, res) => {
  const blogId = req.params.id;
  const { title_blog, text_blog, image_blog, land_name, user_id } = req.body;

  try {
    const result = await client.query(
      `UPDATE blogs
       SET title_blog = $1, text_blog = $2, image_blog = $3, land_name = $4
       WHERE blog_id = $5 AND FK_users = $6
       RETURNING *`,
      [title_blog, text_blog, image_blog, land_name, blogId, user_id]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Blogg uppdaterad framgångsrikt' });
    } else {
      res.status(404).json({
        message: 'Blogg hittades inte eller användaren har inte behörighet',
      });
    }
  } catch (error) {
    console.error('Fel vid uppdatering av bloggen:', error);
    res.status(500).json({ error: 'Fel vid uppdatering av bloggen' });
  }
});

// DELETE blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
  const blogId = req.params.id;

  try {
    const result = await client.query(
      'DELETE FROM blogs WHERE blog_id = $1 RETURNING *',
      [blogId]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Blogg borttagen framgångsrikt' });
    } else {
      res.status(404).json({ message: 'Blogg hittades inte' });
    }
  } catch (error) {
    console.error('Fel vid borttagning av bloggen:', error);
    res.status(500).json({ error: 'Fel vid borttagning av bloggen' });
  }
});

// GET - comments genom att filtrera på blogId
app.get('/api/comments', async (req, res) => {
  const { blogId } = req.query; // Ta emot blogId som en query-param

  let query = `
    SELECT comments.comment_id, comments.text_comment, comments.date,
           users.username, blogs.land_name, comments.FK_users
    FROM comments
    JOIN users ON comments.FK_users = users.user_id
    JOIN blogs ON comments.FK_blogs = blogs.blog_id
    WHERE comments.FK_blogs = $1 ORDER BY comments.date DESC
  `;

  try {
    const { rows } = await client.query(query, [blogId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Server error fetching comment.' });
  }
});

// POST - Create a new comment
app.post('/api/comments', async (req, res) => {
  const { text_comment, date, FK_blogs, FK_users } = req.body;

  const query = `
    INSERT INTO comments (text_comment, date, FK_blogs, FK_users)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [text_comment, date, FK_blogs, FK_users];

  try {
    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Error creating comment' });
  }
});

// PATCH - Update comments
app.patch('/api/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { text_comment } = req.body;

  try {
    const query = `
      UPDATE comments
      SET text_comment = $1, date = CURRENT_TIMESTAMP
      WHERE comment_id = $2
      RETURNING comment_id, text_comment, date, fk_users;
    `;
    const values = [text_comment, id];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      const updatedComment = result.rows[0];

      // Fetch the username from the users table
      const userQuery = `
        SELECT username
        FROM users
        WHERE user_id = $1;
      `;
      const userResult = await client.query(userQuery, [
        updatedComment.fk_users,
      ]);
      const username = userResult.rows[0].username;

      // Return the updated comment along with the username
      res.status(200).json({ ...updatedComment, username });
    } else {
      res.status(404).json({ error: 'Comment not found.' });
    }
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Server error updating comment.' });
  }
});

// DELETE -comments
app.delete('/api/comments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;
    `;
    const { rows } = await client.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Server error deleting comment.' });
  }
});

// Serve frontend files
// app.use(express.static(path.join(path.resolve(), 'dist')));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
