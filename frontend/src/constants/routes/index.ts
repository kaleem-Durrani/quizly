/**
 * Application routes
 * This file defines all the routes used in the application
 * Centralizing routes makes it easier to manage and update them
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // Student routes
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    CLASSES: '/student/classes',
    CLASS_DETAIL: '/student/classes/:id',
    QUIZZES: '/student/quizzes',
    QUIZ_DETAIL: '/student/quizzes/:id',
    TAKE_QUIZ: '/student/quizzes/:id/take',
    QUIZ_RESULTS: '/student/quizzes/:id/results',
    PROFILE: '/student/profile',
  },
  
  // Teacher routes
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    CLASSES: '/teacher/classes',
    CLASS_DETAIL: '/teacher/classes/:id',
    CLASS_STUDENTS: '/teacher/classes/:id/students',
    QUIZZES: '/teacher/quizzes',
    QUIZ_DETAIL: '/teacher/quizzes/:id',
    CREATE_QUIZ: '/teacher/quizzes/create',
    EDIT_QUIZ: '/teacher/quizzes/:id/edit',
    QUIZ_RESULTS: '/teacher/quizzes/:id/results',
    PROFILE: '/teacher/profile',
    FIRST_LOGIN: '/teacher/first-login',
  },
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    TEACHERS: '/admin/teachers',
    TEACHER_DETAIL: '/admin/teachers/:id',
    CREATE_TEACHER: '/admin/teachers/create',
    STUDENTS: '/admin/students',
    STUDENT_DETAIL: '/admin/students/:id',
    SUBJECTS: '/admin/subjects',
    PROFILE: '/admin/profile',
  },
  
  // Error routes
  ERROR: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/401',
    FORBIDDEN: '/403',
    SERVER_ERROR: '/500',
  }
};

/**
 * Helper function to generate a route with parameters
 * @param route Route template with :param placeholders
 * @param params Object with parameter values
 * @returns Route with parameters replaced
 * 
 * Example:
 * generatePath(ROUTES.TEACHER.CLASS_DETAIL, { id: '123' }) => '/teacher/classes/123'
 */
export const generatePath = (route: string, params: Record<string, string>): string => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};
