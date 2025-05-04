import api from './axiosConfig';
import {
  ADMIN_ENDPOINTS,
  ApiResponse,
  PaginatedResponse,
  User,
  Subject,
  Quiz
} from '../constants';

/**
 * Admin API functions
 * These functions handle all admin-specific API calls
 */

/**
 * Get admin dashboard data
 * @returns Promise with dashboard statistics and recent activity
 *
 * @example
 * // Get dashboard data
 * const dashboard = await getDashboard();
 * console.log('Teacher count:', dashboard.data.counts.teachers);
 */
export const getDashboard = async (): Promise<ApiResponse<{
  counts: {
    users: number;
    quizzes: number;
    submissions: number;
    teachers: number;
    students: number;
    admins: number;
  };
  recentUsers: User[];
  recentQuizzes: Quiz[];
}>> => {
  const response = await api.get<ApiResponse<{
    counts: {
      users: number;
      quizzes: number;
      submissions: number;
      teachers: number;
      students: number;
      admins: number;
    };
    recentUsers: User[];
    recentQuizzes: Quiz[];
  }>>(ADMIN_ENDPOINTS.DASHBOARD);
  return response.data;
};

/**
 * Get admin profile
 * @returns Promise with admin profile data
 *
 * @example
 * // Get the current admin's profile
 * const profile = await getAdminProfile();
 * console.log(profile.data);
 */
export const getAdminProfile = async (): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(ADMIN_ENDPOINTS.PROFILE);
  return response.data;
};

/**
 * Get all teachers
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of teachers
 *
 * @example
 * // Get the first page of teachers with 10 items per page
 * const teachers = await getTeachers(1, 10);
 *
 * // Search for teachers by name
 * const mathTeachers = await getTeachers(1, 10, "smith");
 */
export const getTeachers = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<User>> => {
  const response = await api.get<PaginatedResponse<User>>(ADMIN_ENDPOINTS.TEACHERS, {
    params: { page, limit, search }
  });
  return response.data;
};

/**
 * Get a specific teacher by ID
 * @param teacherId ID of the teacher to retrieve
 * @returns Promise with teacher details
 *
 * @example
 * // Get details for a specific teacher
 * const teacherDetails = await getTeacherById("teacher123");
 */
export const getTeacherById = async (teacherId: string): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(ADMIN_ENDPOINTS.TEACHER_DETAIL(teacherId));
  return response.data;
};

/**
 * Create a new teacher account
 * @param teacherData Teacher data including email, firstName, lastName
 * @returns Promise with created teacher data and temporary password
 *
 * @example
 * // Create a new teacher account
 * const newTeacher = await createTeacher({
 *   email: 'teacher@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 */
export const createTeacher = async (teacherData: {
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
}): Promise<ApiResponse<User & { temporaryPassword?: string }>> => {
  const response = await api.post<ApiResponse<User & { temporaryPassword?: string }>>(
    ADMIN_ENDPOINTS.TEACHERS,
    teacherData
  );
  return response.data;
};

/**
 * Update a teacher's information
 * @param teacherId ID of the teacher to update
 * @param teacherData Updated teacher data
 * @returns Promise with updated teacher data
 *
 * @example
 * // Update a teacher's information
 * const updatedTeacher = await updateTeacher("teacher123", {
 *   firstName: 'Jane',
 *   lastName: 'Smith'
 * });
 */
export const updateTeacher = async (
  teacherId: string,
  teacherData: Partial<User>
): Promise<ApiResponse<User>> => {
  const response = await api.put<ApiResponse<User>>(
    ADMIN_ENDPOINTS.TEACHER_DETAIL(teacherId),
    teacherData
  );
  return response.data;
};

/**
 * Reset a teacher's password
 * @param teacherId ID of the teacher
 * @returns Promise with success message and temporary password
 *
 * @example
 * // Reset a teacher's password
 * const result = await resetTeacherPassword("teacher123");
 * console.log("Temporary password:", result.data.temporaryPassword);
 */
