import api from './axiosConfig';
import { 
  QUIZ_ENDPOINTS, 
  ApiResponse, 
  PaginatedResponse, 
  Quiz, 
  Question, 
  QuizSubmission,
  CreateQuizRequest,
  AddQuestionsRequest
} from '../constants';

/**
 * Quiz API functions
 * These functions handle all quiz-related API calls
 */

/**
 * Get all quizzes
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of quizzes
 * 
 * @example
 * // Get the first page of quizzes
 * const quizzes = await getQuizzes(1, 10);
 * 
 * // Search for quizzes containing "math"
 * const mathQuizzes = await getQuizzes(1, 10, "math");
 */
export const getQuizzes = async (
  page: number = 1, 
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Quiz>> => {
  const response = await api.get<PaginatedResponse<Quiz>>(QUIZ_ENDPOINTS.LIST, {
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
 * const quizDetails = await getQuizById("quiz123");
 */
export const getQuizById = async (quizId: string): Promise<ApiResponse<Quiz>> => {
  const response = await api.get<ApiResponse<Quiz>>(QUIZ_ENDPOINTS.DETAIL(quizId));
  return response.data;
};

/**
 * Create a new quiz
 * @param quizData Quiz data including title, description, subject, etc.
 * @returns Promise with created quiz data
 * 
 * @example
 * // Create a new quiz
 * const newQuiz = await createQuiz({
 *   title: 'Math Quiz',
 *   description: 'Test your math skills',
 *   subject: 'math123',
 *   classId: 'class456',
 *   duration: 60,
 *   totalMarks: 100,
 *   status: 'draft'
 * });
 */
export const createQuiz = async (quizData: CreateQuizRequest): Promise<ApiResponse<Quiz>> => {
  const response = await api.post<ApiResponse<Quiz>>(QUIZ_ENDPOINTS.CREATE, quizData);
  return response.data;
};

/**
 * Create a quiz with questions in one request
 * @param quizData Quiz data with questions
 * @returns Promise with created quiz data including questions
 * 
 * @example
 * // Create a quiz with questions
 * const newQuiz = await createQuizWithQuestions({
 *   quiz: {
 *     title: 'Math Quiz',
 *     description: 'Test your math skills',
 *     subject: 'math123',
 *     classId: 'class456',
 *     duration: 60,
 *     totalMarks: 100,
 *     status: 'draft'
 *   },
 *   questions: [
 *     {
 *       text: 'What is 2+2?',
 *       type: 'multiple_choice',
 *       marks: 10,
 *       options: [
 *         { text: '3', isCorrect: false },
 *         { text: '4', isCorrect: true },
 *         { text: '5', isCorrect: false }
 *       ]
 *     }
 *   ]
 * });
 */
export const createQuizWithQuestions = async (data: {
  quiz: CreateQuizRequest;
  questions: Omit<Question, '_id' | 'quizId'>[];
}): Promise<ApiResponse<Quiz & { questions: Question[] }>> => {
  const response = await api.post<ApiResponse<Quiz & { questions: Question[] }>>(
    `${QUIZ_ENDPOINTS.LIST}/with-questions`, 
    data
  );
  return response.data;
};

/**
 * Update a quiz
 * @param quizId ID of the quiz to update
 * @param quizData Updated quiz data
 * @returns Promise with updated quiz data
 * 
 * @example
 * // Update a quiz
 * const updatedQuiz = await updateQuiz("quiz123", {
 *   title: 'Updated Math Quiz',
 *   description: 'Updated description'
 * });
 */
export const updateQuiz = async (
  quizId: string, 
  quizData: Partial<CreateQuizRequest>
): Promise<ApiResponse<Quiz>> => {
  const response = await api.put<ApiResponse<Quiz>>(QUIZ_ENDPOINTS.UPDATE(quizId), quizData);
  return response.data;
};

/**
 * Delete a quiz
 * @param quizId ID of the quiz to delete
 * @returns Promise with success message
 * 
 * @example
 * // Delete a quiz
 * const result = await deleteQuiz("quiz123");
 */
export const deleteQuiz = async (quizId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(QUIZ_ENDPOINTS.DELETE(quizId));
  return response.data;
};

/**
 * Publish a quiz
 * @param quizId ID of the quiz to publish
 * @returns Promise with updated quiz data
 * 
 * @example
 * // Publish a quiz
 * const publishedQuiz = await publishQuiz("quiz123");
 */
export const publishQuiz = async (quizId: string): Promise<ApiResponse<Quiz>> => {
  const response = await api.put<ApiResponse<Quiz>>(`${QUIZ_ENDPOINTS.UPDATE(quizId)}/publish`);
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
export const getQuizQuestions = async (quizId: string): Promise<ApiResponse<Question[]>> => {
  const response = await api.get<ApiResponse<Question[]>>(QUIZ_ENDPOINTS.QUESTIONS(quizId));
  return response.data;
};

/**
 * Add multiple questions to a quiz in one request
 * @param quizId ID of the quiz
 * @param questions Array of question data
 * @returns Promise with added questions
 * 
 * @example
 * // Add questions to a quiz
 * const addedQuestions = await addQuestionsBatch("quiz123", [
 *   {
 *     text: 'What is 2+2?',
 *     type: 'multiple_choice',
 *     marks: 10,
 *     options: [
 *       { text: '3', isCorrect: false },
 *       { text: '4', isCorrect: true },
 *       { text: '5', isCorrect: false }
 *     ]
 *   }
 * ]);
 */
export const addQuestionsBatch = async (
  quizId: string, 
  questions: Omit<Question, '_id' | 'quizId'>[]
): Promise<ApiResponse<Question[]>> => {
  const response = await api.post<ApiResponse<Question[]>>(
    QUIZ_ENDPOINTS.ADD_QUESTIONS_BATCH(quizId), 
    { questions }
  );
  return response.data;
};

/**
 * Get all submissions for a quiz
 * @param quizId ID of the quiz
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @returns Promise with paginated list of submissions
 * 
 * @example
 * // Get all submissions for a quiz
 * const submissions = await getQuizSubmissions("quiz123", 1, 10);
 */
export const getQuizSubmissions = async (
  quizId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<QuizSubmission>> => {
  const response = await api.get<PaginatedResponse<QuizSubmission>>(
    QUIZ_ENDPOINTS.SUBMISSIONS(quizId),
    { params: { page, limit } }
  );
  return response.data;
};

/**
 * Start a quiz attempt (for students)
 * @param quizId ID of the quiz to start
 * @returns Promise with quiz questions and submission data
 * 
 * @example
 * // Start a quiz attempt
 * const quizAttempt = await startQuizAttempt("quiz123");
 */
export const startQuizAttempt = async (quizId: string): Promise<ApiResponse<{
  quiz: Quiz & { questions: Question[] };
  submission: QuizSubmission;
}>> => {
  const response = await api.post<ApiResponse<{
    quiz: Quiz & { questions: Question[] };
    submission: QuizSubmission;
  }>>(QUIZ_ENDPOINTS.START(quizId));
  return response.data;
};
