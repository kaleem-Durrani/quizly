# Frontend API Implementation

This directory contains the API client functions for communicating with the backend. Each file corresponds to a specific domain of functionality.

## API Structure

### Authentication API (`authApi.ts`)
- `checkAuthStatus()` - Check if user is authenticated
- `login(credentials)` - Login user (student, teacher, or admin)
- `registerStudent(data)` - Register a new student
- `logout(role)` - Logout user
- `verifyEmail(email, otp)` - Verify student email with OTP
- `resendOTP(email)` - Resend verification OTP
- `forgotPassword(email)` - Request password reset
- `resetPassword(email, otp, newPassword)` - Reset password with OTP
- `changeTeacherPassword(currentPassword, newPassword)` - Change teacher password

### Student API (`studentApi.ts`)
- `getStudentProfile()` - Get student profile
- `updateStudentProfile(data)` - Update student profile
- `getStudentClasses(page, limit, search)` - Get all classes the student is enrolled in
- `getStudentClassById(classId)` - Get a specific class by ID
- `joinClass(joinCode)` - Join a class using a join code
- `getStudentQuizzes(page, limit, search)` - Get all quizzes available to the student
- `getStudentQuizById(quizId)` - Get a specific quiz by ID
- `startQuiz(quizId)` - Start a quiz attempt
- `submitQuiz(quizId, answers)` - Submit a quiz attempt
- `getQuizResults(quizId)` - Get quiz results

### Teacher API (`teacherApi.ts`)
- `getTeacherProfile()` - Get teacher profile
- `updateTeacherProfile(data)` - Update teacher profile
- `getTeacherClasses(page, limit, search)` - Get all classes created by the teacher
- `getTeacherClassById(classId)` - Get a specific class by ID
- `getClassStudents(classId, page, limit, search)` - Get all students in a class
- `removeStudentFromClass(classId, studentId)` - Remove a student from a class
- `regenerateJoinCode(classId)` - Regenerate join code for a class
- `getTeacherQuizzes(page, limit, search)` - Get all quizzes created by the teacher
- `getTeacherQuizById(quizId)` - Get a specific quiz by ID
- `getQuizQuestions(quizId)` - Get all questions for a quiz
- `getQuizResults(quizId, page, limit)` - Get quiz results for all students

### Admin API (`adminApi.ts`)
- `getAdminProfile()` - Get admin profile
- `getTeachers(page, limit, search)` - Get all teachers
- `getTeacherById(teacherId)` - Get a specific teacher by ID
- `createTeacher(teacherData)` - Create a new teacher account
- `updateTeacher(teacherId, teacherData)` - Update a teacher's information
- `resetTeacherPassword(teacherId)` - Reset a teacher's password
- `getStudents(page, limit, search)` - Get all students
- `getStudentById(studentId)` - Get a specific student by ID
- `updateStudent(studentId, studentData)` - Update a student's information
- `getSubjects(page, limit, search)` - Get all subjects
- `getSubjectById(subjectId)` - Get a specific subject by ID
- `createSubject(subjectData)` - Create a new subject
- `updateSubject(subjectId, subjectData)` - Update a subject
- `deleteSubject(subjectId)` - Delete a subject

### Quiz API (`quizApi.ts`)
- `getQuizzes(page, limit, search)` - Get all quizzes
- `getQuizById(quizId)` - Get a specific quiz by ID
- `createQuiz(quizData)` - Create a new quiz
- `createQuizWithQuestions(data)` - Create a quiz with questions in one request
- `updateQuiz(quizId, quizData)` - Update a quiz
- `deleteQuiz(quizId)` - Delete a quiz
- `publishQuiz(quizId)` - Publish a quiz
- `getQuizQuestions(quizId)` - Get all questions for a quiz
- `addQuestionsBatch(quizId, questions)` - Add multiple questions to a quiz in one request
- `getQuizSubmissions(quizId, page, limit)` - Get all submissions for a quiz
- `startQuizAttempt(quizId)` - Start a quiz attempt (for students)

### Class API (`classApi.ts`)
- `getClasses(page, limit, search)` - Get all classes
- `getClassById(classId)` - Get a specific class by ID
- `createClass(classData)` - Create a new class
- `updateClass(classId, classData)` - Update a class
- `deleteClass(classId)` - Delete a class
- `getClassStudents(classId, page, limit, search)` - Get all students in a class
- `getClassQuizzes(classId, page, limit, search)` - Get all quizzes in a class
- `regenerateJoinCode(classId)` - Regenerate join code for a class
- `removeStudentFromClass(classId, studentId)` - Remove a student from a class

### Subject API (`subjectApi.ts`)
- `getSubjects(page, limit, search)` - Get all subjects
- `getSubjectOptions()` - Get all subjects formatted as options for select components
- `getSubjectById(subjectId)` - Get a specific subject by ID
- `createSubject(subjectData)` - Create a new subject
- `updateSubject(subjectId, subjectData)` - Update a subject
- `deleteSubject(subjectId)` - Delete a subject

## Usage

To avoid naming conflicts, you can import the API functions in two ways:

1. Import from the specific API module:
```javascript
import { getStudentProfile } from './api/studentApi';
import { getTeacherProfile } from './api/teacherApi';
```

2. Use the namespaced exports from the index file:
```javascript
import { studentApi, teacherApi } from './api';

// Then use them like this:
studentApi.getStudentProfile();
teacherApi.getTeacherProfile();
```

Authentication functions are directly exported:
```javascript
import { login, logout, checkAuthStatus } from './api';
```
