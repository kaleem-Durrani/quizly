/**
 * Class related types
 * These types define the structure of classes and related entities
 */

// Class status options
export type ClassStatus = 'active' | 'archived';

// Basic class information
export interface Class {
  _id: string;
  name: string;
  description?: string;
  teacherId: string;
  joinCode: string;
  status: ClassStatus;
  createdAt: Date;
  updatedAt: Date;
  studentCount: number;
}

// Class with teacher and students information
export interface ClassWithDetails extends Class {
  teacher: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  students: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

// Request to create a new class
export interface CreateClassRequest {
  name: string;
  description?: string;
}

// Request to update a class
export interface UpdateClassRequest {
  name?: string;
  description?: string;
  status?: ClassStatus;
}

// Request to join a class
export interface JoinClassRequest {
  joinCode: string;
}
