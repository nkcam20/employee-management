# EmpireOS - Employee Management System

A beautiful, reactive, full-stack Employee Management System built with **Node.js**, **Express**, **MongoDB Atlas**, and **JWT Authentication**.

## 🚀 Live Demo
- **Deployed URL**: [Coming Soon / Provided by User]
- **GitHub Repo**: [https://github.com/nkcam20/employee-management](https://github.com/nkcam20/employee-management)

## ✨ Features
- **Stateless JWT Auth**: Secure login and signup with session-less tokens.
- **Dynamic CRUD**: Full Create, Read, Update, and Delete operations for employees.
- **Real-time Perspective**: Dynamic dashboard stats calculating Avg. Salary, Department distribution and Active Staff count.
- **Ultra-Modern UI**: Custom-built with glassmorphism, aurora backgrounds, and silky-smooth micro-animations.
- **Vercel Ready**: Pre-configured for seamless serverless deployment.

## 🛠️ Tech Stack
- **Frontend**: Vanilla HTML5, CSS3 (Aurora+Glass), JavaScript (ES6+ Fetch)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Security**: JWT (JSON Web Tokens), Bcryptjs (Hashing)

## 📦 Setup & Installation

### 1. Prerequisites
- Node.js installed.
- A MongoDB Atlas account and Cluster.

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Install & Seed
```bash
# Install dependencies
cd backend
npm install

# Seed the database
npm run seed

# Start the server
npm start
```

## 🌐 Deployment (Vercel)
1. Import this repository into Vercel.
2. Add `MONGODB_URI` and `JWT_SECRET` as Environment Variables.
3. Deploy! Vercel handles the `vercel.json` config automatically.

---
Created for EmpireOS Evaluation 2026.
