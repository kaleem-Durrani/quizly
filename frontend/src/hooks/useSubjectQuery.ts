import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSubjects,
  getSubjectOptions,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from '../api/subjectApi';
import { PaginationParams, Subject } from '../constants/types';

/**
 * Custom hook for subject-related queries and mutations
 * Uses React Query for caching and state management
 */
export const useSubjectQuery = () => {
  const queryClient = useQueryClient();

  /**
   * Query to get subjects
   */
  const getSubjectsQuery = (params: PaginationParams) => useQuery({
    queryKey: ['subjects', params],
    queryFn: () => getSubjects(params.page, params.limit, params.search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Query to get subject options for select components
   */
  const getSubjectOptionsQuery = useQuery({
    queryKey: ['subjectOptions'],
    queryFn: getSubjectOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  /**
   * Query to get a specific subject by ID
   */
  const getSubjectByIdQuery = (subjectId: string) => useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => getSubjectById(subjectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!subjectId, // Only run if subjectId is provided
  });

  /**
   * Mutation for creating a subject
   */
  const createSubjectMutation = useMutation({
    mutationFn: (subjectData: Partial<Subject>) => {
      // Ensure name is present
      if (!subjectData.name) {
        throw new Error('Subject name is required');
      }
      return createSubject({
        name: subjectData.name,
        description: subjectData.description
      });
    },
    onSuccess: () => {
      // Invalidate subjects query to refetch data
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      // Also invalidate subject options
      queryClient.invalidateQueries({ queryKey: ['subjectOptions'] });
    },
  });

  /**
   * Mutation for updating a subject
   */
  const updateSubjectMutation = useMutation({
    mutationFn: ({ subjectId, subjectData }: { subjectId: string; subjectData: Partial<Subject> }) =>
      updateSubject(subjectId, subjectData),
    onSuccess: (_, variables) => {
      // Invalidate subject query to refetch data
      queryClient.invalidateQueries({ queryKey: ['subject', variables.subjectId] });
      // Also invalidate subjects list
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      // Also invalidate subject options
      queryClient.invalidateQueries({ queryKey: ['subjectOptions'] });
    },
  });

  /**
   * Mutation for deleting a subject
   */
  const deleteSubjectMutation = useMutation({
    mutationFn: (subjectId: string) => deleteSubject(subjectId),
    onSuccess: () => {
      // Invalidate subjects query to refetch data
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      // Also invalidate subject options
      queryClient.invalidateQueries({ queryKey: ['subjectOptions'] });
    },
  });

  return {
    // Queries
    getSubjectsQuery,
    getSubjectOptionsQuery,
    getSubjectByIdQuery,

    // Mutations
    createSubjectMutation,
    updateSubjectMutation,
    deleteSubjectMutation,
  };
};

export default useSubjectQuery;
