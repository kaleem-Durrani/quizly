import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminProfile,
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  resetTeacherPassword,
  getStudents,
  getStudentById,
  updateStudent,
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from '../api/adminApi';
import { PaginationParams, User, Subject } from '../constants/types';

/**
 * Custom hook for admin-related queries and mutations
 * Uses React Query for caching and state management
 */
export const useAdminQuery = () => {
  const queryClient = useQueryClient();

  /**
   * Query to get admin profile
   */
  const profileQuery = useQuery({
    queryKey: ['adminProfile'],
    queryFn: getAdminProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Query to get teachers
   */
  const getTeachersQuery = (params: PaginationParams) => useQuery({
    queryKey: ['teachers', params],
    queryFn: () => getTeachers(params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Query to get a specific teacher by ID
   */
  const getTeacherByIdQuery = (teacherId: string) => useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: () => getTeacherById(teacherId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!teacherId, // Only run if teacherId is provided
  });

  /**
   * Mutation for creating a teacher
   */
  const createTeacherMutation = useMutation({
    mutationFn: (teacherData: Partial<User>) => {
      // Ensure required fields are present
      const { email, firstName, lastName } = teacherData;
      if (!email || !firstName || !lastName) {
        throw new Error('Email, firstName, and lastName are required');
      }
      return createTeacher({
        email,
        firstName,
        lastName,
        username: teacherData.username
      });
    },
    onSuccess: () => {
      // Invalidate teachers query to refetch data
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  /**
   * Mutation for updating a teacher
   */
  const updateTeacherMutation = useMutation({
    mutationFn: ({ teacherId, teacherData }: { teacherId: string; teacherData: Partial<User> }) =>
      updateTeacher(teacherId, teacherData),
    onSuccess: (_, variables) => {
      // Invalidate teacher query to refetch data
      queryClient.invalidateQueries({ queryKey: ['teacher', variables.teacherId] });
      // Also invalidate teachers list
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  /**
   * Mutation for resetting a teacher's password
   */
  const resetTeacherPasswordMutation = useMutation({
    mutationFn: (teacherId: string) => resetTeacherPassword(teacherId),
  });

  /**
   * Query to get students
   */
  const getStudentsQuery = (params: PaginationParams) => useQuery({
    queryKey: ['students', params],
    queryFn: () => getStudents(params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Query to get a specific student by ID
   */
  const getStudentByIdQuery = (studentId: string) => useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!studentId, // Only run if studentId is provided
  });

  /**
   * Mutation for updating a student
   */
  const updateStudentMutation = useMutation({
    mutationFn: ({ studentId, studentData }: { studentId: string; studentData: Partial<User> }) =>
      updateStudent(studentId, studentData),
    onSuccess: (_, variables) => {
      // Invalidate student query to refetch data
      queryClient.invalidateQueries({ queryKey: ['student', variables.studentId] });
      // Also invalidate students list
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  /**
   * Query to get subjects
   */
  const getSubjectsQuery = (params: PaginationParams) => useQuery({
    queryKey: ['subjects', params],
    queryFn: () => getSubjects(params.page, params.limit, params.search),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Query to get a specific subject by ID
   */
  const getSubjectByIdQuery = (subjectId: string) => useQuery({
    queryKey: ['subject', subjectId],
    queryFn: () => getSubjectById(subjectId),
    staleTime: 2 * 60 * 1000, // 2 minutes
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
    },
  });

  return {
    // Queries
    profileQuery,
    getTeachersQuery,
    getTeacherByIdQuery,
    getStudentsQuery,
    getStudentByIdQuery,
    getSubjectsQuery,
    getSubjectByIdQuery,

    // Mutations
    createTeacherMutation,
    updateTeacherMutation,
    resetTeacherPasswordMutation,
    updateStudentMutation,
    createSubjectMutation,
    updateSubjectMutation,
    deleteSubjectMutation,
  };
};

export default useAdminQuery;
