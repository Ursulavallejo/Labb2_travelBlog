# Stage 1: Bygga frontend-filer med Node.js
FROM node AS build-frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Servera frontend med NGINX
FROM nginx:latest
COPY --from=build-frontend /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080

# Stage 3: Backend byggfas
FROM node AS backend
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
ENTRYPOINT ["node", "index.js"]
