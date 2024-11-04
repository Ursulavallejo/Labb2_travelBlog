CREATE TABLE users >> ID_PK, name, surname, email, password, nickname












CREATE TABLE blogs (
    blog_id serial PRIMARY KEY,
    land_name VARCHAR(100) NOT NULL,
    image_blog TEXT,
    text_blog TEXT NOT NULL,
    fk_user INT REFERENCES "user" (id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(50)
);













CREATE TABLE comments >>ID_PK, Text_comment, FK_userID , FK_blog, date,
