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
  options: {
    type: [{
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    }],
    validate: {
      validator: function(options: any[]) {
        // Skip validation if not MCQ
        if (this.questionType !== QuestionType.MCQ) return true;

        // Ensure at least one correct option for MCQs
        if (options.length === 0) return false;
        return options.some(option => option.isCorrect === true);
      },
      message: 'MCQ questions must have at least one correct option'
    }
  },
  // For written questions
  sampleAnswer: String,
  points: { type: Number, default: 1, min: 0 },
  orderIndex: { type: Number, required: true }, // For ordering questions
}, { timestamps: true });

// Indexes for faster lookups
QuestionSchema.index({ quizId: 1 });
QuestionSchema.index({ quizId: 1, orderIndex: 1 });
QuestionSchema.index({ questionType: 1 });

export default mongoose.model<IQuestion>("Question", QuestionSchema);
