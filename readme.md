# DevFolio — Full-Stack Portfolio Builder (MERN)

A modern, full-stack web application that allows developers and creators to build, customize, preview, and publish personalized portfolio websites with unique shareable links.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=flat-square)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20TailwindCSS%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)

---

## 🌟 Key Features

- **🔐 Secure Authentication & Authorization**
  - User registration and login powered by **JWT (JSON Web Tokens)** and **bcrypt** password hashing.
  - Protected dashboard and portfolio management routes.

- **🛠️ Interactive Portfolio Builder**
  - Section-by-section form builder:
    - **Basic Information** (Name, title, bio, avatar)
    - **Contact Info** (Email, social links, location)
    - **Skills** (Categorized technical stack)
    - **Projects** (Titles, descriptions, links, tech tags)
    - **Work Experience** & **Education** timeline

- **👁️ Live Real-Time Preview**
  - Preview how the portfolio looks across desktop and mobile views before publishing.

- **🌐 Public Shareable URL via Slug**
  - Automatically generates clean, collision-free slugs (e.g. `/p/alex-smith-a4b2`).
  - Public portfolios are accessible to recruiters and visitors without requiring login.

- **🎨 Themes & Customization**
  - Choose between different styling themes for the published portfolio.
  - Fully responsive design crafted with **Tailwind CSS** and **DaisyUI**.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** (Component-driven UI)
- **Vite** (Next-generation frontend tooling)
- **Tailwind CSS & DaisyUI** (Utility-first responsive styling)
- **React Router DOM v6** (Client-side routing)
- **Axios** (HTTP client for API requests)

### **Backend**
- **Node.js** & **Express.js** (RESTful API architecture)
- **MongoDB** & **Mongoose** (Document modeling and database persistence)
- **JWT & bcrypt** (Authentication & security)
- **CORS & dotenv** (Environment configuration & cross-origin requests)

---

## 📁 Project Structure

```text
Mernprac/
├── backend/
│   ├── controllers/       # Controller logic (auth, portfolio, user)
│   ├── middleware/        # JWT auth verification middleware
│   ├── models/            # Mongoose schemas (User, Portfolio)
│   ├── routes/            # REST API endpoints
│   ├── .env.example       # Sample environment template
│   └── server.js          # Express app entry point
├── frontend/
│   └── mernPrac/
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   ├── context/       # Global state (PortfolioContext)
│       │   ├── layouts/       # Main, Auth, and Dashboard layouts
│       │   └── pages/         # Page views (Home, Dashboard, PublicPortfolio, etc.)
│       └── vite.config.js
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

---

## 🔌 API Endpoints Overview

### **Auth Routes** (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/signup` | Register a new user | Public |
| `POST` | `/login` | Authenticate user & issue JWT | Public |

### **Portfolio Routes** (`/api/portfolios`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | Fetch all portfolios created by logged-in user | Private (Token required) |
| `POST` | `/` | Create a new portfolio | Private (Token required) |
| `GET` | `/:id` | Get portfolio details by ID | Private (Owner only) |
| `PUT` | `/:id` | Update portfolio details | Private (Owner only) |
| `DELETE` | `/:id` | Delete a portfolio | Private (Owner only) |
| `GET` | `/public/:slug` | View a published portfolio by slug | Public |

### **User Routes** (`/api/users`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/me` | Get logged-in user's profile | Private (Token required) |
| `PUT` | `/me` | Update profile information | Private (Token required) |

---

## ⚙️ Getting Started (Local Setup)

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB
- [Git](https://git-scm.com/)

---

### **1. Clone the Repository**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

---

### **2. Backend Setup**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your configuration inside `.env`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
5. Start the backend server:
   ```bash
   npm start
   ```

---

### **3. Frontend Setup**
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend/mernPrac
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.




