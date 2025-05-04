import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTeacherProfile,
  updateTeacherProfile,
  getTeacherClasses,
  getTeacherClassById,
  getClassStudents,
  removeStudentFromClass,
  regenerateJoinCode,
  getTeacherQuizzes,
  getTeacherQuizById,
  getQuizQuestions,
  getQuizResults,
  createClass
} from '../api/teacherApi';
import { User, PaginationParams, CreateClassRequest } from '../constants/types';

/**
 * Custom hook for teacher-related queries and mutations
 * Uses React Query for caching and state management
 */
export const useTeacherQuery = () => {
  const queryClient = useQueryClient();

  /**
   * Query to get teacher profile
   */
  const profileQuery = useQuery({
    queryKey: ['teacherProfile'],
    queryFn: getTeacherProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Mutation for updating teacher profile
   */
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: Partial<User>) => updateTeacherProfile(profileData),
    onSuccess: () => {
      // Invalidate profile query to refetch data
      queryClient.invalidateQueries({ queryKey: ['teacherProfile'] });
    },
  });

  /**
   * Query to get teacher classes
   */
  const getClassesQuery = (params: PaginationParams) => useQuery({
    queryKey: ['teacherClasses', params],
    queryFn: () => getTeacherClasses(params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Query to get a specific class by ID
   */
  const getClassByIdQuery = (classId: string) => useQuery({
    queryKey: ['teacherClass', classId],
    queryFn: () => getTeacherClassById(classId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!classId, // Only run if classId is provided
  });

  /**
   * Query to get students in a class
   */
  const getClassStudentsQuery = (classId: string, params: PaginationParams) => useQuery({
    queryKey: ['classStudents', classId, params],
    queryFn: () => getClassStudents(classId, params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!classId, // Only run if classId is provided
  });

  /**
   * Mutation for removing a student from a class
   */
  const removeStudentMutation = useMutation({
    mutationFn: ({ classId, studentId }: { classId: string; studentId: string }) =>
      removeStudentFromClass(classId, studentId),
    onSuccess: (_, variables) => {
      // Invalidate class students query to refetch data
      queryClient.invalidateQueries({ queryKey: ['classStudents', variables.classId] });
    },
  });

  /**
   * Mutation for regenerating a class join code
   */
  const regenerateJoinCodeMutation = useMutation({
    mutationFn: (classId: string) => regenerateJoinCode(classId),
    onSuccess: (_, classId) => {
      // Invalidate class query to refetch data
      queryClient.invalidateQueries({ queryKey: ['teacherClass', classId] });
    },
  });

  /**
   * Query to get teacher quizzes
   */
  const getQuizzesQuery = (params: PaginationParams) => useQuery({
    queryKey: ['teacherQuizzes', params],
    queryFn: () => getTeacherQuizzes(params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Query to get a specific quiz by ID
   */
  const getQuizByIdQuery = (quizId: string) => useQuery({
    queryKey: ['teacherQuiz', quizId],
    queryFn: () => getTeacherQuizById(quizId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!quizId, // Only run if quizId is provided
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
   * Query to get quiz results
   */
  const getQuizResultsQuery = (quizId: string, params: PaginationParams) => useQuery({
    queryKey: ['teacherQuizResults', quizId, params],
    queryFn: () => getQuizResults(quizId, params.page, params.limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!quizId, // Only run if quizId is provided
  });

  /**
   * Mutation for creating a new class
   */
  const createClassMutation = useMutation({
    mutationFn: (classData: CreateClassRequest) => createClass(classData),
    onSuccess: () => {
      // Invalidate classes query to refetch data
      queryClient.invalidateQueries({ queryKey: ['teacherClasses'] });
    },
  });

  return {
    // Queries
    profileQuery,
    getClassesQuery,
    getClassByIdQuery,
    getClassStudentsQuery,
    getQuizzesQuery,
    getQuizByIdQuery,
    getQuizQuestionsQuery,
    getQuizResultsQuery,

    // Mutations
    updateProfileMutation,
    createClassMutation,
    removeStudentMutation,
    regenerateJoinCodeMutation,
  };
};

export default useTeacherQuery;
