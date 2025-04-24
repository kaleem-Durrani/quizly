import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose, { Types } from "mongoose";
import { Teacher, Class } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { NotFoundError, BadRequestError } from "../utils/customErrors";
import { generateJoinCode } from "../utils/generalUtils";
import { withTransaction } from "../utils/transactionUtils";

/**
 * Get teacher profile
 * @route GET /api/teachers/profile
 */
export const getTeacherProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const teacher = req.user;

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    res.json({
      success: true,
      data: {
        _id: teacher._id,
        username: teacher.username,
        email: teacher.email,
        role: teacher.role,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        isVerified: teacher.isVerified,
        createdAt: teacher.createdAt,
      },
    });
  }
);

/**
 * Update teacher profile
 * @route PUT /api/teachers/profile
 */
export const updateTeacherProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const teacher = req.user;

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    const { firstName, lastName, password } = req.body;

    // Update teacher object
    if (firstName) teacher.firstName = firstName;
    if (lastName) teacher.lastName = lastName;

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      teacher.password = await bcrypt.hash(password, salt);
    }

    // Use the transaction utility to handle the transaction
    const updatedTeacher = await withTransaction(async (session) => {
      // Save updated teacher with transaction
      return await teacher.save({ session });
    });

    res.json({
      success: true,
      data: {
        _id: updatedTeacher._id,
        username: updatedTeacher.username,
        email: updatedTeacher.email,
        role: updatedTeacher.role,
        firstName: updatedTeacher.firstName,
        lastName: updatedTeacher.lastName,
        isVerified: updatedTeacher.isVerified,
        createdAt: updatedTeacher.createdAt,
      },
    });
  }
);

/**
 * Create a new class
 * @route POST /api/teachers/classes
 */
export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, subject } = req.body;
  const teacher = req.user;

  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  // Generate a unique join code
  const joinCode = generateJoinCode();

  // Use the transaction utility to handle the transaction
  const newClass = await withTransaction(async (session) => {
    // Create new class
    const classData = {
      name,
      description,
      subject,
      joinCode,
      createdBy: teacher._id,
    };

    // Create and save class with transaction
    const createdClass = await Class.create([classData], { session });
    return createdClass[0];
  });

  res.status(201).json({
    success: true,
    message: "Class created successfully",
    data: newClass,
  });
});

/**
 * Get all classes created by a teacher
 * @route GET /api/teachers/classes
 */
export const getTeacherClasses = asyncHandler(
  async (req: Request, res: Response) => {
    const teacher = req.user;
    const { page = 1, limit = 10 } = req.query;

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Find all classes created by the teacher
    const classes = await Class.find({ createdBy: teacher._id })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Count total classes for pagination
    const total = await Class.countDocuments({ createdBy: teacher._id });

    res.json({
      success: true,
      data: classes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  }
);

/**
 * Get a specific class by ID
 * @route GET /api/teachers/classes/:id
 */
export const getClassById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const teacher = req.user;

    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Validate ID format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid class ID format");
    }

    // Find class
    const classItem = await Class.findOne({
      _id: id,
      createdBy: teacher._id,
    }).populate("createdBy", "username email");

    if (!classItem) {
      throw new NotFoundError("Class not found or you don't have permission");
    }

    res.json({
      success: true,
      data: classItem,
    });
  }
);

/**
 * Update a class
 * @route PUT /api/teachers/classes/:id
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

  // Find and update class
  const updatedClass = await Class.findOneAndUpdate(
    { _id: id, createdBy: teacher._id },
    { name, description, subject },
    { new: true }
  );

  if (!updatedClass) {
    throw new NotFoundError("Class not found or you don't have permission");
  }

  res.json({
    success: true,
    message: "Class updated successfully",
    data: updatedClass,
  });
});

/**
 * Delete a class
 * @route DELETE /api/teachers/classes/:id
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

  // Find and delete class
  const deletedClass = await Class.findOneAndDelete({
    _id: id,
    createdBy: teacher._id,
  });

  if (!deletedClass) {
    throw new NotFoundError("Class not found or you don't have permission");
  }

  res.json({
    success: true,
    message: "Class deleted successfully",
  });
});
