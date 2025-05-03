# 🚢 Dockerizing a Full Stack Project

Welcome! In this guide, I'll walk you through the process of dockerizing a full stack project (frontend + backend + database), just like we did together. I'll explain each step in simple terms, with tips and code examples. Let's get started!

---

## 🧩 What is Docker and Why Use It?

**Docker** lets you package your app and all its dependencies into containers. This means your app will run the same way everywhere—on your computer, your friend's computer, or a server in the cloud!

- **Frontend**: React/Vite app
- **Backend**: FastAPI app
- **Database**: PostgreSQL

---

## 🏗️ Step 1: Prepare Your Project Structure

A typical project might look like this:

```
project-root/
├── fastapi_backend/
│   ├── Dockerfile
│   └── ...
├── react_todo/
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
└── guide/
    └── docker_guide.md
```

---

## 🖼️ Step 2: Write Dockerfiles

### **Frontend (React/Vite) Dockerfile**

- Use a multi-stage build: first build the app, then serve it with nginx.
- Exclude unnecessary files with `.dockerignore`.

```dockerfile
# Build stage
FROM node:20-slim as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**.dockerignore** example:
```
node_modules
dist
*.log
.git
```

#### 🌐 What is Nginx and Why Do We Use It?

**Nginx** (pronounced "engine-x") is a high-performance web server and reverse proxy. In our Dockerized frontend, we use Nginx to:

- **Serve static files**: It delivers your built React/Vite files (HTML, JS, CSS, images) to users very efficiently.
- **Handle routing for SPAs**: For single-page apps, Nginx can redirect all requests to `index.html` so client-side routing works.
- **Proxy API requests**: It can forward requests (like `/api/...`) to your backend server, so your frontend and backend can communicate seamlessly, even though they're in different containers.

#### Example `nginx.conf` for a React/Vite App

```nginx
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to the backend
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**How does this work?**
- Requests for your app (like `/`, `/about`, `/static/js/main.js`) are served directly from the built files.
- Requests to `/api/...` are forwarded to the backend container (using Docker's internal network), so your frontend can talk to your backend securely and efficiently.

### **Backend (FastAPI) Dockerfile**

- Install dependencies with Poetry
- Run Alembic migrations before starting the app
- Remove build tools after install to keep the image smaller

```dockerfile
FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y gcc \
    && pip install poetry \
    && apt-get purge -y --auto-remove gcc \
    && rm -rf /var/lib/apt/lists/*
COPY pyproject.toml poetry.lock ./
RUN poetry config virtualenvs.create false
RUN poetry install --only main --no-root --no-interaction --no-ansi
COPY . .
RUN echo '#!/bin/sh\npoetry run alembic upgrade head\npoetry run uvicorn app.main:app --host 0.0.0.0 --port 8000\n' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh
EXPOSE 8000
CMD ["/app/entrypoint.sh"]
```

**.dockerignore** example:
```
__pycache__
*.pyc
*.pyo
.venv
.git
```

### **Vite Config Changes for Docker**

When running your Vite (React) app inside Docker, you need to tweak the Vite config so it works smoothly in a containerized environment. Here's what you should add to your `vite.config.ts`:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from outside the container
    port: 5173, // Default Vite port (can be changed if needed)
    strictPort: true, // Fail if port is already in use
    watch: {
      usePolling: true // Ensures file changes are detected in Docker
    }
  }
})
```

**What do these settings do?**
- `host: true`: Makes the dev server listen on all network interfaces, so you can access it from your browser (not just inside the container).
- `port: 5173`: Sets the port for the dev server. You can map this to any port on your host machine.
- `strictPort: true`: Ensures the server fails to start if the port is taken, making debugging easier.
- `watch.usePolling: true`: File system events don't always work in Docker, so polling ensures hot-reload works reliably.

**Tip:**
- If you're only serving the built app with nginx (in production), these settings are less important. But for local development with Docker, they're essential!

---

## 🧩 Step 3: Orchestrate with Docker Compose

`docker-compose.yml` lets you run all your services together:

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./react_todo
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./fastapi_backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgresmaster@db:5432/postgres
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:latest
    ports:
      - "5433:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgresmaster
      - POSTGRES_DB=postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**What does this do?**
- Starts the database, waits for it to be healthy
- Starts the backend, runs migrations, then the API
- Starts the frontend, which proxies API requests to the backend

---

## 🚀 Step 4: Build and Run Everything

From your project root, run:

```sh
docker-compose up --build
```

- Docker will build images if needed and start all containers.
- If you don't have the `postgres` image, Docker will pull it automatically!

---

## 🌍 Step 5: Access Your App

- **Frontend:** [http://localhost:80](http://localhost:80)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Database:** localhost:5433 (for tools like pgAdmin)

---

## ☁️ Step 6: Share Images with Docker Hub

### **A. Tag and Push Your Images**

1. **Login to Docker Hub:**
   ```sh
   docker login
   ```
2. **Tag your images:**
   ```sh
   docker tag exercise_3-frontend:latest yourusername/exercise-frontend:latest
   docker tag exercise_3-backend:latest yourusername/exercise-backend:latest
   ```
3. **Push them:**
   ```sh
   docker push yourusername/exercise-frontend:latest
   docker push yourusername/exercise-backend:latest
   ```

### **B. Use Images on Another Machine**

- Update your `docker-compose.yml` to use the pushed images:

```yaml
frontend:
  image: yourusername/exercise-frontend:latest
  ports:
    - "80:80"
backend:
  image: yourusername/exercise-backend:latest
  ports:
    - "8000:8000"
# ...
```

- On the new machine:
  ```sh
  docker login
  docker-compose up
  ```
- Docker will pull your images from Docker Hub!

---

## 🧹 Cleaning Up Duplicate Images

If you see duplicate images (same IMAGE ID, different tags), it's normal! You can remove extra tags with:

```sh
docker rmi exercise_3-backend:latest
```

This only removes the tag, not the image data.

---

## 🛠️ Troubleshooting & Tips

- **Backend errors about missing tables?**
  - Make sure Alembic migrations run at container startup.
- **Image too large?**
  - Remove build tools after install, use `-slim` images, or try multi-stage builds.
- **Database not ready?**
  - Use `healthcheck` and `depends_on` in compose.
- **Want to seed initial data?**
  - Add a script to your backend entrypoint.

---

## 🎉 You Did It!

You now know how to dockerize a full stack project, share it, and run it anywhere. If you have more questions, just ask—Docker is a powerful tool, and you're well on your way to mastering it!
