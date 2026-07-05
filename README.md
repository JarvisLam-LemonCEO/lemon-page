# 🍋 Lemon Page

> A modern Yellow Pages web application built with **React (Vite)**, **Node.js (Express)**, and **SQLite**.

Lemon Page helps users discover local businesses and services while providing business owners with a platform to manage their listings.

---

## 📖 Overview

Lemon Page is a full-stack directory application inspired by Yellow Pages, Yelp, and Google Business.

The application supports two types of users:

- 👤 Normal User
- 🏢 Business User

Normal users can search for services, save favorites, and view business information.

Business users can create, edit, and manage their own service listings.

---

## ✨ Features

### 🌐 Landing Page

- Modern Lemon-themed UI
- Browse newly listed services
- Filter by:
  - Category
  - Zip Code
  - State
  - Country
- Responsive design

---

### 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Public Routes
- Role-based navigation

---

### 👤 Normal User

- Search services
- Filter services
- View detailed service information
- Recently viewed services
- Search history
- Save search history
- Clear search history
- Favorite / Save services
- View Favorites page
- Share service information

---

### 🏢 Business User

- Dashboard
- Business statistics
- Create service listing
- Edit listing (Popup)
- Delete listing (Confirmation popup)
- Feature / Unfeature listing
- Manage all listings

---

### 👤 Profile Management

- View account information
- Delete account
- Delete all owned listings automatically

---

### 📊 Dashboard Statistics

Business dashboard displays:

- Total Listings
- Total Views
- Total Favorites
- Featured Listings

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS3

### Backend

- Node.js
- Express.js

### Database

- SQLite

### Authentication

- JWT
- bcrypt

---

## 📁 Project Structure

```text
lemon-page
│
├── client
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── data
│   │   ├── pages
│   │   └── styles
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── database
│   └── uploads
│
└── README.md

## 🚀 Installation
Clone the repository
```bash
git clone https://github.com/yourusername/lemon-page.git
```
Frontend
```bash
cd client
npm install
npm run dev
```
Backend
```bash
cd server
npm install
npm run dev
```