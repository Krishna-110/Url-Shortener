# URL Shortener Application

A full-stack, production-ready URL shortener built with **Spring Boot (Java)** for the backend and **React** for the frontend. Features a modern dark UI, public API, expiry, analytics, and more.

---

## 📁 Project Structure

```
urlshortner/
├── urlshortener-frontend/   # React frontend 
├── src/                     # Spring Boot backend source code
├── pom.xml                  # Maven config for backend
├── README.md                # This file
└── ...
```

> **Recommendation:** Move `urlshortener-frontend` inside `urlshortner` for a single-repo (monorepo) setup. This makes versioning, deployment, and collaboration easier.

---

## 🚀 Features
- Shorten any long URL instantly
- Optional expiry for each short link
- List, copy, edit expiry, and delete short URLs
- No login required (public API)
- Beautiful, minimal dark-themed React UI
- MySQL persistent storage (easy to switch to H2/Postgres)
- CORS enabled for frontend-backend integration
- Clean, production-ready code structure

---

## 🛠️ Backend Setup (Spring Boot)

1. **Install Java 17+ and Maven**
2. **Install MySQL** and create a database:
   ```sql
   CREATE DATABASE urlshortenerdb;
   ```
3. **Configure database credentials** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=(whatever you chose)
   spring.datasource.password=(whatever you chose)
   spring.datasource.url=jdbc:mysql://localhost:3306/urlshortenerdb?useSSL=false&serverTimezone=UTC
   ```
4. **Build and run the backend:**
   ```sh
   mvn clean package
   mvn spring-boot:run
   ```
   The backend runs at [http://localhost:8080](http://localhost:8080)

---

## 💻 Frontend Setup (React)

1. **Install Node.js (v18+) and npm**
2. **Navigate to the frontend folder:**
   ```sh
   cd urlshortener-frontend
   npm install
   npm start
   ```
   The frontend runs at [http://localhost:3000](http://localhost:3000)

---

## 🔗 API Endpoints

### Shorten a URL
- **POST** `/api/shorten`
- **Body:**
  ```json
  { "originalUrl": "https://www.example.com", "expiryAt": "2024-12-31T23:59:59" }
  ```
- **Response:**
  ```json
  { "shortUrl": "/AbC123xy", "originalUrl": "https://www.example.com", "expiryAt": "2024-12-31T23:59:59" }
  ```

### Redirect to Original URL
- **GET** `/{shortCode}`
- **Response:** HTTP 302 redirect to the original URL

### List All URLs
- **GET** `/api/urls`
- **Response:** Array of all short-long URL pairs

### Update Expiry
- **PATCH** `/api/urls/{shortCode}/expiry`
- **Body:** `{ "expiryAt": "2024-12-31T23:59:59" }`

### Delete Short URL
- **DELETE** `/api/urls/{shortCode}`

---

## 🖥️ Usage
- Open the frontend in your browser
- Paste a long URL, optionally set expiry, and click **Shorten**
- Copy, edit, or delete your short links as needed
- Share the backend short link (e.g., `http://localhost:8080/AbC123xy`)

---

## 🌐 Deployment
- **Monorepo:** Keep both frontend and backend in one repo for easy deployment
- **Docker:** Add Dockerfiles for backend and frontend for containerized deployment
- **Cloud:** Deploy to Heroku, AWS, Azure, or any cloud provider
- **Custom Domain:** Point your domain to the backend for branded short links

---

## 🧑‍💻 Contributing
Pull requests are welcome! Please open an issue first to discuss major changes.

---

## 📄 License
MIT 