export const resetTeacherPassword = async (
  teacherId: string
): Promise<ApiResponse<{ temporaryPassword: string }>> => {
  const response = await api.post<ApiResponse<{ temporaryPassword: string }>>(
    `${ADMIN_ENDPOINTS.TEACHER_DETAIL(teacherId)}/reset-password`
  );
  return response.data;
};

/**
 * Get all students
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of students
 *
 * @example
 * // Get the first page of students
 * const students = await getStudents(1, 10);
 */
export const getStudents = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<User>> => {
  const response = await api.get<PaginatedResponse<User>>(ADMIN_ENDPOINTS.STUDENTS, {
    params: { page, limit, search }
  });
  return response.data;
};

/**
 * Get a specific student by ID
 * @param studentId ID of the student to retrieve
 * @returns Promise with student details
 *
 * @example
 * // Get details for a specific student
 * const studentDetails = await getStudentById("student123");
 */
export const getStudentById = async (studentId: string): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(ADMIN_ENDPOINTS.STUDENT_DETAIL(studentId));
  return response.data;
};

/**
 * Update a student's information
 * @param studentId ID of the student to update
 * @param studentData Updated student data
 * @returns Promise with updated student data
 *
 * @example
 * // Update a student's information
 * const updatedStudent = await updateStudent("student123", {
 *   firstName: 'Jane',
 *   lastName: 'Smith'
 * });
 */
export const updateStudent = async (
  studentId: string,
  studentData: Partial<User>
): Promise<ApiResponse<User>> => {
  const response = await api.put<ApiResponse<User>>(
    ADMIN_ENDPOINTS.STUDENT_DETAIL(studentId),
    studentData
  );
  return response.data;
};

/**
 * Get all subjects
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of subjects
 *
 * @example
 * // Get all subjects
 * const subjects = await getSubjects(1, 10);
 */
export const getSubjects = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Subject>> => {
  const response = await api.get<PaginatedResponse<Subject>>(ADMIN_ENDPOINTS.SUBJECTS, {
    params: { page, limit, search }
  });
  return response.data;
};

/**
 * Get a specific subject by ID
 * @param subjectId ID of the subject to retrieve
 * @returns Promise with subject details
 *
 * @example
 * // Get details for a specific subject
 * const subjectDetails = await getSubjectById("subject123");
 */
export const getSubjectById = async (subjectId: string): Promise<ApiResponse<Subject>> => {
  const response = await api.get<ApiResponse<Subject>>(ADMIN_ENDPOINTS.SUBJECT_DETAIL(subjectId));
  return response.data;
};

/**
 * Create a new subject
 * @param subjectData Subject data including name and optional description
 * @returns Promise with created subject data
 *
 * @example
 * // Create a new subject
 * const newSubject = await createSubject({
 *   name: 'Mathematics',
 *   description: 'Study of numbers, quantities, and shapes'
 * });
 */
export const createSubject = async (subjectData: {
  name: string;
  description?: string;
}): Promise<ApiResponse<Subject>> => {
  const response = await api.post<ApiResponse<Subject>>(ADMIN_ENDPOINTS.SUBJECTS, subjectData);
  return response.data;
};

/**
 * Update a subject
 * @param subjectId ID of the subject to update
 * @param subjectData Updated subject data
 * @returns Promise with updated subject data
 *
 * @example
 * // Update a subject
 * const updatedSubject = await updateSubject("subject123", {
 *   name: 'Advanced Mathematics',
 *   description: 'Study of advanced mathematical concepts'
 * });
 */
export const updateSubject = async (
  subjectId: string,
  subjectData: Partial<Subject>
): Promise<ApiResponse<Subject>> => {
  const response = await api.put<ApiResponse<Subject>>(
    ADMIN_ENDPOINTS.SUBJECT_DETAIL(subjectId),
    subjectData
  );
  return response.data;
};

/**
 * Delete a subject
 * @param subjectId ID of the subject to delete
 * @returns Promise with success message
 *
 * @example
 * // Delete a subject
 * const result = await deleteSubject("subject123");
 */
export const deleteSubject = async (subjectId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(ADMIN_ENDPOINTS.SUBJECT_DETAIL(subjectId));
  return response.data;
};
