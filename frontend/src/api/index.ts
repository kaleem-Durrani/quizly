/**
 * Barrel file for exporting API functions and configuration
 * This allows importing from a single location:
 * import { api, login, getStudentProfile } from '@/api';
 *
 * Note: To avoid naming conflicts, import specific functions from their respective modules:
 * import { getStudentQuizById } from '@/api/studentApi';
 * import { getTeacherQuizById } from '@/api/teacherApi';
 */

// Export the axios instance
export { default as api } from './axiosConfig';

// Export authentication API functions
export * from './authApi';

// Re-export other API modules with namespaces to avoid conflicts
import * as studentApiModule from './studentApi';
import * as teacherApiModule from './teacherApi';
import * as adminApiModule from './adminApi';
import * as quizApiModule from './quizApi';
import * as classApiModule from './classApi';
import * as subjectApiModule from './subjectApi';

export const studentApi = studentApiModule;
export const teacherApi = teacherApiModule;
export const adminApi = adminApiModule;
export const quizApi = quizApiModule;
export const classApi = classApiModule;
export const subjectApi = subjectApiModule;
