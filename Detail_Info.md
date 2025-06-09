# Individual Contribution Report for Fullstack Application

**Software Life Cycle Management Course / ITHS**
**Gothenburg**
**Ursula Vallejo**

**Project:** Travel Blog

**Links:**
[Git repository](https://github.com/Ursulavallejo/Labb2_travelBlog)

## Project Overview

_The Explorer’s Diary_ is a blog platform for adventure seekers and explorers who love to share their journeys and experiences. Users can read inspiring blog posts, create and share their own stories, and engage with a community of like-minded individuals.

The project aimed to develop and deploy a fullstack application with a fully integrated frontend, backend, and database, managed via Docker Compose. The application is implemented and running on a dedicated server hosted on Microsoft Azure. (React, ReactBootstrap, JWT, Argon2, Multer, and Jimp)

Features include creating, updating, and deleting blog posts, as well as user management with personal data protection according to GDPR guidelines. The platform offers a user-friendly environment for exploring and sharing new discoveries and adventures.

---

## Project Development Process

### 1. Initial Configuration

The project started with a session where Gözde and I programmed and created the basic structure and configuration. We focused on building a stable foundation for the project.

### 2. Planning Meeting

Next, we held a group meeting to plan the project structure. We discussed the features to implement and defined a clear vision for the project goals.

### 3. Trello for Project Management

To organize our work, we created a Trello board. It visualized project needs and tasks and was updated throughout the process to maintain a clear overview.

### 4. Development Phase

With a clear plan and organized structure, we implemented features, iterated, and tested the application, following our Trello plan to ensure efficient development.

This process helped us ensure that the project was developed in a structured and successful way.

---

## Focused Development Areas

During the project, we identified three main development areas: user management, comments, and blog posts. Each of us took responsibility for one area:

- **Pedram** — User management
- **Gözde** — Comments functionality
- **I** — Blog post functionality

Each of us developed and improved the database structure for our respective areas and updated it based on group discussions to ensure consistency and functionality.

On the frontend, we developed the parts of the UI corresponding to our areas. We also each created a complete CRUD system for the backend to ensure seamless integration.

Through this collaboration, we worked efficiently to ensure that each part of the project was developed with high quality and aligned with the group’s overall goals.

---

## Contributions to Frontend and Backend

### Frontend

I used a multi-stage Docker build where Node.js installs dependencies and builds the frontend, while NGINX serves static files.
Initially, we had a `compose.yaml` structured by the group, but I took responsibility for developing and optimizing the NGINX configuration.

I created two separate Dockerfiles (frontend and backend) to clearly separate responsibilities and simplify builds.
In the NGINX configuration, I added routes to handle `/api`, `/users`, and `/comments`, increased image handling limits, and added MIME type support.
This allowed NGINX to efficiently serve static files and act as a proxy for the backend, resulting in a fast and optimized application.

The `compose.yaml` was configured to run the frontend on port 80:80, allowing NGINX to communicate directly and serve the application on the standard port.

I also replaced all alerts in the layout with Bootstrap Toasts in React to improve UX feedback.

### Login Error Handling

I implemented error handling on the login page to inform users which field caused an error (email or password).
[Error handling commit](https://github.com/Ursulavallejo/Labb2_travelBlog/commit/2cb8a9df0cf1452ebf8f7efe15d4a8e5ac852992)

---

## Additional Frontend Improvements

I also updated the layout for login, profile, and registration to improve UX. After completing the registration form, users are automatically logged in via local storage and JWT token management.
_Implemented in `Register.jsx`, `index.js`_

For the blog section, I created responsive modal windows using React Bootstrap and Hero, adapting to different screen sizes.

---

## Dockerfile Example (Multi-stage)

```Dockerfile
# Stage 1: Build frontend with Node.js
FROM node:14 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Serve frontend with NGINX
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

---

## Database Initialization Automation with Docker Compose

Before automation, I configured database persistence with volumes in Docker Compose.
PostgreSQL files (`/var/lib/postgresql/data`) are stored outside the Docker container.

To manage the database:

```bash
docker compose exec database psql --username=postgres
```

### Automation steps:

1. Mount `init.sql` as a volume — copied to `/docker-entrypoint-initdb.d/`, allowing PostgreSQL to run it automatically on first start.
2. Configure `depends_on` in Compose to ensure the database is ready before frontend and backend services start.

Example `compose.yaml`:

```yaml
services:
  database:
    image: postgres
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  backend:
    depends_on:
      - database

  frontend:
    depends_on:
      - backend
```

[Compose commit](https://github.com/Ursulavallejo/Labb2_travelBlog/commit/599fbf7aa9b211a0d0e683db88cf0e8d54b86e68)

---

## Backend Configuration and API Routes

I used Express and PostgreSQL to manage user data and blog posts, creating a set of API routes for CRUD operations.

To optimize performance, I used **Jimp** to compress uploaded images and save storage and load time.
All data is handled through parameterized SQL queries with environment variables configured in `.env`:

```env
PGURI=postgres://${DB_USER}:${PASSWORD}@database:5432/${DB_NAME}
```

Compose environment:

```yaml
environment:
  - PGURI=${PGURI}
  - JWT_SECRET=${JWT_SECRET}
```

---

## Image Handling with Multer and Jimp

I added functionality to upload images for each blog post using **Multer** and **Jimp**.

### Example Multer + Jimp Configuration:

```javascript
const multer = require('multer');
const path = require('path');
const Jimp = require('jimp');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPG and PNG are allowed'));
  },
});

