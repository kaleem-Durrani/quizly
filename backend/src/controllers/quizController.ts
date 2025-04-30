import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { Quiz, Question, Class, Submission } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { NotFoundError, BadRequestError, ForbiddenError } from "../utils/customErrors";
import { withTransaction } from "../utils/transactionUtils";
import { UserRole } from "../constants";

/**
 * Create a new quiz
 * @route POST /api/quizzes
 * @access Private/Teacher
 */
export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, classId, timeLimit, availableFrom, availableTo, allowReview, passingScore } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate class ID
  if (!Types.ObjectId.isValid(classId)) {
    throw new BadRequestError("Invalid class ID format");
  }

  // Check if class exists and teacher is the owner
  const classItem = await Class.findOne({
    _id: classId,
    createdBy: teacher._id,
  });

  if (!classItem) {
    throw new NotFoundError("Class not found or you don't have permission");
  }

  // Create new quiz
  const quiz = await Quiz.create({
    title,
    description,
    classId,
    createdBy: teacher._id,
    timeLimit,
    availableFrom: availableFrom ? new Date(availableFrom) : undefined,
    availableTo: availableTo ? new Date(availableTo) : undefined,
    allowReview: allowReview !== undefined ? allowReview : true,
    passingScore,
  });

  res.status(201).json({
    success: true,
    message: "Quiz created successfully",
    data: quiz,
  });
});

/**
 * Create a new quiz with questions
 * @route POST /api/quizzes/with-questions
 * @access Private/Teacher
 */
export const createQuizWithQuestions = asyncHandler(async (req: Request, res: Response) => {
  const { quiz: quizData, questions: questionsData } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate class ID
  if (!Types.ObjectId.isValid(quizData.classId)) {
    throw new BadRequestError("Invalid class ID format");
  }

  // Check if class exists and teacher is the owner
  const classItem = await Class.findOne({
    _id: quizData.classId,
    createdBy: teacher._id,
  });

  if (!classItem) {
    throw new NotFoundError("Class not found or you don't have permission");
  }

  // Use transaction to create quiz and questions
  const result = await withTransaction(async (session) => {
    // Create quiz
    const quizDoc = await Quiz.create(
      [{
        title: quizData.title,
        description: quizData.description,
        classId: quizData.classId,
        createdBy: teacher._id,
        timeLimit: quizData.timeLimit,
        availableFrom: quizData.availableFrom ? new Date(quizData.availableFrom) : undefined,
        availableTo: quizData.availableTo ? new Date(quizData.availableTo) : undefined,
        allowReview: quizData.allowReview !== undefined ? quizData.allowReview : true,
        passingScore: quizData.passingScore,
      }],
      { session }
    );

    const quiz = quizDoc[0];

    // Create questions if provided
    if (questionsData && questionsData.length > 0) {
      // Prepare questions with quiz ID and ensure orderIndex
      const questionsToCreate = questionsData.map((q: any, index: number) => ({
        ...q,
        quizId: quiz._id,
        orderIndex: q.orderIndex || index + 1,
      }));

      // Create questions
      const questions = await Question.create(questionsToCreate, { session });

      return { quiz, questions };
    }

    return { quiz, questions: [] };
  });

  res.status(201).json({
    success: true,
    message: "Quiz with questions created successfully",
    data: result,
  });
});

/**
 * Add multiple questions to a quiz
 * @route POST /api/quizzes/:id/questions/batch
 * @access Private/Teacher
 */
export const addQuestionsBatch = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { questions: questionsData } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate quiz ID
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid quiz ID format");
  }

  // Check if quiz exists and teacher is the owner
  const quiz = await Quiz.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found or you don't have permission");
  }

  // Check if quiz is published
  if (quiz.isPublished) {
    throw new BadRequestError("Cannot add questions to a published quiz");
  }

  // Get the current highest orderIndex
  const highestOrderQuestion = await Question.findOne({ quizId: id })
    .sort({ orderIndex: -1 })
    .select('orderIndex');

  const startOrderIndex = highestOrderQuestion ? highestOrderQuestion.orderIndex + 1 : 1;

  // Use transaction to add questions
  const questions = await withTransaction(async (session) => {
    // Prepare questions with quiz ID and ensure orderIndex
    const questionsToCreate = questionsData.map((q: any, index: number) => ({
      ...q,
      quizId: id,
      orderIndex: q.orderIndex || startOrderIndex + index,
    }));

    // Create questions
    return await Question.create(questionsToCreate, { session });
  });

  res.status(201).json({
    success: true,
    message: "Questions added successfully",
    data: questions,
  });
});

/**
 * Get all quizzes for a teacher
 * @route GET /api/quizzes
 * @access Private/Teacher
 */
