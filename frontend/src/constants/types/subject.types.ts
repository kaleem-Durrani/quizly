/**
 * Subject related types
 * These types define the structure of subjects
 */

// Basic subject information
export interface Subject {
  _id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Subject formatted for select components
export interface SubjectOption {
  value: string;
  label: string;
}

// Request to create a new subject
export interface CreateSubjectRequest {
  name: string;
  description?: string;
}

// Request to update a subject
export interface UpdateSubjectRequest {
  name?: string;
  description?: string;
}
