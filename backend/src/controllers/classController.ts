import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { Class, Quiz, Student, Teacher } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { NotFoundError, BadRequestError, ForbiddenError } from "../utils/customErrors";
import { generateJoinCode } from "../utils/generalUtils";
import { withTransaction } from "../utils/transactionUtils";
import { UserRole } from "../constants";

/**
 * Create a new class
 * @route POST /api/classes
 * @access Private/Teacher
 */
export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, subject } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Generate a unique join code
  const joinCode = generateJoinCode();

  // Set join code expiry to 30 days from now
  const joinCodeExpiry = new Date();
  joinCodeExpiry.setDate(joinCodeExpiry.getDate() + 30);

  // Use the transaction utility to handle the transaction
  const newClass = await withTransaction(async (session) => {
    // Create new class
    const classData = {
      name,
      description,
      subject,
      joinCode,
      joinCodeExpiry,
      createdBy: teacher._id,
      students: [],
    };

    // Create and save class with transaction
    const createdClass = await Class.create([classData], { session });

    // Update teacher's classes array
    await Teacher.findByIdAndUpdate(
      teacher._id,
      { $push: { classes: createdClass[0]._id } },
      { session }
    );

    return createdClass[0];
  });

  res.status(201).json({
    success: true,
    message: "Class created successfully",
    data: {
      _id: newClass._id,
      name: newClass.name,
      description: newClass.description,
      joinCode: newClass.joinCode,
      joinCodeExpiry: newClass.joinCodeExpiry,
      createdBy: newClass.createdBy,
    },
  });
});

/**
 * Get all classes (teacher sees their own classes, students see enrolled classes)
 * @route GET /api/classes
 * @access Private/Teacher or Student
 */
export const getClasses = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const { page = 1, limit = 10, search = "", sort = "createdAt", order = "desc" } = req.query;

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Build query based on user role and search term
  const query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Add role-specific filters
  if (user.role === UserRole.TEACHER) {
    query.createdBy = user._id;
  } else if (user.role === UserRole.STUDENT) {
    // For students, find classes they're enrolled in
    query._id = { $in: user.classes };
  } else {
    throw new ForbiddenError("You don't have permission to access classes");
  }

  // Add filter for non-archived classes
  query.isArchived = false;

  // Set up sorting
  const sortDirection = order === "asc" ? 1 : -1;
  const sortOptions: any = {};
  sortOptions[sort as string] = sortDirection;

  // Count total classes for pagination
  const total = await Class.countDocuments(query);

  // Get classes with pagination
  const classes = await Class.find(query)
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .populate("createdBy", "username email firstName lastName")
    .select("-students"); // Don't include the full students array for performance

  res.json({
    success: true,
    data: classes,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
    },
  });
});

/**
 * Get class by ID
 * @route GET /api/classes/:id
 * @access Private/Teacher (if owner) or Student (if enrolled)
 */
export const getClassById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid class ID format");
  }

  // Find class
  const classItem = await Class.findById(id)
    .populate("createdBy", "username email firstName lastName");

  if (!classItem) {
    throw new NotFoundError("Class not found");
  }

  // Check permissions
  if (
    user.role === UserRole.TEACHER &&
    classItem.createdBy.toString() !== user._id.toString()
  ) {
    throw new ForbiddenError("You don't have permission to access this class");
  } else if (
    user.role === UserRole.STUDENT &&
    !classItem.students.includes(user._id)
  ) {
    throw new ForbiddenError("You are not enrolled in this class");
  }

  res.json({
    success: true,
    data: classItem,
  });
});

/**
 * Update class
 * @route PUT /api/classes/:id
 * @access Private/Teacher (if owner)
 */
export const updateClass = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, subject } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid class ID format");
  }

  // Check if class exists and teacher is the owner
  const classItem = await Class.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!classItem) {
    throw new NotFoundError("Class not found or you don't have permission");
  }

  // Use transaction to update the class
  const updatedClass = await withTransaction(async (session) => {
    // Update class fields
    if (name) classItem.name = name;
    if (description !== undefined) classItem.description = description;
    if (subject) classItem.subject = subject;

    // Update the updatedAt field
    classItem.updatedAt = new Date();

    // Save the updated class
    await classItem.save({ session });

    return classItem;
  });

  res.json({
    success: true,
    message: "Class updated successfully",
    data: updatedClass,
  });
});

/**
 * Delete class
 * @route DELETE /api/classes/:id
 * @access Private/Teacher (if owner)
 */
