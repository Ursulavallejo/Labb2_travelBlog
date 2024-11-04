const path = require("path");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Client } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

// GET - comments
app.get("/api/comments", async (req, res) => {
  try {
    const query = `
            SELECT comments.comment_id, comments.text_comment, comments.date,
                   users.username, blogs.land_name
            FROM comments
            JOIN users ON comments.FK_users = users.user_id
            JOIN blogs ON comments.FK_blogs = blogs.blog_id
            ORDER BY comments.date DESC
        `;
    const { rows } = await client.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Fel vid hämtning av kommentarer" });
  }
});

//

//

//

//

// Serve frontend files
app.use(express.static(path.join(path.resolve(), "dist")));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
