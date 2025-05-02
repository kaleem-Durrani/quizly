/**
 * Quiz related types
 * These types define the structure of quizzes, questions, and related entities
 */

// Quiz status options
export type QuizStatus = 'draft' | 'published' | 'closed';

// Question types
export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

// Basic quiz information
export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  classId: string;
  teacherId: string;
  duration: number; // in minutes
  totalMarks: number;
  status: QuizStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  questionCount: number;
}

// Question option for multiple choice questions
export interface QuestionOption {
  _id: string;
  text: string;
  isCorrect: boolean;
}

// Question structure
export interface Question {
  _id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  marks: number;
  options?: QuestionOption[];
  correctAnswer?: string; // For true/false and short answer questions
  explanation?: string;
}

// Quiz submission by a student
export interface QuizSubmission {
  _id: string;
  quizId: string;
  studentId: string;
  startTime: Date;
  endTime?: Date;
  score?: number;
  status: 'in_progress' | 'completed' | 'graded';
  answers: {
    questionId: string;
    answer: string | string[];
    isCorrect?: boolean;
    marks?: number;
  }[];
}

// Quiz with questions included
export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

// Request to create a new quiz
export interface CreateQuizRequest {
  title: string;
  description?: string;
  subject: string;
  classId: string;
  duration: number;
  totalMarks: number;
  status: QuizStatus;
  startDate?: Date;
  endDate?: Date;
}

// Request to add questions to a quiz
export interface AddQuestionsRequest {
  quizId: string;
  questions: Omit<Question, '_id' | 'quizId'>[];
}
