# Quizly

Quizly is a comprehensive quiz management platform designed for educational environments, allowing teachers to create and manage quizzes while students can join classes and take assessments.

## 🚀 Features

### For Teachers

- Create and manage classes with unique join codes
- Design quizzes with multiple-choice and written questions
- Set time limits and availability windows for quizzes
- Review and grade student submissions
- Track student performance

### For Students

- Join classes using join codes
- Take quizzes within specified time limits
- Review past submissions (if enabled by teacher)
- Track personal progress

### For Administrators

- Manage user accounts (students and teachers)
- Create and manage subjects
- Monitor system usage
- Ban/unban users

## 🛠️ Tech Stack

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication (access & refresh tokens)
- Express Validator for request validation

### Frontend

- React 19
- TypeScript
- Vite

## 📂 Project Structure

```
quizly/
├── backend/             # Node.js Express API
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── constants/   # Type definitions and constants
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # Express routes
│   │   ├── utils/       # Utility functions
│   │   └── index.ts     # Entry point
│   ├── .env             # Environment variables
│   ├── tsconfig.json    # TypeScript configuration
│   └── package.json     # Dependencies and scripts
│
└── frontend/            # React application
    ├── src/
    │   ├── assets/      # Static assets
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── App.tsx      # Main App component
    │   └── main.tsx     # Entry point
    ├── index.html       # HTML template
    ├── vite.config.ts   # Vite configuration
    └── package.json     # Dependencies and scripts
```

## 🔐 Authentication & Authorization

The application uses a dual token approach:

- **Access Tokens**: Short-lived JWTs (15 minutes) for API authentication
- **Refresh Tokens**: Long-lived tokens (7 days) stored in the database for obtaining new access tokens

User roles:

- Student
- Teacher
- Admin

Each role has specific permissions and access to different parts of the application.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=15m
   JWT_REFRESH_SECRET=your_refresh_token_secret_key
   JWT_REFRESH_EXPIRE=7d
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 API Documentation

### Authentication Endpoints

- **Student Authentication**

  - `POST /api/students/auth/register` - Register a new student
  - `POST /api/students/auth/login` - Student login
  - `POST /api/students/auth/refresh` - Refresh student access token
  - `POST /api/students/auth/logout` - Student logout

- **Teacher Authentication**

  - `POST /api/teachers/auth/login` - Teacher login
  - `POST /api/teachers/auth/refresh` - Refresh teacher access token
  - `POST /api/teachers/auth/logout` - Teacher logout

- **Admin Authentication**
  - `POST /api/admin/auth/login` - Admin login
  - `POST /api/admin/auth/refresh` - Refresh admin access token
  - `POST /api/admin/auth/logout` - Admin logout

### Class Management

- `POST /api/classes` - Create a new class (Teacher)
- `GET /api/classes` - Get all classes (Teacher/Student)
- `GET /api/classes/:id` - Get class by ID (Teacher/Student)
- `PUT /api/classes/:id` - Update class (Teacher)
- `POST /api/classes/join` - Join a class using join code (Student)

### Quiz Management

- `POST /api/quizzes` - Create a new quiz (Teacher)
- `GET /api/quizzes` - Get all quizzes (Teacher/Student)
- `GET /api/quizzes/:id` - Get quiz by ID (Teacher/Student)
- `PUT /api/quizzes/:id` - Update quiz (Teacher)
- `DELETE /api/quizzes/:id` - Delete quiz (Teacher)

### Question Management

- `POST /api/questions` - Create a new question (Teacher)
- `GET /api/questions` - Get all questions (Teacher)
- `PUT /api/questions/:id` - Update question (Teacher)
- `DELETE /api/questions/:id` - Delete question (Teacher)

### Subject Management

- `POST /api/subjects` - Create a new subject (Admin)
- `GET /api/subjects` - Get all subjects (Teacher/Student/Admin)
- `PUT /api/subjects/:id` - Update subject (Admin)
- `DELETE /api/subjects/:id` - Delete subject (Admin)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
