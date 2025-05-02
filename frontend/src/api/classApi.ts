import api from './axiosConfig';
import { 
  CLASS_ENDPOINTS, 
  ApiResponse, 
  PaginatedResponse, 
  Class, 
  User, 
  Quiz 
} from '../constants';

/**
 * Class API functions
 * These functions handle all class-related API calls
 */

/**
 * Get all classes
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of classes
 * 
 * @example
 * // Get the first page of classes
 * const classes = await getClasses(1, 10);
 * 
 * // Search for classes containing "math"
 * const mathClasses = await getClasses(1, 10, "math");
 */
export const getClasses = async (
  page: number = 1, 
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Class>> => {
  const response = await api.get<PaginatedResponse<Class>>(CLASS_ENDPOINTS.LIST, {
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
 * const classDetails = await getClassById("class123");
 */
export const getClassById = async (classId: string): Promise<ApiResponse<Class>> => {
  const response = await api.get<ApiResponse<Class>>(CLASS_ENDPOINTS.DETAIL(classId));
  return response.data;
};

/**
 * Create a new class
 * @param classData Class data including name and optional description
 * @returns Promise with created class data
 * 
 * @example
 * // Create a new class
 * const newClass = await createClass({
 *   name: 'Math 101',
 *   description: 'Introduction to Mathematics'
 * });
 */
export const createClass = async (classData: {
  name: string;
  description?: string;
}): Promise<ApiResponse<Class>> => {
  const response = await api.post<ApiResponse<Class>>(CLASS_ENDPOINTS.CREATE, classData);
  return response.data;
};

/**
 * Update a class
 * @param classId ID of the class to update
 * @param classData Updated class data
 * @returns Promise with updated class data
 * 
 * @example
 * // Update a class
 * const updatedClass = await updateClass("class123", {
 *   name: 'Advanced Math 101',
 *   description: 'Advanced introduction to Mathematics'
 * });
 */
export const updateClass = async (
  classId: string, 
  classData: Partial<Class>
): Promise<ApiResponse<Class>> => {
  const response = await api.put<ApiResponse<Class>>(
    CLASS_ENDPOINTS.UPDATE(classId), 
    classData
  );
  return response.data;
};

/**
 * Delete a class
 * @param classId ID of the class to delete
 * @returns Promise with success message
 * 
 * @example
 * // Delete a class
 * const result = await deleteClass("class123");
 */
export const deleteClass = async (classId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(CLASS_ENDPOINTS.DELETE(classId));
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
  const response = await api.get<PaginatedResponse<User>>(CLASS_ENDPOINTS.STUDENTS(classId), {
    params: { page, limit, search }
  });
  return response.data;
};

/**
 * Get all quizzes in a class
 * @param classId ID of the class
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of quizzes
 * 
 * @example
 * // Get all quizzes in a class
 * const quizzes = await getClassQuizzes("class123", 1, 10);
 */
export const getClassQuizzes = async (
  classId: string,
  page: number = 1, 
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Quiz>> => {
  const response = await api.get<PaginatedResponse<Quiz>>(CLASS_ENDPOINTS.QUIZZES(classId), {
    params: { page, limit, search }
  });
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
    CLASS_ENDPOINTS.REGENERATE_JOIN_CODE(classId)
  );
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
  const response = await api.delete<ApiResponse<null>>(
    CLASS_ENDPOINTS.REMOVE_STUDENT(classId, studentId)
  );
  return response.data;
};
