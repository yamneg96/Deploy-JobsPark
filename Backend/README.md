# Jobs Park Platform – Backend

This is the **Node.js + Express + MongoDB** backend for the Jobs Park Platform. It handles APIs, authentication, database connections, file uploads, and business logic for clients, workers, and job management.

---

## 📁 Folder Structure

- `configs/` – MongoDB and ImageKit configuration
- `controllers/` – Logic for handling routes
- `middleware/` – Custom middleware (auth, error handling, etc.)
- `models/` – Mongoose models
- `routes/` – API routes
- `server.js` – Entry point of the server

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ethronics/Jobs-park-Platform.git
cd Jobs-park-Platform/Backend

npm install

# .env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url

#in terminal run the server
npm run server
```
