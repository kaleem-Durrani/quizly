import api from './axiosConfig';
import { 
  SUBJECT_ENDPOINTS, 
  ApiResponse, 
  PaginatedResponse, 
  Subject,
  SubjectOption
} from '../constants';

/**
 * Subject API functions
 * These functions handle all subject-related API calls
 */

/**
 * Get all subjects
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with paginated list of subjects
 * 
 * @example
 * // Get the first page of subjects
 * const subjects = await getSubjects(1, 10);
 * 
 * // Search for subjects containing "math"
 * const mathSubjects = await getSubjects(1, 10, "math");
 */
export const getSubjects = async (
  page: number = 1, 
  limit: number = 10,
  search?: string
): Promise<PaginatedResponse<Subject>> => {
  const response = await api.get<PaginatedResponse<Subject>>(SUBJECT_ENDPOINTS.LIST, {
    params: { page, limit, search }
  });
  return response.data;
};

/**
 * Get all subjects formatted as options for select components
 * @returns Promise with subjects formatted as options
 * 
 * @example
 * // Get subjects for a dropdown
 * const subjectOptions = await getSubjectOptions();
 * // Returns: [{ value: 'subject123', label: 'Mathematics' }, ...]
 */
export const getSubjectOptions = async (): Promise<ApiResponse<SubjectOption[]>> => {
  const response = await api.get<PaginatedResponse<Subject>>(SUBJECT_ENDPOINTS.LIST, {
    params: { limit: 100 } // Get a large number of subjects
  });
  
  // Transform subjects into options format
  const options = response.data.data.map(subject => ({
    value: subject._id,
    label: subject.name
  }));
  
  return {
    success: true,
    data: options
  };
};

/**
 * Get a specific subject by ID
 * @param subjectId ID of the subject to retrieve
 * @returns Promise with subject details
 * 
 * @example
 * // Get details for a specific subject
 * const subjectDetails = await getSubjectById("subject123");
 */
export const getSubjectById = async (subjectId: string): Promise<ApiResponse<Subject>> => {
  const response = await api.get<ApiResponse<Subject>>(SUBJECT_ENDPOINTS.DETAIL(subjectId));
  return response.data;
};

/**
 * Create a new subject
 * @param subjectData Subject data including name and optional description
 * @returns Promise with created subject data
 * 
 * @example
 * // Create a new subject
 * const newSubject = await createSubject({
 *   name: 'Mathematics',
 *   description: 'Study of numbers, quantities, and shapes'
 * });
 */
export const createSubject = async (subjectData: {
  name: string;
  description?: string;
}): Promise<ApiResponse<Subject>> => {
  const response = await api.post<ApiResponse<Subject>>(SUBJECT_ENDPOINTS.CREATE, subjectData);
  return response.data;
};

/**
 * Update a subject
 * @param subjectId ID of the subject to update
 * @param subjectData Updated subject data
 * @returns Promise with updated subject data
 * 
 * @example
 * // Update a subject
 * const updatedSubject = await updateSubject("subject123", {
 *   name: 'Advanced Mathematics',
 *   description: 'Study of advanced mathematical concepts'
 * });
 */
export const updateSubject = async (
  subjectId: string, 
  subjectData: Partial<Subject>
): Promise<ApiResponse<Subject>> => {
  const response = await api.put<ApiResponse<Subject>>(
    SUBJECT_ENDPOINTS.UPDATE(subjectId), 
    subjectData
  );
  return response.data;
};

/**
 * Delete a subject
 * @param subjectId ID of the subject to delete
 * @returns Promise with success message
 * 
 * @example
 * // Delete a subject
 * const result = await deleteSubject("subject123");
 */
export const deleteSubject = async (subjectId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(SUBJECT_ENDPOINTS.DELETE(subjectId));
  return response.data;
};
