CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(250) NOT NULL UNIQUE,
    phone INTEGER(20) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    pass_word VARCHAR(100) NOT NULL
);

INSERT INTO users (first_name, last_name, username, email, pass_word)
VALUES ('Pedram', 'Hejazi Kenari', 'PHK', 0707203040, 'PHK@ITHS.com', 'hemligt123'),
('John', 'Doe', 'JD', 'john.doe@example.com', 0710304905, 'password123'),
('Jane', 'Smith', 'JS', 'jane.smith@example.com', 031123456, 'password456'),
('Alex', 'Writer', 'AW', 'alex.writer@example.com', 072324646757, 'password789');

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
('Sverige', 'https://images.unsplash.com/photo-1497217968520-7d8d60b7bc25?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Utforska Stockholm: Gamla Stan och Stadens Fantastiska Arkitektur','Gamla Stan, Stockholms äldsta stadsdel, är full av historia och mystik. En rolig och annorlunda plats att besöka är Fängelsemuseet, där du kan dyka in i stadens mörka förflutna. Här får du se gamla celler och höra berättelser om de fångar som en gång suttit här. Museet erbjuder en spännande inblick i medeltidens rättssystem och stadens tidigare brottslighet. Efteråt kan du ta en promenad längs de pittoreska kullerstensgatorna och njuta av en fika på ett av de mysiga kaféerna i området.', 2, 'John Doe'),
('Italien', 'https://plus.unsplash.com/premium_photo-1676236246841-58ce7f9004a0?q=80&w=1885&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Italienska Maträtter och Kulinariska Upplevelser',  'Toscana är en pärla för matälskare, med sina enkla men utsökta rätter fyllda med färska ingredienser från regionen. En rätt att prova är pappa al pomodoro, en värmande tomat- och brödsoppa som fångar essensen av det toskanska köket. Besök en lokal trattoria och njut av bistecca alla fiorentina – en saftig köttbit som är en sann delikatess i regionen. Glöm inte att avrunda måltiden med ett glas chianti-vin och låt dig förföras av Toscanas kulinariska charm!', 3, 'Jane Smith'),
('Norge', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Jaga Norrskenet: En Magisk Upplevelse i Norra Norge', 'Norra Norge är en av de bästa platserna i världen för att uppleva norrskenet – ett naturfenomen som fyller himlen med dansande gröna och lila ljus. En perfekt plats att starta ditt äventyr är Tromsø, där du kan följa med på en guidad tur som tar dig bort från stadsljuset för att maximera dina chanser att se detta skådespel. Klä dig varmt, luta dig tillbaka, och njut av en kväll du aldrig kommer glömma när himlen fylls av norrskensmagi!', 4, 'Alex Writer'),
('Colombia', 'https://images.unsplash.com/photo-1490465998231-e16519a88298?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
'Cartagena: En Kulturell och Kulinarisk Skatt i Colombia',
'Cartagena är en färgstark stad som erbjuder en perfekt kombination av historia, mat och natur. Promenera genom de historiska kvarteren och upplev doften av kryddor och havsbris som fyller luften. Missa inte att prova ceviche cartagenero, en klassisk maträtt med fisk och citrus som smälter i munnen. För naturälskare rekommenderas en utflykt till Islas del Rosario, ett paradis med kristallklart vatten och en rik undervattensvärld. Cartagena har något för alla, och varje smak och vy är en upplevelse i sig!',
2, 'John Doe'),
('Turkiet', 'https://plus.unsplash.com/premium_photo-1678129531809-0b4c24671913?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
'Upptäck Turkiet: Platserna Du Inte Får Missa',
'Turkiet är ett land med en unik mix av gammalt och nytt. Ett måste är Kapadokien, med sina magiska landskap av stenformationer och luftballongturer vid gryningen. Istanbul bjuder på en blandning av kulturer, där Hagia Sofia står som en symbol för landets rika historia. Missa inte den underjordiska staden Derinkuyu, en av de mest fascinerande platserna i Kapadokien. Här hittar du allt från gamla ruiner till moderna underverk och en gästfrihet som gör att du känner dig som hemma.',
3, 'Jane Smith'),
('Japan', 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
'Japan: Ett Land av Tradition och Modernitet',
'Japan erbjuder en spännande mix av gammal tradition och futuristisk innovation. En resa till Kyoto tar dig tillbaka i tiden med sina vackra tempel och teceremonier, medan Tokyo bjuder på en värld av teknologi och neonljus. Besök en onsen för en avkopplande stund i varma källor eller utforska Akihabara, där Japans populärkultur tar över. Japans kultur är unik i världen och lämnar ingen besökare oberörd – här finns alltid något nytt och fascinerande att upptäcka.',
4, 'Alex Writer');

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    text_comment TEXT NOT NULL,
    FK_users INT REFERENCES users(user_id),
    FK_blogs INT REFERENCES blogs(blog_id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(50) NOT NULL
);

INSERT INTO comments (Text_comment, FK_users, FK_blogs, username)
VALUES
('Fantastisk artikel!', 2, 1, 'john_doe'),
('Väldigt hjälpsamt, tack!', 3, 2, 'jane_smith'),
('Kan du ge fler exempel?', 4, 3, 'alex_writer');
