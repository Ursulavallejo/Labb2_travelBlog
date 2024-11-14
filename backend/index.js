const multer = require('multer'),
  path = require('path'),
  express = require('express'),
  cors = require('cors'),
  dotenv = require('dotenv'),
  jwt = require('jsonwebtoken'),
  { Client } = require('pg'),
  { Jimp } = require('jimp'),
  fs = require('fs');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();
//  >>> TO USE MULTER <<<<
//  conf. multer to save images on the folder '/uploads --- this is first creatinf as after delete image'
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // create the file name with timestap
  },
});
// Multer configuration to use memory storage -- this is first saving on temporal store, compress the image and after save it
// const storage = multer.memoryStorage(); // Store the file temporarily in memory

// Filter file type (jpeg/ png) and the size(max. 2MB)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('only JPG / PNG'));
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // max size 2MB
  fileFilter: fileFilter,
});

// stactis files
app.use('/uploads', express.static('uploads'));

// >>> API DATABASE CRUD <<<<

// JWT authenticate
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token krävs' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: 'Ogiltig eller utgången token' });

    console.log('decode payload: ', user.userId);

    req.userId = user.userId;
    next();
  });
};

// refresher, GET users
app.get('/users', async (req, res) => {
  try {
    const query = ` SELECT * FROM users ORDER BY user_id ASC`;
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
    const query = `SELECT * FROM users WHERE user_id = $1 `;
    const values = [userId];
    const { rows } = await client.query(query, values);
    if (rows.length > 0) {
      res.status(200).send({ success: 'true', user: rows[0] });
    } else {
      res
        .status(404)
        .res.send({ success: 'fail', message: 'Användaren kunde inte hittas' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(400).send({ error: error });
  }
});

// POST user
app.post('/users/register', async (req, res) => {
  const { first_name, last_name, username, email, phone, pass_word } = req.body;
  const query = `
  INSERT INTO users (first_name, last_name, username, email, phone, pass_word) VALUES ($1 ,$2, $3, $4, $5, $6)
  `;
  const values = [first_name, last_name, username, email, phone, pass_word];

  try {
    const results = await client.query(query, values);
    res
      .status(201)
      .send({ message: 'Registreringen lyckad!!', data: results.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Det gick inte att skicka in!', error });
  }
});

// POST user and compare user login request with DB
app.post('/users/login', async (req, res) => {
  // const { email, pass_word } = req.body;
  const email = req.body.email;
  const pass_word = req.body.pass_word;

  if (email && pass_word) {
    const query = `SELECT * FROM users WHERE email = $1 AND pass_word = $2 `;
    const values = [email, pass_word];
    try {
      const results = await client.query(query, values);
      if (results.rows.length > 0) {
        const user = results.rows[0];
        const token = jwt.sign(
          { userId: user.user_id },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h',
          }
        );
        res.status(200).send({
          message: 'Inloggningen lyckades!',
          data: user,
          token: token,
        });
      } else {
        res.status(401).send('Ogiltig e-postadress eller lösenord');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Det gick inte att skicka in!');
    }
  } else {
    res.status(400).send('E-post eller lösenord saknas!');
  }
});

//PATCH -Update user
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
      res.status(400).send({
        success: false,
        message: 'Kunde inte uppdatera användarinformation',
      });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

// DELETE user
app.delete('/users/delete', authenticateToken, async (req, res) => {
  const { userId } = req;
  console.log('userId from token ', userId);

  if (!userId) {
    return res.status(400).send({ message: 'Användar-ID saknas' });
  }

  const query = `DELETE FROM users WHERE user_id = $1`;
  const values = [userId];
  try {
    const results = await client.query(query, values);
    console.log('query results ', results);
    if (results.rowCount === 0) {
      return res
        .status(404)
        .send({ message: 'Användaren hittades inte eller felaktig inmatning' });
    }
    return res.status(200).send('Användarens radering lyckades!');
  } catch (error) {
    console.error('Error: ', error);
    if (!res.headersSent) {
      return res.status(500).send({ error: error });
    }
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

    // Process the route of the files
    const processedBlogs = rows.map((blog) => {
      if (blog.image_blog.startsWith('/uploads')) {
        blog.image_blog = `http://localhost:3000${blog.image_blog}`; // upload image
      } else {
        blog.image_blog = `/images/${blog.image_blog}`; // local image assets
      }
      return blog;
    });

    res.json(processedBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send('Fel vid hämtning av bloggen');
  }
});

// POST - Create a new blog post

// JIMP >>> POST route to create a new blog post with image processing --- this is first creating as after delete image
app.post(
  '/api/blogs',
  upload.single('image'), //  Multer
  async (req, res) => {
    const { title_blog, author, text_blog, land_name, date, user_id } =
      req.body;

    if (!land_name) {
      return res
        .status(400)
        .json({ error: 'Fältet landnamn är obligatoriskt' });
    }

    let image_blog = null;
    if (req.file) {
      const filePath = path.resolve(__dirname, 'uploads', req.file.filename);
      const compressedPath = path.resolve(
        __dirname,
        'uploads',
        `compressed-${req.file.filename}`
      );

      try {
        // Read and compress the image with Jimp
        const image = await Jimp.read(filePath);

        // console.log(image.getBuffer('image/jpeg', { quality: 80 }));

        await (await image.resize({ w: 300 })).write(compressedPath);
        // console.log('compressedPath', compressedPath);
        // console.log('filepath', filePath);
        // update `image_blog` to the compressed file THIS IS THE NAME GO TO TEH DATA BASE
        image_blog = `/uploads/compressed-${req.file.filename}`;
        // upload.single(`/uploads/compressed-${req.file.filename}`),
        // delete original file
        fs.unlinkSync(filePath);

        // console.log('Bilden har komprimerats och sparats');
      } catch (error) {
        console.error('Fel vid behandling av bild:', error);
        return res
          .status(500)
          .json({ error: 'Det gick inte att bearbeta bilden' });
      }
    }

    // Save blog data in the database
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
    ];

    try {
      const result = await client.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Det gick inte att skapa inlägget' });
    }
  }
);

// PATCH- Update blog by blog_id
app.patch('/api/blogs/:id', upload.single('image'), async (req, res) => {
  const blogId = req.params.id;
  const { title_blog, text_blog, land_name, user_id } = req.body;
  const image_blog = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    let query = 'UPDATE blogs SET ';
    const values = [];
    let index = 1;

    if (title_blog) {
      query += `title_blog = $${index}, `;
      values.push(title_blog);
      index++;
    }
    if (text_blog) {
      query += `text_blog = $${index}, `;
      values.push(text_blog);
      index++;
    }
    if (land_name) {
      query += `land_name = $${index}, `;
      values.push(land_name);
      index++;
    }
    if (image_blog) {
      query += `image_blog = $${index}, `;
      values.push(image_blog);
      index++;
    }

    query = query.slice(0, -2);

    query += ` WHERE blog_id = $${index} AND FK_users = $${
      index + 1
    } RETURNING *`;
    values.push(blogId, user_id);

    const result = await client.query(query, values);

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
    // Delete fist comments
    await client.query('DELETE FROM comments WHERE FK_blogs = $1', [blogId]);

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
    res.status(500).json({ error: 'Serverfel vid hämtning av kommentar.' });
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
    console.error('Det gick inte att skapa kommentar:', error);
    res.status(500).json({ error: 'Det gick inte att skapa kommentar' });
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
    res.status(500).json({ error: 'Serverfel vid uppdatering av kommentar.' });
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
      return res.status(404).json({ error: 'Kommentaren hittades inte' });
    }

    res.json({ message: 'Kommentaren har raderats!' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Serverfel vid borttagning av kommentar.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
