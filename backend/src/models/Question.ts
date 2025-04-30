import mongoose, { Document } from "mongoose";
import { ObjectId, QuestionType } from "../constants";

interface IOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion extends Document {
  quizId: ObjectId;
  questionText: string;
  questionType: QuestionType;
  options?: IOption[];
  sampleAnswer?: string;
  points: number;
  orderIndex: number;
}

const QuestionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: [QuestionType.MCQ, QuestionType.WRITTEN],
    required: true,
  },
  // For MCQ questions
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  }],
  // For written questions
  sampleAnswer: String,
  points: { type: Number, default: 1, min: 0 },
  orderIndex: { type: Number, required: true }, // For ordering questions
}, { timestamps: true });

// Add validation for MCQ questions
QuestionSchema.pre('validate', function(next) {
  // Only validate if this is an MCQ question
  if (this.questionType === QuestionType.MCQ) {
    // Check if options exist
    if (!this.options || this.options.length === 0) {
      this.invalidate('options', 'MCQ questions must have at least one option');
      return next();
    }

    // Check if at least one option is marked as correct
    const hasCorrectOption = this.options.some((option: any) => option.isCorrect === true);
    if (!hasCorrectOption) {
      this.invalidate('options', 'MCQ questions must have at least one correct option');
      return next();
    }
  }

  // For written questions, ensure sample answer is provided
  if (this.questionType === QuestionType.WRITTEN && !this.sampleAnswer) {
    this.invalidate('sampleAnswer', 'Written questions must have a sample answer');
    return next();
  }

  next();
});

// Indexes for faster lookups
QuestionSchema.index({ quizId: 1 });
QuestionSchema.index({ quizId: 1, orderIndex: 1 });
QuestionSchema.index({ questionType: 1 });

export default mongoose.model<IQuestion>("Question", QuestionSchema);
