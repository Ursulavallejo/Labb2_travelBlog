CREATE TABLE users >> ID_PK, name, surname, email, password, nickname












CREATE TABLE blogs (
    blog_id serial PRIMARY KEY,
    land_name VARCHAR(100) NOT NULL,
    image_blog TEXT,
    text_blog TEXT NOT NULL,
    FK_user INT REFERENCES "user" (id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(50)
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    text_comment TEXT NOT NULL,
    FK_user INT REFERENCES users(id),
    FK_blog INT REFERENCES blogs(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(50) NOT NULL
);

INSERT INTO comments (Text_comment, FK_user, FK_blog, username)
VALUES
('Fantastisk artikel!', 1, 1, 'john_doe'),
('Väldigt hjälpsamt, tack!', 2, 2, 'jane_smith'),
('Kan du ge fler exempel?', 3, 3, 'alex_writer');











CREATE TABLE comments >>ID_PK, Text_comment, FK_userID , FK_blog, date,
