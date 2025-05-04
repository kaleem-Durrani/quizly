import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getStudentProfile,
  updateStudentProfile,
  getStudentClasses,
  getStudentClassById,
  joinClass,
  getStudentQuizzes,
  getStudentQuizById,
  startQuiz,
  submitQuiz,
  getQuizResults
} from '../api/studentApi';
import { User, PaginationParams } from '../constants/types';

/**
 * Custom hook for student-related queries and mutations
 * Uses React Query for caching and state management
 */
export const useStudentQuery = () => {
  const queryClient = useQueryClient();

  /**
   * Query to get student profile
   */
  const profileQuery = useQuery({
    queryKey: ['studentProfile'],
    queryFn: getStudentProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Mutation for updating student profile
   */
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: Partial<User>) => {
      // Ensure required fields are present
      const { email, firstName, lastName } = profileData;
      if (!email || !firstName || !lastName) {
        throw new Error('Email, firstName, and lastName are required');
      }
      return updateStudentProfile({
        email,
        firstName,
        lastName,
        username: profileData.username
      });
    },
    onSuccess: () => {
      // Invalidate profile query to refetch data
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
    },
  });

  /**
   * Query to get student classes
   */
  const getClassesQuery = (params: PaginationParams) => useQuery({
    queryKey: ['studentClasses', params],
    queryFn: () => getStudentClasses(params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Query to get a specific class by ID
   */
  const getClassByIdQuery = (classId: string) => useQuery({
    queryKey: ['studentClass', classId],
    queryFn: () => getStudentClassById(classId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!classId, // Only run if classId is provided
  });

  /**
   * Mutation for joining a class
   */
  const joinClassMutation = useMutation({
    mutationFn: (joinCode: string) => joinClass(joinCode),
    onSuccess: () => {
      // Invalidate classes query to refetch data
      queryClient.invalidateQueries({ queryKey: ['studentClasses'] });
    },
  });

  /**
   * Query to get student quizzes
   */
  const getQuizzesQuery = (params: PaginationParams) => useQuery({
    queryKey: ['studentQuizzes', params],
    queryFn: () => getStudentQuizzes(params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Query to get a specific quiz by ID
   */
  const getQuizByIdQuery = (quizId: string) => useQuery({
    queryKey: ['studentQuiz', quizId],
    queryFn: () => getStudentQuizById(quizId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!quizId, // Only run if quizId is provided
  });

  /**
   * Mutation for starting a quiz
   */
  const startQuizMutation = useMutation({
    mutationFn: (quizId: string) => startQuiz(quizId),
  });

  /**
   * Mutation for submitting a quiz
   */
  const submitQuizMutation = useMutation({
    mutationFn: ({ quizId, answers }: { quizId: string; answers: Record<string, string> }) => {
      // Convert Record<string, string> to the expected array format
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));
      return submitQuiz(quizId, formattedAnswers);
    },
    onSuccess: (_, variables) => {
      // Invalidate quiz results query to refetch data
      queryClient.invalidateQueries({ queryKey: ['quizResults', variables.quizId] });
    },
  });

  /**
   * Query to get quiz results
   */
  const getQuizResultsQuery = (quizId: string) => useQuery({
    queryKey: ['quizResults', quizId],
    queryFn: () => getQuizResults(quizId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!quizId, // Only run if quizId is provided
  });

  return {
    // Queries
    profileQuery,
    getClassesQuery,
    getClassByIdQuery,
    getQuizzesQuery,
    getQuizByIdQuery,
    getQuizResultsQuery,

    // Mutations
    updateProfileMutation,
    joinClassMutation,
    startQuizMutation,
    submitQuizMutation,
  };
};

export default useStudentQuery;
