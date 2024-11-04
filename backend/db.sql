CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(250) NOT NULL UNIQUE,
    email VARCHAR(200) NOT NULL UNIQUE,
    pass_word VARCHAR(100) NOT NULL
)










CREATE TABLE blog (
    blog_id SERIAL PRIMARY KEY,
    land_name VARCHAR(100) NOT NULL,
    image_blog TEXT,
    text_blog TEXT NOT NULL,
    fk_user INT REFERENCES "user" (id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(50)
);













CREATE TABLE comments >>ID_PK, Text_comment, FK_userID , FK_blog, date,
