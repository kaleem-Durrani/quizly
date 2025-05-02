import React, { lazy } from 'react';
import { ROUTES } from '../constants/routes';
import { RouteType } from '../constants/types';

/**
 * Lazy-loaded page components
 * This approach improves initial load time by splitting the code into chunks
 * Each page is loaded only when needed
 */

// Public pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const VerifyEmail = lazy(() => import('../pages/VerifyEmail'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminTeachers = lazy(() => import('../pages/admin/Teachers'));
const AdminTeacherDetail = lazy(() => import('../pages/admin/TeacherDetail'));
const AdminCreateTeacher = lazy(() => import('../pages/admin/CreateTeacher'));
const AdminStudents = lazy(() => import('../pages/admin/Students'));
const AdminStudentDetail = lazy(() => import('../pages/admin/StudentDetail'));
const AdminSubjects = lazy(() => import('../pages/admin/Subjects'));
const AdminProfile = lazy(() => import('../pages/admin/Profile'));

// Teacher pages
const TeacherDashboard = lazy(() => import('../pages/teacher/Dashboard'));
const TeacherClasses = lazy(() => import('../pages/teacher/Classes'));
const TeacherClassDetail = lazy(() => import('../pages/teacher/ClassDetail'));
const TeacherClassStudents = lazy(() => import('../pages/teacher/ClassStudents'));
const TeacherQuizzes = lazy(() => import('../pages/teacher/Quizzes'));
const TeacherQuizDetail = lazy(() => import('../pages/teacher/QuizDetail'));
const TeacherCreateQuiz = lazy(() => import('../pages/teacher/CreateQuiz'));
const TeacherEditQuiz = lazy(() => import('../pages/teacher/EditQuiz'));
const TeacherQuizResults = lazy(() => import('../pages/teacher/QuizResults'));
const TeacherProfile = lazy(() => import('../pages/teacher/Profile'));
const TeacherFirstLogin = lazy(() => import('../pages/teacher/FirstLogin'));

// Student pages
const StudentDashboard = lazy(() => import('../pages/student/Dashboard'));
const StudentClasses = lazy(() => import('../pages/student/Classes'));
const StudentClassDetail = lazy(() => import('../pages/student/ClassDetail'));
const StudentQuizzes = lazy(() => import('../pages/student/Quizzes'));
const StudentQuizDetail = lazy(() => import('../pages/student/QuizDetail'));
const StudentTakeQuiz = lazy(() => import('../pages/student/TakeQuiz'));
const StudentQuizResults = lazy(() => import('../pages/student/QuizResults'));
const StudentProfile = lazy(() => import('../pages/student/Profile'));

// Error pages
const NotFound = lazy(() => import('../pages/errors/NotFound'));
const Unauthorized = lazy(() => import('../pages/errors/Unauthorized'));
const Forbidden = lazy(() => import('../pages/errors/Forbidden'));
const ServerError = lazy(() => import('../pages/errors/ServerError'));

/**
 * Route definitions
 * Each route has:
 * - path: URL path
 * - component: React component to render
 * - protected: Whether authentication is required
 * - userType: Required user role (if any)
 * - requiresVerification: Whether this route is for verification flow
 * - layout: Which layout to use (auth, app, or minimal)
 */

// Public routes
export const publicRoutes: RouteType[] = [
  { path: ROUTES.HOME, component: Home, layout: 'minimal' },
  { path: ROUTES.LOGIN, component: Login, layout: 'auth' },
  { path: ROUTES.REGISTER, component: Register, layout: 'auth' },
  { path: ROUTES.FORGOT_PASSWORD, component: ForgotPassword, layout: 'auth' },
  { path: ROUTES.RESET_PASSWORD, component: ResetPassword, layout: 'auth' },
];

// Protected routes that require verification
export const verificationRoutes: RouteType[] = [
  { 
    path: ROUTES.VERIFY_EMAIL, 
    component: VerifyEmail, 
    protected: true,
    requiresVerification: true,
    layout: 'auth'
  },
];

