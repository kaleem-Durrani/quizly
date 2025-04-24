import mongoose, { Document } from "mongoose";
import { ObjectId } from "../constants";

interface IAnswer {
  questionId: ObjectId;
  selectedOptions?: number[];
  writtenAnswer?: string;
  isEvaluated: boolean;
  score?: number;
  feedback?: string;
}

export interface ISubmission extends Document {
  quizId: ObjectId;
  studentId: ObjectId;
  startedAt: Date;
  submittedAt?: Date;
  isComplete: boolean;
  answers: IAnswer[];
  totalScore?: number;
  percentageScore?: number;
  isPassed?: boolean;
  gradedBy?: ObjectId; // Teacher ID who graded the submission
  gradedAt?: Date;
}

const SubmissionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  isComplete: { type: Boolean, default: false },
  // Store answers separately to handle partial submissions
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      selectedOptions: [Number], // Indexes of selected options for MCQs
      writtenAnswer: String, // Text for written answers
      isEvaluated: { type: Boolean, default: false },
      score: Number,
      feedback: String,
    },
  ],
  totalScore: Number,
  percentageScore: Number, // Percentage (0-100)
  isPassed: Boolean,
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  gradedAt: Date,
});

// Indexes for faster lookups
SubmissionSchema.index({ quizId: 1 });
SubmissionSchema.index({ studentId: 1 });
SubmissionSchema.index({ isComplete: 1 });
SubmissionSchema.index({ isPassed: 1 });
SubmissionSchema.index({ gradedBy: 1 });

// Ensure a student can only have one submission per quiz
SubmissionSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<ISubmission>("Submission", SubmissionSchema);
