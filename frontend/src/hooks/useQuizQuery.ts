import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  createQuizWithQuestions,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  getQuizQuestions,
  addQuestionsBatch,
  getQuizSubmissions
} from '../api/quizApi';
import {
  PaginationParams,
  Quiz,
  Question,
  CreateQuizRequest,
  AddQuestionsRequest
} from '../constants/types';

/**
 * Custom hook for quiz-related queries and mutations
 * Uses React Query for caching and state management
 */
export const useQuizQuery = () => {
  const queryClient = useQueryClient();

  /**
   * Query to get quizzes
   */
  const getQuizzesQuery = (params: PaginationParams) => useQuery({
    queryKey: ['quizzes', params],
    queryFn: () => getQuizzes(params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Query to get a specific quiz by ID
   */
  const getQuizByIdQuery = (quizId: string) => useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuizById(quizId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!quizId, // Only run if quizId is provided
  });

  /**
   * Mutation for creating a quiz
   */
  const createQuizMutation = useMutation({
    mutationFn: (quizData: CreateQuizRequest) => createQuiz(quizData),
    onSuccess: () => {
      // Invalidate quizzes query to refetch data
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });

  /**
   * Mutation for creating a quiz with questions
   */
  const createQuizWithQuestionsMutation = useMutation({
    mutationFn: (data: { quiz: CreateQuizRequest; questions: AddQuestionsRequest }) => {
      // Convert AddQuestionsRequest to the expected array type
      if (!Array.isArray(data.questions)) {
        throw new Error('Questions must be an array');
      }
      return createQuizWithQuestions({
        quiz: data.quiz,
        questions: data.questions as unknown as Omit<Question, '_id' | 'quizId'>[]
      });
    },
    onSuccess: () => {
      // Invalidate quizzes query to refetch data
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });

  /**
   * Mutation for updating a quiz
   */
  const updateQuizMutation = useMutation({
    mutationFn: ({ quizId, quizData }: { quizId: string; quizData: Partial<Quiz> }) =>
      updateQuiz(quizId, quizData),
    onSuccess: (_, variables) => {
      // Invalidate quiz query to refetch data
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
      // Also invalidate quizzes list
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });

  /**
   * Mutation for deleting a quiz
   */
  const deleteQuizMutation = useMutation({
    mutationFn: (quizId: string) => deleteQuiz(quizId),
    onSuccess: () => {
      // Invalidate quizzes query to refetch data
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });

  /**
   * Mutation for publishing a quiz
   */
  const publishQuizMutation = useMutation({
    mutationFn: (quizId: string) => publishQuiz(quizId),
    onSuccess: (_, quizId) => {
      // Invalidate quiz query to refetch data
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] });
      // Also invalidate quizzes list
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });

  /**
   * Query to get quiz questions
   */
  const getQuizQuestionsQuery = (quizId: string) => useQuery({
    queryKey: ['quizQuestions', quizId],
    queryFn: () => getQuizQuestions(quizId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!quizId, // Only run if quizId is provided
  });

  /**
   * Mutation for adding questions to a quiz
   */
  const addQuestionsBatchMutation = useMutation({
    mutationFn: ({ quizId, questions }: { quizId: string; questions: AddQuestionsRequest }) => {
      // Convert AddQuestionsRequest to the expected array type
      if (!Array.isArray(questions)) {
        throw new Error('Questions must be an array');
      }
      return addQuestionsBatch(quizId, questions as unknown as Omit<Question, '_id' | 'quizId'>[]);
    },
    onSuccess: (_, variables) => {
      // Invalidate quiz questions query to refetch data
      queryClient.invalidateQueries({ queryKey: ['quizQuestions', variables.quizId] });
    },
  });

  /**
   * Query to get quiz submissions
   */
  const getQuizSubmissionsQuery = (quizId: string, params: PaginationParams) => useQuery({
    queryKey: ['quizSubmissions', quizId, params],
    queryFn: () => getQuizSubmissions(quizId, params.page, params.limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!quizId, // Only run if quizId is provided
  });

  return {
    // Queries
    getQuizzesQuery,
    getQuizByIdQuery,
    getQuizQuestionsQuery,
    getQuizSubmissionsQuery,

    // Mutations
    createQuizMutation,
    createQuizWithQuestionsMutation,
    updateQuizMutation,
    deleteQuizMutation,
    publishQuizMutation,
    addQuestionsBatchMutation,
  };
};

export default useQuizQuery;
