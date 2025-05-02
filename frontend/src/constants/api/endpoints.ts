/**
 * API endpoints
 * This file defines all the API endpoints used in the application
 * Centralizing endpoints makes it easier to manage and update them
 */

// Base API URL - can be overridden by environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  // General auth endpoints
  STATUS: `${API_BASE_URL}/auth/status`,
  ADMIN_STATUS: `${API_BASE_URL}/auth/admin/status`,

  // Student auth endpoints
  STUDENT_REGISTER: `${API_BASE_URL}/students/auth/register`,
  STUDENT_LOGIN: `${API_BASE_URL}/students/auth/login`,
  STUDENT_LOGOUT: `${API_BASE_URL}/students/auth/logout`,
  STUDENT_LOGOUT_ALL: `${API_BASE_URL}/students/auth/logout-all`,
  STUDENT_REFRESH: `${API_BASE_URL}/students/auth/refresh`,
  STUDENT_VERIFY_EMAIL: `${API_BASE_URL}/students/auth/verify-email`,
  STUDENT_RESEND_OTP: `${API_BASE_URL}/students/auth/resend-otp`,
  STUDENT_FORGOT_PASSWORD: `${API_BASE_URL}/students/auth/forgot-password`,
  STUDENT_RESET_PASSWORD: `${API_BASE_URL}/students/auth/reset-password`,

  // Teacher auth endpoints
  TEACHER_LOGIN: `${API_BASE_URL}/teachers/auth/login`,
  TEACHER_LOGOUT: `${API_BASE_URL}/teachers/auth/logout`,
  TEACHER_LOGOUT_ALL: `${API_BASE_URL}/teachers/auth/logout-all`,
  TEACHER_REFRESH: `${API_BASE_URL}/teachers/auth/refresh`,
  TEACHER_CHANGE_PASSWORD: `${API_BASE_URL}/teachers/auth/change-password`,

  // Admin auth endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/admin/auth/login`,
  ADMIN_LOGOUT: `${API_BASE_URL}/admin/auth/logout`,
  ADMIN_LOGOUT_ALL: `${API_BASE_URL}/admin/auth/logout-all`,
  ADMIN_REFRESH: `${API_BASE_URL}/admin/auth/refresh`,
};

// Student endpoints
export const STUDENT_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/students/profile`,
  CLASSES: `${API_BASE_URL}/students/classes`,
  JOIN_CLASS: `${API_BASE_URL}/students/classes/join`,
  CLASS_DETAIL: (classId: string) => `${API_BASE_URL}/students/classes/${classId}`,
  QUIZZES: `${API_BASE_URL}/students/quizzes`,
  QUIZ_DETAIL: (quizId: string) => `${API_BASE_URL}/students/quizzes/${quizId}`,
  START_QUIZ: (quizId: string) => `${API_BASE_URL}/students/quizzes/${quizId}/start`,
  SUBMIT_QUIZ: (quizId: string) => `${API_BASE_URL}/students/quizzes/${quizId}/submit`,
  QUIZ_RESULTS: (quizId: string) => `${API_BASE_URL}/students/quizzes/${quizId}/results`,
};

// Teacher endpoints
export const TEACHER_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/teachers/profile`,
  CLASSES: `${API_BASE_URL}/teachers/classes`,
  CLASS_DETAIL: (classId: string) => `${API_BASE_URL}/teachers/classes/${classId}`,
  CLASS_STUDENTS: (classId: string) => `${API_BASE_URL}/teachers/classes/${classId}/students`,
  REMOVE_STUDENT: (classId: string, studentId: string) =>
    `${API_BASE_URL}/teachers/classes/${classId}/students/${studentId}`,
  REGENERATE_JOIN_CODE: (classId: string) =>
    `${API_BASE_URL}/teachers/classes/${classId}/regenerate-code`,
  QUIZZES: `${API_BASE_URL}/teachers/quizzes`,
  QUIZ_DETAIL: (quizId: string) => `${API_BASE_URL}/teachers/quizzes/${quizId}`,
  QUIZ_QUESTIONS: (quizId: string) => `${API_BASE_URL}/teachers/quizzes/${quizId}/questions`,
  QUIZ_RESULTS: (quizId: string) => `${API_BASE_URL}/teachers/quizzes/${quizId}/results`,
};

// Admin endpoints
export const ADMIN_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/admin/profile`,
  TEACHERS: `${API_BASE_URL}/admin/teachers`,
  TEACHER_DETAIL: (teacherId: string) => `${API_BASE_URL}/admin/teachers/${teacherId}`,
  STUDENTS: `${API_BASE_URL}/admin/students`,
  STUDENT_DETAIL: (studentId: string) => `${API_BASE_URL}/admin/students/${studentId}`,
  SUBJECTS: `${API_BASE_URL}/admin/subjects`,
  SUBJECT_DETAIL: (subjectId: string) => `${API_BASE_URL}/admin/subjects/${subjectId}`,
};

// Quiz endpoints
export const QUIZ_ENDPOINTS = {
  LIST: `${API_BASE_URL}/quizzes`,
  DETAIL: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}`,
  CREATE: `${API_BASE_URL}/quizzes`,
  UPDATE: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}`,
  DELETE: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}`,
  QUESTIONS: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}/questions`,
  ADD_QUESTIONS_BATCH: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}/questions/batch`,
  SUBMISSIONS: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}/submissions`,
  START: (quizId: string) => `${API_BASE_URL}/quizzes/${quizId}/start`,
};

// Class endpoints
export const CLASS_ENDPOINTS = {
  LIST: `${API_BASE_URL}/classes`,
  DETAIL: (classId: string) => `${API_BASE_URL}/classes/${classId}`,
  CREATE: `${API_BASE_URL}/classes`,
  UPDATE: (classId: string) => `${API_BASE_URL}/classes/${classId}`,
  DELETE: (classId: string) => `${API_BASE_URL}/classes/${classId}`,
  STUDENTS: (classId: string) => `${API_BASE_URL}/classes/${classId}/students`,
  QUIZZES: (classId: string) => `${API_BASE_URL}/classes/${classId}/quizzes`,
  REGENERATE_JOIN_CODE: (classId: string) => `${API_BASE_URL}/classes/${classId}/regenerate-code`,
  REMOVE_STUDENT: (classId: string, studentId: string) =>
    `${API_BASE_URL}/classes/${classId}/students/${studentId}`,
};

// Subject endpoints
export const SUBJECT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/subjects`,
  DETAIL: (subjectId: string) => `${API_BASE_URL}/subjects/${subjectId}`,
  CREATE: `${API_BASE_URL}/subjects`,
  UPDATE: (subjectId: string) => `${API_BASE_URL}/subjects/${subjectId}`,
  DELETE: (subjectId: string) => `${API_BASE_URL}/subjects/${subjectId}`,
};
