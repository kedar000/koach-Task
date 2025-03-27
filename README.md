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
git clone https://github.com/kedar000/koach-Task.git
cd cd koach-Task/backend
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Set Up Data Base
Navigate to backend/src/db/prisma/schema.prisma file and update the database url in that file 

### 5️⃣ Run Database Migrations (Prisma)
```sh
cd src/db
```
```sh
npx prisma migrate dev --name init
npx prisma generate
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


### Have a nice day;
