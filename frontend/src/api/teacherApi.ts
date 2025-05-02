import api from './axiosConfig';
import { 
  TEACHER_ENDPOINTS, 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Class, 
  Quiz 
} from '../constants';

/**
 * Teacher API functions
 * These functions handle all teacher-specific API calls
 */

/**
 * Get teacher profile
 * @returns Promise with teacher profile data
 * 
 * @example
 * // Get the current teacher's profile
 * const profile = await getTeacherProfile();
 * console.log(profile.data);
 */
export const getTeacherProfile = async (): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(TEACHER_ENDPOINTS.PROFILE);
  return response.data;
};

/**
 * Update teacher profile
 * @param data Profile data to update
 * @returns Promise with updated teacher profile
 * 
 * @example
 * // Update the teacher's first and last name
 * const updatedProfile = await updateTeacherProfile({
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 */
export const updateTeacherProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await api.put<ApiResponse<User>>(TEACHER_ENDPOINTS.PROFILE, data);
  return response.data;
};

/**
 * Get all classes created by the teacher
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of classes
 * 
 * @example
 * // Get the first page of classes with 10 items per page
 * const classes = await getTeacherClasses(1, 10);
 * 
 * // Search for classes containing "math"
 * const mathClasses = await getTeacherClasses(1, 10, "math");
 */
export const getTeacherClasses = async (
  page: number = 1, 
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Class>> => {
  const response = await api.get<PaginatedResponse<Class>>(TEACHER_ENDPOINTS.CLASSES, {
    params: { page, limit, search }
  });
  return response.data;
};

/**
 * Get a specific class by ID
 * @param classId ID of the class to retrieve
 * @returns Promise with class details
 * 
 * @example
 * // Get details for a specific class
 * const classDetails = await getTeacherClassById("class123");
 */
export const getTeacherClassById = async (classId: string): Promise<ApiResponse<Class>> => {
  const response = await api.get<ApiResponse<Class>>(TEACHER_ENDPOINTS.CLASS_DETAIL(classId));
  return response.data;
};

/**
 * Get all students in a class
 * @param classId ID of the class
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of students
 * 
 * @example
 * // Get all students in a class
 * const students = await getClassStudents("class123", 1, 10);
 */
export const getClassStudents = async (
  classId: string,
  page: number = 1, 
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<User>> => {
  const response = await api.get<PaginatedResponse<User>>(TEACHER_ENDPOINTS.CLASS_STUDENTS(classId), {
    params: { page, limit, search }
  });
  return response.data;
};

/**
 * Remove a student from a class
 * @param classId ID of the class
 * @param studentId ID of the student to remove
 * @returns Promise with success message
 * 
 * @example
 * // Remove a student from a class
 * const result = await removeStudentFromClass("class123", "student456");
 */
export const removeStudentFromClass = async (
  classId: string, 
  studentId: string
): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(TEACHER_ENDPOINTS.REMOVE_STUDENT(classId, studentId));
  return response.data;
};

/**
 * Regenerate join code for a class
 * @param classId ID of the class
 * @returns Promise with new join code
 * 
 * @example
 * // Generate a new join code for a class
 * const result = await regenerateJoinCode("class123");
 * console.log("New join code:", result.data.joinCode);
 */
export const regenerateJoinCode = async (classId: string): Promise<ApiResponse<{ joinCode: string }>> => {
  const response = await api.post<ApiResponse<{ joinCode: string }>>(
    TEACHER_ENDPOINTS.REGENERATE_JOIN_CODE(classId)
  );
  return response.data;
};

/**
 * Get all quizzes created by the teacher
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of quizzes
 * 
 * @example
 * // Get all quizzes created by the teacher
 * const quizzes = await getTeacherQuizzes(1, 10);
 */
export const getTeacherQuizzes = async (
  page: number = 1, 
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Quiz>> => {
  const response = await api.get<PaginatedResponse<Quiz>>(TEACHER_ENDPOINTS.QUIZZES, {
    params: { page, limit, search }
  });
  return response.data;
};

/**
 * Get a specific quiz by ID
 * @param quizId ID of the quiz to retrieve
 * @returns Promise with quiz details
 * 
 * @example
 * // Get details for a specific quiz
 * const quizDetails = await getTeacherQuizById("quiz123");
 */
export const getTeacherQuizById = async (quizId: string): Promise<ApiResponse<Quiz>> => {
  const response = await api.get<ApiResponse<Quiz>>(TEACHER_ENDPOINTS.QUIZ_DETAIL(quizId));
  return response.data;
};

/**
 * Get all questions for a quiz
 * @param quizId ID of the quiz
 * @returns Promise with quiz questions
 * 
 * @example
 * // Get all questions for a quiz
 * const questions = await getQuizQuestions("quiz123");
 */
export const getQuizQuestions = async (quizId: string): Promise<ApiResponse<any[]>> => {
  const response = await api.get<ApiResponse<any[]>>(TEACHER_ENDPOINTS.QUIZ_QUESTIONS(quizId));
  return response.data;
};

/**
 * Get quiz results for all students
 * @param quizId ID of the quiz
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @returns Promise with quiz results
 * 
 * @example
 * // Get results for a quiz
 * const results = await getQuizResults("quiz123", 1, 10);
 */
export const getQuizResults = async (
  quizId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<any>> => {
  const response = await api.get<PaginatedResponse<any>>(
    TEACHER_ENDPOINTS.QUIZ_RESULTS(quizId),
    { params: { page, limit } }
  );
  return response.data;
};
