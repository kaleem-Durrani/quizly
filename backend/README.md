# Quizly Backend

The backend API for Quizly, a platform for teachers and students to create, manage, and take quizzes.

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB & Mongoose
- JWT Authentication with Access & Refresh Tokens
- Express Validator

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Navigate to the backend directory:

```bash
cd backend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root of the backend directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_REFRESH_EXPIRE=7d
```

5. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user (student or teacher)
- `POST /api/users/login` - Authenticate user & get token
- `POST /api/users/refresh` - Refresh access token using refresh token
- `POST /api/users/logout` - Logout and invalidate refresh token
- `POST /api/users/logout-all` - Logout from all devices

### Admin Authentication

- `POST /api/admin/login` - Admin login
- `POST /api/admin/refresh` - Refresh admin access token
- `POST /api/admin/logout` - Admin logout
- `POST /api/admin/logout-all` - Admin logout from all devices

### Users

- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `GET /api/users` - Get all users (teachers only)

### Quizzes (Teacher Only)

- `POST /api/quizzes` - Create a new quiz
- `GET /api/quizzes` - Get all quizzes for a teacher
- `GET /api/quizzes/:id` - Get quiz by ID
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `PUT /api/quizzes/:id/publish` - Publish quiz

### Questions (Teacher Only)

- `POST /api/questions` - Create a new question
- `GET /api/questions` - Get all questions (optionally filtered by quizId)
- `GET /api/questions/:id` - Get question by ID
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `PUT /api/questions/reorder` - Reorder questions

### Submissions

- `POST /api/submissions` - Start a new submission (students only)
- `PUT /api/submissions/:id/answer` - Submit an answer (students only)
- `PUT /api/submissions/:id/complete` - Complete a submission (students only)
- `GET /api/submissions` - Get submissions (filtered by student or quiz)
- `GET /api/submissions/:id` - Get submission by ID
- `PUT /api/submissions/:id/grade` - Grade a submission (teachers only)

### Admin

- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update a user
- `DELETE /api/admin/users/:id` - Delete a user
- `GET /api/admin/quizzes` - Get all quizzes

## Project Structure

```
backend/
├── src/
│   ├── config/      # Configuration files
│   ├── constants/   # Type definitions and constants
│   ├── controllers/ # Route controllers
│   ├── middleware/  # Express middleware
│   ├── models/      # Mongoose models
│   ├── routes/      # Express routes
│   ├── utils/       # Utility functions
│   └── index.ts     # Entry point
├── .env             # Environment variables
├── tsconfig.json    # TypeScript configuration
└── package.json     # Dependencies and scripts
```

## Authentication & Authorization

The API uses a dual token approach for authentication:

### Access Tokens

- Short-lived JWT tokens used for API authentication
- Default expiry: 15 minutes
- Sent in the Authorization header as a Bearer token

### Refresh Tokens

- Long-lived tokens used to obtain new access tokens
- Default expiry: 7 days
- Stored in the database for additional security
- Can be revoked by the server
- Supports logging out from all devices

### Token Flow

1. User logs in and receives both access and refresh tokens
2. Client uses access token for API requests
3. When the access token expires, client uses refresh token to get a new pair
4. Old refresh tokens are invalidated after use (one-time use)

Routes are protected based on user roles:

- Student routes: Only accessible to users with the 'student' role
- Teacher routes: Only accessible to users with the 'teacher' role
- Admin routes: Only accessible to admin users

## Error Handling

The API returns consistent error responses in the following format:

```json
{
  "success": false,
  "error": "Error message",
  "data": [...] // Optional validation errors
}
```

## Data Validation

Input validation is performed using express-validator. All validation errors are returned in the response.
