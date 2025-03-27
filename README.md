# 🚀 Node.js Authentication API

This is a REST API for user authentication built with Node.js, Express, and PostgreSQL (Prisma). The API supports user registration, login, profile management, and authentication using JWT tokens.

## 📌 Features

✅ User Registration (Sign Up)  
✅ User Login  
✅ Authentication with JWT  
✅ Get User Profile  
✅ Update User Profile  
✅ Delete User Account  
✅ API Documentation with Swagger  
✅ Input Validation with express-validator  
✅ Error Handling Middleware  
✅ Unit Testing with Jest  

---

## 🛠️ Setup Instructions

### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **PostgreSQL** (or MongoDB if preferred)
- **Git** (optional, for cloning the repo)

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Set Up Data Base
Create a `.env` file in the root directory and add the following:
```env
PORT=4000
DATABASE_URL=postgresql://yourusername:yourpassword@localhost:5432/yourdatabase
SECRET_KEY=your-secret-key
```

### 5️⃣ Run Database Migrations (Prisma)
```sh
npx prisma migrate dev --name init
```

### 6️⃣ Start the Server
```sh
npm run dev
```
The server will run on `http://localhost:4000` 🚀

---

## 📖 API Endpoints

### 🔓 Public Routes
- **Register** → `POST /register`
- **Login** → `POST /login`

### 🔒 Protected Routes (Require Token)
- **Get Profile** → `GET /profile`
- **Update Profile** → `PUT /update-profile`
- **Delete Profile** → `DELETE /delete-profile`

👉 Use the **Authorize** button in Swagger UI to test protected routes.

---

## 📝 API Documentation (Swagger)
Once the server is running, visit:
```
http://localhost:4000/api-docs
```

---

## 🧪 Running Tests
```sh
npm test
```

---

## 🚀 Deployment
You can deploy this project to:
- **Render**
- **Railway**
- **Vercel**
- **AWS EC2**

Ensure you set environment variables in the deployment environment.

---

## 📜 License
This project is licensed under the MIT License.

---

### 🌟 Like this project? Give it a ⭐ on GitHub!
