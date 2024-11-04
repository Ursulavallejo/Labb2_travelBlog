CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(250) NOT NULL UNIQUE,
    email VARCHAR(200) NOT NULL UNIQUE,
    pass_word VARCHAR(100) NOT NULL
)

INSERT INTO users (first_name, last_name, username, email, pass_word)
VALUES ('Pedram', 'Hejazi Kenari', 'PHK', 'PHK@ITHS.com', 'hemligt123');
('John', 'Doe', 'JD', 'john.doe@example.com', 'password123'),
('Jane', 'Smith', 'JS', 'jane.smith@example.com', 'password456'),
('Alex', 'Writer', 'AW', 'alex.writer@example.com', 'password789');



CREATE TABLE blogs (
    blog_id serial PRIMARY KEY,
    land_name VARCHAR(100) NOT NULL,
    image_blog TEXT,
    title_blog VARCHAR(100) NOT NULL,
    text_blog TEXT NOT NULL,
    FK_users INT REFERENCES users(user_id) ON DELETE CASCADE,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(50)
);

INSERT INTO blogs (land_name, image_blog, title_blog, text_blog, FK_users, author)
VALUES
('Sverige', 'https://example.com/sverige.jpg', 'Sverige Reseguide', 'En guide till Sveriges bästa resmål.', 2, 'John Doe'),
('Italien', 'https://example.com/italien.jpg', 'Utforska italienska maträtter.',  'Mat i Italien', 3, 'Jane Smith'),
('Norge', 'https://example.com/norge.jpg', 'Norges bästa naturupplevelser.', 'Naturupplevelser i Norge', 4, 'Alex Writer');




CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    text_comment TEXT NOT NULL,
    FK_users INT REFERENCES users(user_id),
    FK_blogs INT REFERENCES blogs(blog_id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(50) NOT NULL
);

INSERT INTO comments (Text_comment, FK_user, FK_blog, username)
VALUES
('Fantastisk artikel!', 1, 1, 'john_doe'),
('Väldigt hjälpsamt, tack!', 2, 2, 'jane_smith'),
('Kan du ge fler exempel?', 3, 3, 'alex_writer');