app.post('/api/blogs', upload.single('image'), async (req, res) => {
  try {
    if (req.file) {
      const filePath = path.resolve('uploads', req.file.filename);
      const compressedPath = path.resolve(
        'uploads',
        `compressed-${req.file.filename}`
      );

      const image = await Jimp.read(filePath);
      await (await image.resize({ w: 300 })).write(compressedPath);
      fs.unlinkSync(filePath);

      res.status(201).json({ message: 'Blog post with image created!' });
    } else {
      res.status(400).json({ error: 'No image attached' });
    }
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Could not process the image' });
  }
});
```

---

## GDPR Adaptation

I contributed to implementing GDPR-compliant features:

- Modal where users can read about consent and access terms via a link.
- Active consent required when creating an account.
- Users can access their data and delete their account.
- A privacy policy ensures personal data is handled according to GDPR.

---

## Web Optimizations

1. **Responsive images:** Optimized login page by using a single background image on smaller screens to improve loading times on mobile.
2. **Lazy loading:** Implemented lazy loading of blog images using `react-lazy-load-image-component`:

```javascript
import { LazyLoadImage } from 'react-lazy-load-image-component';

const BlogImage = ({ src, alt }) => (
  <LazyLoadImage alt={alt} src={src} effect="blur" />
);

export default BlogImage;
```

3. **Image compression:** Used Jimp to compress uploaded images.
4. **Temporary file cleanup:** Uploaded images are deleted after processing to prevent unnecessary storage usage.

---

## Challenges and Performance Improvements

- Configuring the correct `proxy_pass` and MIME types in NGINX.
- After encountering a `413 Request Entity Too Large` error, I updated `nginx.conf` to allow larger uploads.
- Implemented lazy loading to further improve app performance.

[NGINX config commit](https://github.com/Ursulavallejo/Labb2_travelBlog/commit/947977a7ebb8bd4084f6d195b69d9635f323f581)

Example NGINX configuration:

```nginx
events {}

http {
    include       mime.types;
    default_type  application/octet-stream;
    client_max_body_size 5M;

    server {
        listen 80;

        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://backend-travel:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        location /uploads/ {
            proxy_pass http://backend-travel:3000;
        }

        location /users/ {
            proxy_pass http://backend-travel:3000;
        }
    }
}
```

---

## Handling Jimp Version Update

When updating Jimp, I had to adjust the implementation as the new version required using:

```javascript
const { Jimp } = require('jimp');
await (await image.resize({ w: 300 })).write(compressedPath);
```

---

## Deployment to Azure

When moving the project to Azure, we had to adjust file path and permission handling for images, as behaviors differed between local and server environments.

I documented the changes in `index.js` for both local and server versions (for POST and PATCH blog routes).

---

## Git Workflow and Version Control

I worked both on the master branch and on separate branches to test new features before merging:

- Branch: `blog-card/ursula`
- Branch: `updates-azure/ursula`

This ensured continuous integration and stable code quality. I contributed actively every day and made at least one commit per day as per project requirements.

---

## Conclusion

This project gave me a deeper understanding of building and deploying fullstack applications with Docker Compose and NGINX as a proxy. I actively contributed to frontend, backend, and database handling, as well as implementing GDPR compliance. I look forward to further developing this foundation and applying this methodology to future projects.

[Commit reference](https://github.com/Ursulavallejo/Labb2_travelBlog/commit/b438f6f3ddb42839630a158be4d5aa5a0e750556)
[Branch: blog-card](https://github.com/Ursulavallejo/Labb2_travelBlog/tree/blog-card)
[Branch: updates-azure](https://github.com/Ursulavallejo/Labb2_travelBlog/tree/updates-azure)