// Admin routes
export const adminRoutes: RouteType[] = [
  { path: ROUTES.ADMIN.DASHBOARD, component: AdminDashboard, protected: true, userType: 'admin', layout: 'app' },
  { path: ROUTES.ADMIN.TEACHERS, component: AdminTeachers, protected: true, userType: 'admin', layout: 'app' },
  { path: ROUTES.ADMIN.TEACHER_DETAIL, component: AdminTeacherDetail, protected: true, userType: 'admin', layout: 'app' },
  { path: ROUTES.ADMIN.CREATE_TEACHER, component: AdminCreateTeacher, protected: true, userType: 'admin', layout: 'app' },
  { path: ROUTES.ADMIN.STUDENTS, component: AdminStudents, protected: true, userType: 'admin', layout: 'app' },
  { path: ROUTES.ADMIN.STUDENT_DETAIL, component: AdminStudentDetail, protected: true, userType: 'admin', layout: 'app' },
  { path: ROUTES.ADMIN.SUBJECTS, component: AdminSubjects, protected: true, userType: 'admin', layout: 'app' },
  { path: ROUTES.ADMIN.PROFILE, component: AdminProfile, protected: true, userType: 'admin', layout: 'app' },
];

// Teacher routes
export const teacherRoutes: RouteType[] = [
  { path: ROUTES.TEACHER.DASHBOARD, component: TeacherDashboard, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.CLASSES, component: TeacherClasses, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.CLASS_DETAIL, component: TeacherClassDetail, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.CLASS_STUDENTS, component: TeacherClassStudents, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.QUIZZES, component: TeacherQuizzes, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.QUIZ_DETAIL, component: TeacherQuizDetail, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.CREATE_QUIZ, component: TeacherCreateQuiz, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.EDIT_QUIZ, component: TeacherEditQuiz, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.QUIZ_RESULTS, component: TeacherQuizResults, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.PROFILE, component: TeacherProfile, protected: true, userType: 'teacher', layout: 'app' },
  { path: ROUTES.TEACHER.FIRST_LOGIN, component: TeacherFirstLogin, protected: true, userType: 'teacher', layout: 'auth' },
];

// Student routes
export const studentRoutes: RouteType[] = [
  { path: ROUTES.STUDENT.DASHBOARD, component: StudentDashboard, protected: true, userType: 'student', layout: 'app' },
  { path: ROUTES.STUDENT.CLASSES, component: StudentClasses, protected: true, userType: 'student', layout: 'app' },
  { path: ROUTES.STUDENT.CLASS_DETAIL, component: StudentClassDetail, protected: true, userType: 'student', layout: 'app' },
  { path: ROUTES.STUDENT.QUIZZES, component: StudentQuizzes, protected: true, userType: 'student', layout: 'app' },
  { path: ROUTES.STUDENT.QUIZ_DETAIL, component: StudentQuizDetail, protected: true, userType: 'student', layout: 'app' },
  { path: ROUTES.STUDENT.TAKE_QUIZ, component: StudentTakeQuiz, protected: true, userType: 'student', layout: 'app' },
  { path: ROUTES.STUDENT.QUIZ_RESULTS, component: StudentQuizResults, protected: true, userType: 'student', layout: 'app' },
  { path: ROUTES.STUDENT.PROFILE, component: StudentProfile, protected: true, userType: 'student', layout: 'app' },
];

// Error routes
export const errorRoutes: RouteType[] = [
  { path: ROUTES.ERROR.NOT_FOUND, component: NotFound, layout: 'minimal' },
  { path: ROUTES.ERROR.UNAUTHORIZED, component: Unauthorized, layout: 'minimal' },
  { path: ROUTES.ERROR.FORBIDDEN, component: Forbidden, layout: 'minimal' },
  { path: ROUTES.ERROR.SERVER_ERROR, component: ServerError, layout: 'minimal' },
];

// Combine all routes
export const routes: RouteType[] = [
  ...publicRoutes,
  ...verificationRoutes,
  ...adminRoutes,
  ...teacherRoutes,
  ...studentRoutes,
  ...errorRoutes,
  // Catch-all route for 404
  { path: '*', component: NotFound, layout: 'minimal' },
];

/* 
NOTE: The actual page components don't exist yet. When you start creating pages,
you'll need to update the imports above to point to the correct files.

For now, this serves as a blueprint for routing structure.
*/
