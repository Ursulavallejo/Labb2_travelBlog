DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS comments;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(250) NOT NULL UNIQUE,
    email VARCHAR(200) NOT NULL UNIQUE,
    phone VARCHAR(200) NOT NULL UNIQUE,
    pass_word VARCHAR(100) NOT NULL
);

INSERT INTO users (first_name, last_name, username, email, phone, pass_word)
VALUES ('Pedram', 'Hejazi Kenari', 'pedram_h', 'PHK@ITHS.com', '0707203040', 'hemligt123'),
('John', 'Doe', 'john_d', 'john.doe@example.com', '0710304905', 'password123'),
('Jane', 'Smith', 'jane_s', 'jane.smith@example.com', '031123456', 'password456'),
('Alex', 'Writer', 'alex_w', 'alex.writer@example.com', '072324646757', 'password789');

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
('Sverige', 'sverige_gamlastan.avif', 'Utforska Stockholm: Gamla Stan och Stadens Fantastiska Arkitektur','Gamla Stan, Stockholms äldsta stadsdel, är full av historia och mystik. En rolig och annorlunda plats att besöka är Fängelsemuseet, där du kan dyka in i stadens mörka förflutna. Här får du se gamla celler och höra berättelser om de fångar som en gång suttit här. Museet erbjuder en spännande inblick i medeltidens rättssystem och stadens tidigare brottslighet. Efteråt kan du ta en promenad längs de pittoreska kullerstensgatorna och njuta av en fika på ett av de mysiga kaféerna i området.', 2, 'john_d'),
('Italien', 'italy_toscana.avif', 'Italienska Maträtter och Kulinariska Upplevelser',  'Toscana är en pärla för matälskare, med sina enkla men utsökta rätter fyllda med färska ingredienser från regionen. En rätt att prova är pappa al pomodoro, en värmande tomat- och brödsoppa som fångar essensen av det toskanska köket. Besök en lokal trattoria och njut av bistecca alla fiorentina – en saftig köttbit som är en sann delikatess i regionen. Glöm inte att avrunda måltiden med ett glas chianti-vin och låt dig förföras av Toscanas kulinariska charm!', 3, 'jane_s'),
('Norge', 'norge_auroras.avif', 'Jaga Norrskenet: En Magisk Upplevelse i Norra Norge', 'Norra Norge är en av de bästa platserna i världen för att uppleva norrskenet – ett naturfenomen som fyller himlen med dansande gröna och lila ljus. En perfekt plats att starta ditt äventyr är Tromsø, där du kan följa med på en guidad tur som tar dig bort från stadsljuset för att maximera dina chanser att se detta skådespel. Klä dig varmt, luta dig tillbaka, och njut av en kväll du aldrig kommer glömma när himlen fylls av norrskensmagi!', 4, 'alex_w'),
('Colombia', 'colombia_cartagena.avif',
'Cartagena: En Kulturell och Kulinarisk Skatt i Colombia',
'Cartagena är en färgstark stad som erbjuder en perfekt kombination av historia, mat och natur. Promenera genom de historiska kvarteren och upplev doften av kryddor och havsbris som fyller luften. Missa inte att prova ceviche cartagenero, en klassisk maträtt med fisk och citrus som smälter i munnen. För naturälskare rekommenderas en utflykt till Islas del Rosario, ett paradis med kristallklart vatten och en rik undervattensvärld. Cartagena har något för alla, och varje smak och vy är en upplevelse i sig!',
2, 'john_d'),
('Turkiet', 'turkiet_mosque.avif',
'Upptäck Turkiet: Platserna Du Inte Får Missa',
'Turkiet är ett land med en unik mix av gammalt och nytt. Ett måste är Kapadokien, med sina magiska landskap av stenformationer och luftballongturer vid gryningen. Istanbul bjuder på en blandning av kulturer, där Hagia Sofia står som en symbol för landets rika historia. Missa inte den underjordiska staden Derinkuyu, en av de mest fascinerande platserna i Kapadokien. Här hittar du allt från gamla ruiner till moderna underverk och en gästfrihet som gör att du känner dig som hemma.',
3, 'jane_s'),
('Japan', 'japan_tokio.avif',
'Japan: Ett Land av Tradition och Modernitet',
'Japan erbjuder en spännande mix av gammal tradition och futuristisk innovation. En resa till Kyoto tar dig tillbaka i tiden med sina vackra tempel och teceremonier, medan Tokyo bjuder på en värld av teknologi och neonljus. Besök en onsen för en avkopplande stund i varma källor eller utforska Akihabara, där Japans populärkultur tar över. Japans kultur är unik i världen och lämnar ingen besökare oberörd – här finns alltid något nytt och fascinerande att upptäcka.',
1, 'pedram_h');

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    text_comment TEXT NOT NULL,
    FK_users INT REFERENCES users(user_id),
    FK_blogs INT REFERENCES blogs(blog_id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (text_comment, FK_users, FK_blogs)
VALUES
-- Sverige
('Fantastisk artikel! Jag visste inte att Gamla Stan hade så mycket historia bakom sig.', 2, 1 ),
('Tack för informationen! Fängelsemuseet verkar vara ett intressant stopp.', 3, 1),

-- Italien
('Toscana är verkligen en dröm för matälskare. Tack för tipsen!', 3, 2),
('Jag måste absolut prova pappa al pomodoro! Har du fler tips för Toscana?', 4, 2),

-- Norge
('Norrskenet är på min bucket list! Tack för denna guide till Tromsø.', 4, 3),
('Det låter magiskt! Vilken tid på året är bäst för att se norrskenet?', 2, 3),

-- Colombia
('Cartagena verkar så färgstark! Skulle gärna smaka ceviche där.', 2, 4),
('Fantastisk läsning. Har du några tips för andra matupplevelser i Colombia?', 3, 4),

-- Turkiet
('Kapadokien är verkligen en plats jag vill besöka. Luftballongerna ser så häftiga ut!', 3, 5),
('Turkiets kultur verkar så rik. Jag vill lära mig mer om Derinkuyu.', 4, 5),

-- Japan
('Japan verkar så unikt. Kyoto och Tokyo är definitivt på min resplan!', 4, 6),
('Tack för tipsen! Varma källor låter perfekt för att varva ner.', 2, 6);