export const getTeacherQuizzes = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search = "", sort = "createdAt", order = "desc", classId } = req.query;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Build query based on search term and class ID
  const query: any = {
    createdBy: teacher._id,
  };

  if (classId) {
    if (!Types.ObjectId.isValid(classId as string)) {
      throw new BadRequestError("Invalid class ID format");
    }
    query.classId = classId;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Set up sorting
  const sortDirection = order === "asc" ? 1 : -1;
  const sortOptions: any = {};
  sortOptions[sort as string] = sortDirection;

  // Count total quizzes for pagination
  const total = await Quiz.countDocuments(query);

  // Get quizzes with pagination
  const quizzes = await Quiz.find(query)
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .populate("classId", "name");

  res.json({
    success: true,
    data: quizzes,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
    },
  });
});

/**
 * Get all quizzes for a student
 * @route GET /api/quizzes/student
 * @access Private/Student
 */
export const getStudentQuizzes = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search = "", sort = "createdAt", order = "desc", classId } = req.query;
  const student = req.user;

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Build query for student's classes
  const classQuery: any = {
    _id: { $in: student.classes },
  };

  if (classId) {
    if (!Types.ObjectId.isValid(classId as string)) {
      throw new BadRequestError("Invalid class ID format");
    }

    // Check if student is enrolled in the specified class
    if (!student.classes.includes(classId as any)) {
      throw new ForbiddenError("You are not enrolled in this class");
    }

    classQuery._id = classId;
  }

  // Get student's classes
  const classes = await Class.find(classQuery).select("_id");
  const classIds = classes.map(c => c._id);

  // Build query for quizzes
  const query: any = {
    classId: { $in: classIds },
    isPublished: true,
  };

  // Add date filter for availability
  const now = new Date();
  query.$or = [
    // No date restrictions
    { availableFrom: { $exists: false }, availableTo: { $exists: false } },
    // Only from date specified
    { availableFrom: { $lte: now }, availableTo: { $exists: false } },
    // Only to date specified
    { availableFrom: { $exists: false }, availableTo: { $gte: now } },
    // Both dates specified
    { availableFrom: { $lte: now }, availableTo: { $gte: now } },
  ];

  if (search) {
    query.$and = [
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
    ];
  }

  // Set up sorting
  const sortDirection = order === "asc" ? 1 : -1;
  const sortOptions: any = {};
  sortOptions[sort as string] = sortDirection;

  // Count total quizzes for pagination
  const total = await Quiz.countDocuments(query);

  // Get quizzes with pagination
  const quizzes = await Quiz.find(query)
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .populate("classId", "name");

  res.json({
    success: true,
    data: quizzes,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
    },
  });
});

/**
 * Get quiz by ID
 * @route GET /api/quizzes/:id
 * @access Private/Teacher (if owner) or Student (if enrolled in class)
 */
export const getQuizById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { withQuestions = "false" } = req.query;
  const user = req.user;

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid quiz ID format");
  }

  // Find quiz
  const quiz = await Quiz.findById(id).populate("classId", "name");

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  // Check permissions
  if (user.role === UserRole.TEACHER) {
    // Teachers can only access their own quizzes
    if (quiz.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenError("You don't have permission to access this quiz");
    }
  } else if (user.role === UserRole.STUDENT) {
    // Students can only access published quizzes from classes they're enrolled in
    const classItem = await Class.findById(quiz.classId);

    if (!classItem) {
      throw new NotFoundError("Class not found");
    }

    if (!classItem.students.includes(user._id)) {
      throw new ForbiddenError("You are not enrolled in this class");
    }

    if (!quiz.isPublished) {
      throw new ForbiddenError("This quiz is not available yet");
    }

    // Check if quiz is currently available
    const now = new Date();
    if (
      (quiz.availableFrom && quiz.availableFrom > now) ||
      (quiz.availableTo && quiz.availableTo < now)
    ) {
      throw new ForbiddenError("This quiz is not currently available");
    }
  }

  // Include questions if requested
  let questions: any[] = [];
  if (withQuestions === "true") {
    questions = await Question.find({ quizId: id }).sort({ orderIndex: 1 });

    // For students, don't include correct answers for MCQ questions
    if (user.role === UserRole.STUDENT) {
      questions = questions.map(q => {
        const question = q.toObject();
        if (question.questionType === "mcq" && question.options) {
          question.options = question.options.map((opt: any) => ({
            ...opt,
            isCorrect: undefined,
          }));
        }
        return question;
      });
    }
  }

  res.json({
    success: true,
    data: {
      quiz,
      questions: withQuestions === "true" ? questions : undefined,
    },
  });
});

/**
 * Update quiz
 * @route PUT /api/quizzes/:id
 * @access Private/Teacher (if owner)
 */
