import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { Question, Quiz } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { NotFoundError, BadRequestError, ForbiddenError } from "../utils/customErrors";
import { withTransaction } from "../utils/transactionUtils";
import { UserRole } from "../constants";

/**
 * Create a new question
 * @route POST /api/questions
 * @access Private/Teacher
 */
export const createQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { quizId, questionText, questionType, options, sampleAnswer, points, orderIndex } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate quiz ID
  if (!Types.ObjectId.isValid(quizId)) {
    throw new BadRequestError("Invalid quiz ID format");
  }

  // Check if quiz exists and teacher is the owner
  const quiz = await Quiz.findOne({
    _id: quizId,
    createdBy: teacher._id,
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found or you don't have permission");
  }

  // Check if quiz is published
  if (quiz.isPublished) {
    throw new BadRequestError("Cannot add questions to a published quiz");
  }

  // If orderIndex is not provided, find the highest orderIndex and add 1
  let newOrderIndex = orderIndex;
  if (!newOrderIndex) {
    const highestOrderQuestion = await Question.findOne({ quizId })
      .sort({ orderIndex: -1 })
      .select('orderIndex');
    
    newOrderIndex = highestOrderQuestion ? highestOrderQuestion.orderIndex + 1 : 1;
  }

  // Create new question
  const question = await Question.create({
    quizId,
    questionText,
    questionType,
    options: questionType === 'mcq' ? options : undefined,
    sampleAnswer: questionType === 'written' ? sampleAnswer : undefined,
    points: points || 1,
    orderIndex: newOrderIndex,
  });

  res.status(201).json({
    success: true,
    message: "Question created successfully",
    data: question,
  });
});

/**
 * Get all questions (optionally filtered by quizId)
 * @route GET /api/questions
 * @access Private/Teacher
 */
export const getQuestions = asyncHandler(async (req: Request, res: Response) => {
  const { quizId, page = 1, limit = 10, sort = "orderIndex", order = "asc" } = req.query;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Build query based on quizId
  const query: any = {};

  if (quizId) {
    // Validate quiz ID
    if (!Types.ObjectId.isValid(quizId as string)) {
      throw new BadRequestError("Invalid quiz ID format");
    }

    // Check if quiz exists and teacher is the owner
    const quiz = await Quiz.findOne({
      _id: quizId,
      createdBy: teacher._id,
    });

    if (!quiz) {
      throw new NotFoundError("Quiz not found or you don't have permission");
    }

    query.quizId = quizId;
  } else {
    // If no quizId provided, get all questions for quizzes owned by the teacher
    const teacherQuizzes = await Quiz.find({ createdBy: teacher._id }).select('_id');
    query.quizId = { $in: teacherQuizzes.map(q => q._id) };
  }

  // Set up sorting
  const sortDirection = order === "asc" ? 1 : -1;
  const sortOptions: any = {};
  sortOptions[sort as string] = sortDirection;

  // Count total questions for pagination
  const total = await Question.countDocuments(query);

  // Get questions with pagination
  const questions = await Question.find(query)
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .populate("quizId", "title");

  res.json({
    success: true,
    data: questions,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
    },
  });
});

/**
 * Get question by ID
 * @route GET /api/questions/:id
 * @access Private/Teacher
 */
export const getQuestionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid question ID format");
  }

  // Find question
  const question = await Question.findById(id).populate("quizId", "title createdBy");

  if (!question) {
    throw new NotFoundError("Question not found");
  }

  // Check if teacher owns the quiz
  if (question.quizId && (question.quizId as any).createdBy.toString() !== teacher._id.toString()) {
    throw new ForbiddenError("You don't have permission to access this question");
  }

  res.json({
    success: true,
    data: question,
  });
});

/**
 * Update question
 * @route PUT /api/questions/:id
 * @access Private/Teacher
 */
