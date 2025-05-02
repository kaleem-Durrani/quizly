import api from './axiosConfig';
import { 
  STUDENT_ENDPOINTS, 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Class, 
  Quiz, 
  QuizSubmission 
} from '../constants';

/**
 * Student API functions
 * These functions handle all student-specific API calls
 */

/**
 * Get student profile
 * @returns Promise with student profile data
 * 
 * @example
 * // Get the current student's profile
 * const profile = await getStudentProfile();
 * console.log(profile.data);
 */
export const getStudentProfile = async (): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(STUDENT_ENDPOINTS.PROFILE);
  return response.data;
};

/**
 * Update student profile
 * @param data Profile data to update
 * @returns Promise with updated student profile
 * 
 * @example
 * // Update the student's first and last name
 * const updatedProfile = await updateStudentProfile({
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 */
export const updateStudentProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await api.put<ApiResponse<User>>(STUDENT_ENDPOINTS.PROFILE, data);
  return response.data;
};

/**
 * Get all classes the student is enrolled in
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of classes
 * 
 * @example
 * // Get the first page of classes with 10 items per page
 * const classes = await getStudentClasses(1, 10);
 * 
 * // Search for classes containing "math"
 * const mathClasses = await getStudentClasses(1, 10, "math");
 */
export const getStudentClasses = async (
  page: number = 1, 
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Class>> => {
  const response = await api.get<PaginatedResponse<Class>>(STUDENT_ENDPOINTS.CLASSES, {
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
 * const classDetails = await getStudentClassById("class123");
 */
export const getStudentClassById = async (classId: string): Promise<ApiResponse<Class>> => {
  const response = await api.get<ApiResponse<Class>>(STUDENT_ENDPOINTS.CLASS_DETAIL(classId));
  return response.data;
};

/**
 * Join a class using a join code
 * @param joinCode The unique code to join a class
 * @returns Promise with success message and class data
 * 
 * @example
 * // Join a class with a specific code
 * const result = await joinClass("ABC123");
 * if (result.success) {
 *   console.log("Joined class:", result.data);
 * }
 */
export const joinClass = async (joinCode: string): Promise<ApiResponse<Class>> => {
  const response = await api.post<ApiResponse<Class>>(STUDENT_ENDPOINTS.JOIN_CLASS, { joinCode });
  return response.data;
};

/**
 * Get all quizzes available to the student
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of quizzes
 * 
 * @example
 * // Get the first page of quizzes
 * const quizzes = await getStudentQuizzes(1, 10);
 */
export const getStudentQuizzes = async (
  page: number = 1, 
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Quiz>> => {
  const response = await api.get<PaginatedResponse<Quiz>>(STUDENT_ENDPOINTS.QUIZZES, {
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
 * const quizDetails = await getStudentQuizById("quiz123");
 */
export const getStudentQuizById = async (quizId: string): Promise<ApiResponse<Quiz>> => {
  const response = await api.get<ApiResponse<Quiz>>(STUDENT_ENDPOINTS.QUIZ_DETAIL(quizId));
  return response.data;
};

/**
 * Start a quiz attempt
 * @param quizId ID of the quiz to start
 * @returns Promise with quiz questions and submission data
 * 
 * @example
 * // Start a quiz attempt
 * const quizAttempt = await startQuiz("quiz123");
 * if (quizAttempt.success) {
 *   console.log("Quiz started:", quizAttempt.data);
 * }
 */
export const startQuiz = async (quizId: string): Promise<ApiResponse<{
  quiz: Quiz;
  submission: QuizSubmission;
}>> => {
  const response = await api.post<ApiResponse<{
    quiz: Quiz;
    submission: QuizSubmission;
  }>>(STUDENT_ENDPOINTS.START_QUIZ(quizId));
  return response.data;
};

/**
 * Submit a quiz attempt
 * @param quizId ID of the quiz being submitted
 * @param answers Student's answers to quiz questions
 * @returns Promise with submission results
 * 
 * @example
 * // Submit answers for a quiz
 * const result = await submitQuiz("quiz123", [
 *   { questionId: "q1", answer: "option1" },
 *   { questionId: "q2", answer: "True" }
 * ]);
 */
export const submitQuiz = async (
  quizId: string, 
  answers: Array<{ questionId: string; answer: string | string[] }>
): Promise<ApiResponse<QuizSubmission>> => {
  const response = await api.post<ApiResponse<QuizSubmission>>(
    STUDENT_ENDPOINTS.SUBMIT_QUIZ(quizId), 
    { answers }
  );
  return response.data;
};

/**
 * Get quiz results
 * @param quizId ID of the quiz
 * @returns Promise with quiz results
 * 
 * @example
 * // Get results for a completed quiz
 * const results = await getQuizResults("quiz123");
 */
export const getQuizResults = async (quizId: string): Promise<ApiResponse<{
  submission: QuizSubmission;
  quiz: Quiz;
}>> => {
  const response = await api.get<ApiResponse<{
    submission: QuizSubmission;
    quiz: Quiz;
  }>>(STUDENT_ENDPOINTS.QUIZ_RESULTS(quizId));
  return response.data;
};
