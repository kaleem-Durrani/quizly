import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassStudents,
  getClassQuizzes,
  regenerateJoinCode,
  removeStudentFromClass
} from '../api/classApi';
import { PaginationParams, Class } from '../constants/types';

/**
 * Custom hook for class-related queries and mutations
 * Uses React Query for caching and state management
 */
export const useClassQuery = () => {
  const queryClient = useQueryClient();

  /**
   * Query to get classes
   */
  const getClassesQuery = (params: PaginationParams) => useQuery({
    queryKey: ['classes', params],
    queryFn: () => getClasses(params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Query to get a specific class by ID
   */
  const getClassByIdQuery = (classId: string) => useQuery({
    queryKey: ['class', classId],
    queryFn: () => getClassById(classId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!classId, // Only run if classId is provided
  });

  /**
   * Mutation for creating a class
   */
  const createClassMutation = useMutation({
    mutationFn: (classData: Partial<Class>) => {
      // Ensure name is present
      if (!classData.name) {
        throw new Error('Class name is required');
      }
      return createClass({
        name: classData.name,
        description: classData.description
      });
    },
    onSuccess: () => {
      // Invalidate classes query to refetch data
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  /**
   * Mutation for updating a class
   */
  const updateClassMutation = useMutation({
    mutationFn: ({ classId, classData }: { classId: string; classData: Partial<Class> }) =>
      updateClass(classId, classData),
    onSuccess: (_, variables) => {
      // Invalidate class query to refetch data
      queryClient.invalidateQueries({ queryKey: ['class', variables.classId] });
      // Also invalidate classes list
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  /**
   * Mutation for deleting a class
   */
  const deleteClassMutation = useMutation({
    mutationFn: (classId: string) => deleteClass(classId),
    onSuccess: () => {
      // Invalidate classes query to refetch data
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
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
   * Query to get quizzes in a class
   */
  const getClassQuizzesQuery = (classId: string, params: PaginationParams) => useQuery({
    queryKey: ['classQuizzes', classId, params],
    queryFn: () => getClassQuizzes(classId, params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!classId, // Only run if classId is provided
  });

  /**
   * Mutation for regenerating a class join code
   */
  const regenerateJoinCodeMutation = useMutation({
    mutationFn: (classId: string) => regenerateJoinCode(classId),
    onSuccess: (_, classId) => {
      // Invalidate class query to refetch data
      queryClient.invalidateQueries({ queryKey: ['class', classId] });
    },
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

  return {
    // Queries
    getClassesQuery,
    getClassByIdQuery,
    getClassStudentsQuery,
    getClassQuizzesQuery,

    // Mutations
    createClassMutation,
    updateClassMutation,
    deleteClassMutation,
    regenerateJoinCodeMutation,
    removeStudentMutation,
  };
};

export default useClassQuery;
