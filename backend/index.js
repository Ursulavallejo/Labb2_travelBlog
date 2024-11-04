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

// GET

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
