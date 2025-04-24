import mongoose, { Document } from "mongoose";
import { ObjectId } from "../constants";

export interface IQuiz extends Document {
  title: string;
  description?: string;
  createdBy: ObjectId; // Teacher ID
  classId: ObjectId; // Class ID
  isPublished: boolean;
  timeLimit?: number;
  availableFrom?: Date;
  availableTo?: Date;
  createdAt: Date;
  updatedAt: Date;
  allowReview: boolean; // Allow students to review their answers after submission
  passingScore?: number; // Optional passing score percentage
}

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  isPublished: { type: Boolean, default: false },
  timeLimit: {
    type: Number,
    min: 1,
    max: 180, // 3 hours max
    validate: {
      validator: function(v: number) {
        return v === undefined || v === null || (v > 0 && v <= 180);
      },
      message: 'Time limit must be between 1 and 180 minutes'
    }
  }, // in minutes
  availableFrom: Date,
  availableTo: Date,
  allowReview: { type: Boolean, default: true },
  passingScore: {
    type: Number,
    min: 0,
    max: 100,
    validate: {
      validator: function(v: number) {
        return v === undefined || v === null || (v >= 0 && v <= 100);
      },
      message: 'Passing score must be between 0 and 100 percent'
    }
  }, // Percentage (0-100)
}, { timestamps: true });

// Indexes for faster lookups
QuizSchema.index({ createdBy: 1 });
QuizSchema.index({ classId: 1 });
QuizSchema.index({ isPublished: 1 });
QuizSchema.index({ availableFrom: 1, availableTo: 1 });

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
