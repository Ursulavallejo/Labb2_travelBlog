const multer = require('multer'),
  path = require('path'),
  express = require('express'),
  cors = require('cors'),
  jwt = require('jsonwebtoken');
(dotenv = require('dotenv')), ({ Client } = require('pg'));
const Jimp = require('jimp');
const fs = require('fs');
// const Jimp = require('jimp').default || require('jimp');

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

  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: 'Invalid or expired token' });

    console.log('decode payload: ', user.userId);

    req.userId = user.userId;
    next();
  });
};

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
  const { first_name, last_name, username, email, phone, pass_word } = req.body;
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
  // const { email, pass_word } = req.body;
  const email = req.body.email;
  const pass_word = req.body.pass_word;

  if (email && pass_word) {
    const query = `
    SELECT * FROM users WHERE email = $1 AND pass_word = $2
    `;
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
        res
          .status(200)
          .send({ message: 'Login successful!', data: user, token: token });
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
      res
        .status(400)
        .send({ success: false, message: 'Could not update user details' });
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
    return res.status(400).send({ message: 'User ID missing' });
  }

  const query = `DELETE FROM users WHERE user_id = $1`;
  const values = [userId];
  try {
    const results = await client.query(query, values);
    console.log('query results ', results);
    if (results.rowCount === 0) {
      return res
        .status(404)
        .send({ message: 'User not found or incorrect input' });
    }
    return res.status(200).send('User deletion successful!');
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
    res.status(500).send('Error fetching blogs');
  }
});

// POST - Create a new blog post

// JIMP >>> POST route to create a new blog post with image processing --- this is first creating as after delete image

// app.post(
//   '/api/blogs',
//   upload.single('image'), //  Multer
//   async (req, res) => {
//     const { title_blog, author, text_blog, land_name, date, user_id } =
//       req.body;

//     if (!land_name) {
//       return res
//         .status(400)
//         .json({ error: 'El campo land_name es obligatorio' });
//     }

//     let image_blog = null;
//     if (req.file) {
//       const filePath = path.resolve(__dirname, 'uploads', req.file.filename);
//       const compressedPath = path.resolve(
//         __dirname,
//         'uploads',
//         `compressed-${req.file.filename}`
//       );

//       try {
//         // Read and compress the image with Jimp
//         const image = await Jimp.read(filePath);
//         await image.resize(300, 200).quality(70).writeAsync(compressedPath);

//         // update `image_blog` to the compressed file
//         image_blog = `/uploads/compressed-${req.file.filename}`;

//         // delete original file
//         fs.unlinkSync(filePath);

//         console.log('Bilden har komprimerats och sparats');
//       } catch (error) {
//         console.error('Fel vid behandling av bild:', error);
//         return res
//           .status(500)
//           .json({ error: 'Det gick inte att bearbeta bilden' });
//       }
//     }

// JIMP >>> POST route to handle file upload, processing with Jimp, and saving to disk--- this is first saving on temporal store, compress the image and after save it
////GET ERROR ON CONSOLE ABOUT AXIOS!!!
// app.post('/api/blogs', upload.single('image'), async (req, res) => {
//   const { title_blog, author, text_blog, land_name, date, user_id } = req.body;

//   if (!land_name) {
//     return res.status(400).json({ error: 'Fältet land_name är obligatoriskt' });
//   }

//   let image_blog = null;
//   if (req.file) {
//     try {
//       // Process image with Jimp from memory
//       const image = await Jimp.read(req.file.buffer);
//       await image.resize(300, 200).quality(70);

//       // Create a unique filename for the compressed image
//       const filename = `compressed-${Date.now()}-${req.file.originalname}`;
//       const filePath = path.resolve(__dirname, 'uploads', filename);

//       // Save the processed image to the 'uploads' directory
//       await image.writeAsync(filePath);
//       image_blog = `/uploads/${filename}`;

//       console.log(
//         'Bilden bearbetades och sparades framgångsrikt på:',
//         image_blog
//       );
//     } catch (error) {
//       console.error('Fel vid bearbetning av bilden med Jimp:', error);
//       return res.status(500).json({ error: 'Fel vid bearbetning av bilden' });
//     }
//   }

// THIS WORKS WITHOUT JIMP // save image to /uploads >>>
// Modidy endpoint /api/blogs and manage  multipart/form-data
app.post(
  '/api/blogs',
  (req, res, next) => {
    // call upload.single handle file
    upload.single('image')(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // multer error handle max size
        return res.status(400).json({ error: err.message });
      } else if (err) {
        // error file type not permited
        return res.status(400).json({
          error:
            'Endast JPG- och PNG-filer med en maximal storlek på 2MB är tillåtna',
        });
      }
      next();
    });
  },
  async (req, res) => {
    const { title_blog, author, text_blog, land_name, date, user_id } =
      req.body;

    const image_blog = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image_blog || null;

    if (!land_name) {
      return res
        .status(400)
        .json({ error: 'Fältet landnamn är obligatoriskt' });
    }

    ///JIMP!!!NOT WORKING!!
    // if (req.file) {
    //   console.log(`Processing image at: uploads/${req.file.filename}`);

    //   Jimp.read(`uploads/${req.file.filename}`)
    //     .then((image) => {
    //       console.log('Image loaded successfully');
    //       return image
    //         .resize(300, 200)
    //         .writeAsync(`uploads/modified-${req.file.filename}`);
    //     })
    //     .then(() => {
    //       console.log('Image resized successfully');
    //       image_blog = `/uploads/modified-${req.file.filename}`;
    //       // Inserta el resto del código que maneja la respuesta después del procesamiento aquí si es necesario
    //     })
    //     .catch((error) => {
    //       console.error('Error processing image:', error);
    //       return res.status(500).json({ error: 'Error processing image' });
    //     });
    // } else {
    //   console.log('image not loaded');
    // }

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
      res.status(500).json({ error: 'Error creating post' });
    }
  }
);

// PUT- Update blog by blog_id
app.patch('/api/blogs/:id', upload.single('image'), async (req, res) => {
  const blogId = req.params.id;
  const { title_blog, text_blog, land_name, user_id } = req.body;
  const image_blog = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    // Construir la consulta dinámicamente
    let query = 'UPDATE blogs SET ';
    const values = [];
    let index = 1;

    // Añadir cada campo solo si está definido
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

    // Eliminar la última coma y espacio
    query = query.slice(0, -2);

    // Añadir la cláusula WHERE
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

// app.put('/api/blogs/:id', upload.single('image'), async (req, res) => {
//   const blogId = req.params.id;
//   const { title_blog, text_blog, land_name, user_id } = req.body;
//   const image_blog = req.file
//     ? `/uploads/${req.file.filename}`
//     : req.body.image_blog;

//   try {
//     const result = await client.query(
//       `UPDATE blogs
//        SET title_blog = $1, text_blog = $2, image_blog = $3, land_name = $4
//        WHERE blog_id = $5 AND FK_users = $6
//        RETURNING *`,
//       [title_blog, text_blog, image_blog, land_name, blogId, user_id]
//     );

//     if (result.rowCount > 0) {
//       res.status(200).json({ message: 'Blogg uppdaterad framgångsrikt' });
//     } else {
//       res.status(404).json({
//         message: 'Blogg hittades inte eller användaren har inte behörighet',
//       });
//     }
//   } catch (error) {
//     console.error('Fel vid uppdatering av bloggen:', error);
//     res.status(500).json({ error: 'Fel vid uppdatering av bloggen' });
//   }
// });

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
