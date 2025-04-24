import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose, { Types } from "mongoose";
import { Student, Class } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { NotFoundError, BadRequestError } from "../utils/customErrors";
import { withTransaction } from "../utils/transactionUtils";

/**
 * Get student profile
 * @route GET /api/students/profile
 */
export const getStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const student = req.user;

    if (!student) {
      throw new NotFoundError("Student not found");
    }

    res.json({
      success: true,
      data: {
        _id: student._id,
        username: student.username,
        email: student.email,
        role: student.role,
        firstName: student.firstName,
        lastName: student.lastName,
        isVerified: student.isVerified,
        createdAt: student.createdAt,
      },
    });
  }
);

/**
 * Update student profile
 * @route PUT /api/students/profile
 */
export const updateStudentProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const student = req.user;

    if (!student) {
      throw new NotFoundError("Student not found");
    }

    const { firstName, lastName, password } = req.body;

    // Update student object
    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password, salt);
    }

    // Save updated student
    const updatedStudent = await student.save();

    res.json({
      success: true,
      data: {
        _id: updatedStudent._id,
        username: updatedStudent.username,
        email: updatedStudent.email,
        role: updatedStudent.role,
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        isVerified: updatedStudent.isVerified,
        createdAt: updatedStudent.createdAt,
      },
    });
  }
);

/**
 * Join a class using join code
 * @route POST /api/students/join-class
 */
export const joinClass = asyncHandler(async (req: Request, res: Response) => {
  const { joinCode } = req.body;
  const student = req.user;

  if (!student) {
    throw new NotFoundError("Student not found");
  }

  // Get class by join code
  const classToJoin = await Class.findOne({
    joinCode,
    joinCodeExpiry: { $gt: new Date() },
    isArchived: false,
  });

  if (!classToJoin) {
    throw new NotFoundError("Class not found or join code expired");
  }

  // Check if student is already enrolled
  if (student.classes.includes(classToJoin._id)) {
    throw new BadRequestError("You are already enrolled in this class");
  }

  // Use the transaction utility to handle the transaction
  await withTransaction(async (session) => {
    // Add class to student's classes
    student.classes.push(classToJoin._id);
    await student.save({ session });

    // Add student to class's students
    classToJoin.students.push(student._id);
    await classToJoin.save({ session });
  });

  res.json({
    success: true,
    message: "Joined class successfully",
    data: {
      class: {
        _id: classToJoin._id,
        name: classToJoin.name,
        description: classToJoin.description,
      },
    },
  });
});

/**
 * Get all classes a student is enrolled in
 * @route GET /api/students/classes
 */
export const getStudentClasses = asyncHandler(
  async (req: Request, res: Response) => {
    const student = req.user;
    const { page = 1, limit = 10 } = req.query;

    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Find all classes the student is enrolled in
    const classes = await Class.find({ _id: { $in: student.classes } })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate("createdBy", "username email");

    // Count total classes for pagination
    const total = await Class.countDocuments({ _id: { $in: student.classes } });

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