export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, timeLimit, availableFrom, availableTo, allowReview, passingScore } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid quiz ID format");
  }

  // Find quiz
  const quiz = await Quiz.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found or you don't have permission");
  }

  // Update quiz fields
  if (title) quiz.title = title;
  if (description !== undefined) quiz.description = description;
  if (timeLimit !== undefined) quiz.timeLimit = timeLimit;
  if (availableFrom !== undefined) quiz.availableFrom = availableFrom ? new Date(availableFrom) : undefined;
  if (availableTo !== undefined) quiz.availableTo = availableTo ? new Date(availableTo) : undefined;
  if (allowReview !== undefined) quiz.allowReview = allowReview;
  if (passingScore !== undefined) quiz.passingScore = passingScore;

  // Save the updated quiz
  await quiz.save();

  res.json({
    success: true,
    message: "Quiz updated successfully",
    data: quiz,
  });
});

/**
 * Delete quiz
 * @route DELETE /api/quizzes/:id
 * @access Private/Teacher (if owner)
 */
export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid quiz ID format");
  }

  // Find quiz
  const quiz = await Quiz.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found or you don't have permission");
  }

  // Use transaction to delete quiz and related data
  await withTransaction(async (session) => {
    // Delete all questions for this quiz
    await Question.deleteMany({ quizId: id }, { session });

    // Delete all submissions for this quiz
    await Submission.deleteMany({ quizId: id }, { session });

    // Delete the quiz
    await Quiz.findByIdAndDelete(id, { session });
  });

  res.json({
    success: true,
    message: "Quiz deleted successfully",
  });
});

/**
 * Publish quiz
 * @route PUT /api/quizzes/:id/publish
 * @access Private/Teacher (if owner)
 */
export const publishQuiz = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid quiz ID format");
  }

  // Find quiz
  const quiz = await Quiz.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found or you don't have permission");
  }

  // Check if quiz has questions
  const questionCount = await Question.countDocuments({ quizId: id });

  if (questionCount === 0) {
    throw new BadRequestError("Cannot publish a quiz with no questions");
  }

  // Update quiz to published
  quiz.isPublished = true;
  await quiz.save();

  res.json({
    success: true,
    message: "Quiz published successfully",
    data: quiz,
  });
});

/**
 * Get all submissions for a quiz
 * @route GET /api/quizzes/:id/submissions
 * @access Private/Teacher (if owner)
 */
export const getQuizSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10, sort = "submittedAt", order = "desc" } = req.query;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid quiz ID format");
  }

  // Check if quiz exists and teacher is the owner
  const quiz = await Quiz.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!quiz) {
    throw new NotFoundError("Quiz not found or you don't have permission");
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Set up sorting
  const sortDirection = order === "asc" ? 1 : -1;
  const sortOptions: any = {};
  sortOptions[sort as string] = sortDirection;

  // Count total submissions for pagination
  const total = await Submission.countDocuments({ quizId: id });

  // Get submissions with pagination
  const submissions = await Submission.find({ quizId: id })
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .populate("studentId", "username email firstName lastName");

  res.json({
    success: true,
    data: submissions,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
    },
  });
});

/**
 * Start a quiz attempt
 * @route POST /api/quizzes/:id/start
 * @access Private/Student
 */
export const startQuizAttempt = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const student = req.user;

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid quiz ID format");
  }

  // Find quiz
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw new NotFoundError("Quiz not found");
  }

  // Check if quiz is published
  if (!quiz.isPublished) {
    throw new BadRequestError("This quiz is not available");
  }

  // Check if quiz is currently available
  const now = new Date();
  if (
    (quiz.availableFrom && quiz.availableFrom > now) ||
    (quiz.availableTo && quiz.availableTo < now)
  ) {
    throw new BadRequestError("This quiz is not currently available");
  }

  // Check if student is enrolled in the class
  const classItem = await Class.findById(quiz.classId);

  if (!classItem) {
    throw new NotFoundError("Class not found");
  }

  if (!classItem.students.includes(student._id)) {
    throw new ForbiddenError("You are not enrolled in this class");
  }

  // Check if student already has an active attempt
  const activeAttempt = await Submission.findOne({
    quizId: id,
    studentId: student._id,
    isComplete: false,
  });

  if (activeAttempt) {
    return res.json({
      success: true,
      message: "Continuing existing attempt",
      data: activeAttempt,
    });
  }

  // Check if student has already completed the quiz
  const completedAttempt = await Submission.findOne({
    quizId: id,
    studentId: student._id,
    isComplete: true,
  });

  if (completedAttempt) {
    throw new BadRequestError("You have already completed this quiz");
  }

  // Get questions for the quiz
  const questions = await Question.find({ quizId: id }).sort({ orderIndex: 1 });

  if (questions.length === 0) {
    throw new BadRequestError("This quiz has no questions");
  }

  // Create a new submission
  const submission = await Submission.create({
    quizId: id,
    studentId: student._id,
    startedAt: now,
    answers: questions.map(q => ({
      questionId: q._id,
      // Initialize with empty answers
      selectedOptions: [],
      writtenAnswer: "",
    })),
    isComplete: false,
  });

  res.status(201).json({
    success: true,
    message: "Quiz attempt started",
    data: submission,
  });
});