export const deleteClass = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid class ID format");
  }

  // Check if class exists and teacher is the owner
  const classItem = await Class.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!classItem) {
    throw new NotFoundError("Class not found or you don't have permission");
  }

  // Use transaction to delete the class and update related documents
  await withTransaction(async (session) => {
    // Remove class from teacher's classes array
    await Teacher.findByIdAndUpdate(
      teacher._id,
      { $pull: { classes: classItem._id } },
      { session }
    );

    // Remove class from all enrolled students' classes arrays
    await Student.updateMany(
      { classes: classItem._id },
      { $pull: { classes: classItem._id } },
      { session }
    );

    // Delete all quizzes associated with this class
    await Quiz.deleteMany({ classId: classItem._id }, { session });

    // Delete the class
    await Class.findByIdAndDelete(classItem._id, { session });
  });

  res.json({
    success: true,
    message: "Class deleted successfully",
  });
});

/**
 * Regenerate class join code
 * @route POST /api/classes/:id/regenerate-code
 * @access Private/Teacher (if owner)
 */
export const regenerateJoinCode = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid class ID format");
  }

  // Check if class exists and teacher is the owner
  const classItem = await Class.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!classItem) {
    throw new NotFoundError("Class not found or you don't have permission");
  }

  // Generate a new join code
  const newJoinCode = generateJoinCode();

  // Set join code expiry to 30 days from now
  const joinCodeExpiry = new Date();
  joinCodeExpiry.setDate(joinCodeExpiry.getDate() + 30);

  // Update the class with the new join code
  classItem.joinCode = newJoinCode;
  classItem.joinCodeExpiry = joinCodeExpiry;
  classItem.updatedAt = new Date();

  await classItem.save();

  res.json({
    success: true,
    message: "Join code regenerated successfully",
    data: {
      joinCode: newJoinCode,
      joinCodeExpiry,
    },
  });
});

/**
 * Get all students in class
 * @route GET /api/classes/:id/students
 * @access Private/Teacher (if owner)
 */
export const getClassStudents = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10, search = "" } = req.query;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid class ID format");
  }

  // Check if class exists and teacher is the owner
  const classItem = await Class.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!classItem) {
    throw new NotFoundError("Class not found or you don't have permission");
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Build query for students
  const query: any = {
    _id: { $in: classItem.students },
  };

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  // Count total students for pagination
  const total = await Student.countDocuments(query);

  // Get students with pagination
  const students = await Student.find(query)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .select("_id username email firstName lastName isVerified");

  res.json({
    success: true,
    data: students,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
    },
  });
});

/**
 * Remove student from class
 * @route DELETE /api/classes/:id/students/:studentId
 * @access Private/Teacher (if owner)
 */
export const removeStudentFromClass = asyncHandler(async (req: Request, res: Response) => {
  const { id, studentId } = req.params;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Validate ID formats
  if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(studentId)) {
    throw new BadRequestError("Invalid ID format");
  }

  // Check if class exists and teacher is the owner
  const classItem = await Class.findOne({
    _id: id,
    createdBy: teacher._id,
  });

  if (!classItem) {
    throw new NotFoundError("Class not found or you don't have permission");
  }

  // Check if student exists
  const student = await Student.findById(studentId);

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  // Check if student is enrolled in the class
  const studentIdStr = studentId.toString();
  const isEnrolled = classItem.students.some(id => id.toString() === studentIdStr);

  if (!isEnrolled) {
    throw new BadRequestError("Student is not enrolled in this class");
  }

  // Use transaction to remove student from class
  await withTransaction(async (session) => {
    // Remove class from student's classes array
    await Student.findByIdAndUpdate(
      studentId,
      { $pull: { classes: classItem._id } },
      { session }
    );

    // Remove student from class's students array
    await Class.findByIdAndUpdate(
      id,
      { $pull: { students: student._id } },
      { session }
    );
  });

  res.json({
    success: true,
    message: "Student removed from class successfully",
  });
});

/**
 * Get all quizzes in class
 * @route GET /api/classes/:id/quizzes
 * @access Private/Teacher (if owner) or Student (if enrolled)
 */
export const getClassQuizzes = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10, search = "", sort = "createdAt", order = "desc" } = req.query;
  const user = req.user;

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid class ID format");
  }

  // Find class
  const classItem = await Class.findById(id);

  if (!classItem) {
    throw new NotFoundError("Class not found");
  }

  // Check permissions
  if (
    user.role === UserRole.TEACHER &&
    classItem.createdBy.toString() !== user._id.toString()
  ) {
    throw new ForbiddenError("You don't have permission to access this class");
  } else if (user.role === UserRole.STUDENT) {
    // Check if student is enrolled in the class
    const userIdStr = user._id.toString();
    const isEnrolled = classItem.students.some(id => id.toString() === userIdStr);

    if (!isEnrolled) {
      throw new ForbiddenError("You are not enrolled in this class");
    }
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Build query for quizzes
  const query: any = {
    classId: id,
  };

  // Students should only see published quizzes
  if (user.role === UserRole.STUDENT) {
    query.isPublished = true;

    // Students should only see quizzes that are currently available
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
  }

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
    .populate("createdBy", "username email firstName lastName");

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
