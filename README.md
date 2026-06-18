 Store Rating App

A Full Stack web application where users can submit ratings for registered stores.

 Tech Stack

Backend: NestJS + TypeORM
Database: MySQL (XAMPP)
Frontend: React + Vite

 User Roles

| Role | Access |
|------|--------|
| Admin | Manage users, stores, view all ratings |
| Normal User | Register, login, rate stores |
| Store Owner | View own store ratings |

 Features

 JWT Authentication
 Role-based Access Control
 Store Search (by name and address)
 Rating System (1-5 stars)
 Admin Dashboard with stats
-= Form Validations

 How to Run

Prerequisites
 Node.js
 XAMPP (MySQL)

 Backend
cd backend
npm install
npm run start:dev

 Frontend
cd frontend
npm install
npm run dev

 Database
 Start XAMPP → Apache + MySQL
 Open localhost/phpmyadmin
 Create database: store_rating_db

 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Login |
| GET | /stores | Get all stores |
| POST | /stores | Create store |
| POST | /ratings | Submit rating |
| GET | /ratings/store/:id/average | Get store average |

 Developer
Ram Chavan - Full Stack Developer
Gmail-ramchavan4636@gmail.com