export const updateQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { questionText, questionType, options, sampleAnswer, points, orderIndex } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid question ID format");
  }

  // Find question
  const question = await Question.findById(id).populate("quizId", "createdBy isPublished");

  if (!question) {
    throw new NotFoundError("Question not found");
  }

  // Check if teacher owns the quiz
  if (question.quizId && (question.quizId as any).createdBy.toString() !== teacher._id.toString()) {
    throw new ForbiddenError("You don't have permission to update this question");
  }

  // Check if quiz is published
  if ((question.quizId as any).isPublished) {
    throw new BadRequestError("Cannot update questions in a published quiz");
  }

  // Update question fields
  if (questionText) question.questionText = questionText;
  
  // If question type is changing, handle options/sampleAnswer accordingly
  if (questionType && questionType !== question.questionType) {
    question.questionType = questionType;
    
    if (questionType === 'mcq') {
      question.options = options || [];
      question.sampleAnswer = undefined;
    } else if (questionType === 'written') {
      question.options = undefined;
      question.sampleAnswer = sampleAnswer || '';
    }
  } else {
    // Update based on current question type
    if (question.questionType === 'mcq' && options) {
      question.options = options;
    } else if (question.questionType === 'written' && sampleAnswer !== undefined) {
      question.sampleAnswer = sampleAnswer;
    }
  }
  
  if (points !== undefined) question.points = points;
  if (orderIndex !== undefined) question.orderIndex = orderIndex;

  // Save the updated question
  await question.save();

  res.json({
    success: true,
    message: "Question updated successfully",
    data: question,
  });
});

/**
 * Delete question
 * @route DELETE /api/questions/:id
 * @access Private/Teacher
 */
export const deleteQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid question ID format");
  }

  // Find question
  const question = await Question.findById(id).populate("quizId", "createdBy isPublished");

  if (!question) {
    throw new NotFoundError("Question not found");
  }

  // Check if teacher owns the quiz
  if (question.quizId && (question.quizId as any).createdBy.toString() !== teacher._id.toString()) {
    throw new ForbiddenError("You don't have permission to delete this question");
  }

  // Check if quiz is published
  if ((question.quizId as any).isPublished) {
    throw new BadRequestError("Cannot delete questions from a published quiz");
  }

  // Delete the question
  await Question.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Question deleted successfully",
  });
});

/**
 * Reorder questions
 * @route PUT /api/questions/reorder
 * @access Private/Teacher
 */
export const reorderQuestions = asyncHandler(async (req: Request, res: Response) => {
  const { quizId, questionOrders } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate quiz ID
  if (!Types.ObjectId.isValid(quizId)) {
    throw new BadRequestError("Invalid quiz ID format");
  }

  // Check if quiz exists and teacher is the owner
  const quiz = await Quiz.findOne({
    _id: quizId,
    createdBy: teacher._id,
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found or you don't have permission");
  }

  // Check if quiz is published
  if (quiz.isPublished) {
    throw new BadRequestError("Cannot reorder questions in a published quiz");
  }

  // Validate questionOrders format
  if (!Array.isArray(questionOrders) || questionOrders.length === 0) {
    throw new BadRequestError("Question orders must be a non-empty array");
  }

  // Validate each question ID and order
  for (const item of questionOrders) {
    if (!item.questionId || !Types.ObjectId.isValid(item.questionId)) {
      throw new BadRequestError(`Invalid question ID: ${item.questionId}`);
    }
    
    if (typeof item.orderIndex !== 'number' || item.orderIndex < 1) {
      throw new BadRequestError(`Invalid order index for question ${item.questionId}`);
    }
  }

  // Use transaction to update all questions
  await withTransaction(async (session) => {
    // Update each question's order
    for (const item of questionOrders) {
      await Question.findOneAndUpdate(
        { _id: item.questionId, quizId },
        { orderIndex: item.orderIndex },
        { session }
      );
    }
  });

  // Get updated questions
  const updatedQuestions = await Question.find({ quizId }).sort({ orderIndex: 1 });

  res.json({
    success: true,
    message: "Questions reordered successfully",
    data: updatedQuestions,
  });
});
