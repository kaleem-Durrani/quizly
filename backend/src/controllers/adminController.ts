import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose, { Types } from "mongoose";
import { Student, Teacher, Quiz, Submission, Admin } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { NotFoundError, BadRequestError } from "../utils/customErrors";
import { withTransaction } from "../utils/transactionUtils";

interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}

/**
 * Get admin dashboard data
 * @route GET /api/admin/dashboard
 */
export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    // Get counts for dashboard
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const quizCount = await Quiz.countDocuments();
    const submissionCount = await Submission.countDocuments();
    const adminCount = await Admin.countDocuments();
    const totalUserCount = studentCount + teacherCount;

    // Get recent users (students and teachers)
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("-password");

    const recentTeachers = await Teacher.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("-password");

    // Combine and sort by createdAt
    const recentUsers = [...recentStudents, ...recentTeachers].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Get recent quizzes
    const recentQuizzes = await Quiz.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "username email");

    res.json({
      success: true,
      data: {
        counts: {
          users: totalUserCount,
          quizzes: quizCount,
          submissions: submissionCount,
          teachers: teacherCount,
          students: studentCount,
          admins: adminCount,
        },
        recentUsers,
        recentQuizzes,
      },
    });
  }
);

/**
 * Get all students with pagination (admin only)
 * @route GET /api/admin/students
 */
export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
    search = "",
  } = req.query as PaginationQuery;

  // Build query for students
  const queryObj: any = {};
  if (search) {
    queryObj.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  // Set up sorting
  const sortDirection = order === "asc" ? 1 : -1;
  const sortOptions: any = {};
  sortOptions[sort] = sortDirection;

  // Count total documents for pagination
  const total = await Student.countDocuments(queryObj);

  // Get students with pagination
  const students = await Student.find(queryObj)
    .sort(sortOptions)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .select("-password");

  res.json({
    success: true,
    data: students,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

/**
 * Get all teachers with pagination (admin only)
 * @route GET /api/admin/teachers
 */
export const getTeachers = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
    search = "",
  } = req.query as PaginationQuery;

  // Build query for teachers
  const queryObj: any = {};
  if (search) {
    queryObj.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  // Set up sorting
  const sortDirection = order === "asc" ? 1 : -1;
  const sortOptions: any = {};
  sortOptions[sort] = sortDirection;

  // Count total documents for pagination
  const total = await Teacher.countDocuments(queryObj);

  // Get teachers with pagination
  const teachers = await Teacher.find(queryObj)
    .sort(sortOptions)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .select("-password");

  res.json({
    success: true,
    data: teachers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

/**
 * Update a student (admin only)
 * @route PUT /api/admin/students/:id
 */
export const updateStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, firstName, lastName, password } = req.body;

    // Find the student
    const student = await Student.findById(id);

    // If not found
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Update student fields
    if (username) student.username = username;
    if (email) student.email = email;
    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password, salt);
    }

    // Use the transaction utility to handle the transaction
    const updatedStudent = await withTransaction(async (session) => {
      // Save updated student with transaction
      return await student.save({ session });
    });

    res.json({
      success: true,
      data: {
        _id: updatedStudent._id,
        username: updatedStudent.username,
        email: updatedStudent.email,
        role: "student",
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
      },
    });
  }
);

/**
 * Update a teacher (admin only)
 * @route PUT /api/admin/teachers/:id
 */
export const updateTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, firstName, lastName, password, isBanned } =
      req.body;

    // Find the teacher
    const teacher = await Teacher.findById(id);

    // If not found
    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Update teacher fields
    if (username) teacher.username = username;
    if (email) teacher.email = email;
    if (firstName) teacher.firstName = firstName;
    if (lastName) teacher.lastName = lastName;
    if (isBanned !== undefined) teacher.isBanned = isBanned;

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
        role: "teacher",
        firstName: updatedTeacher.firstName,
        lastName: updatedTeacher.lastName,
        isBanned: updatedTeacher.isBanned,
      },
    });
  }
);

/**
 * Delete a student (admin only)
 * @route DELETE /api/admin/students/:id
 */
export const deleteStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Find and delete student
    const student = await Student.findById(id);
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      await student.deleteOne({ session });
    });

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  }
);

/**
 * Delete a teacher (admin only)
 * @route DELETE /api/admin/teachers/:id
 */
export const deleteTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Find and delete teacher
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      throw new NotFoundError("Teacher not found");
    }

    // Use the transaction utility to handle the transaction
    await withTransaction(async (session) => {
      await teacher.deleteOne({ session });
    });

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  }
);

/**
 * Get all quizzes with pagination (admin only)
 * @route GET /api/admin/quizzes
 */
export const getQuizzes = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
    search = "",
  } = req.query as PaginationQuery;

  // Build query
  const query: any = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Count total documents for pagination
  const total = await Quiz.countDocuments(query);

  // Set up sorting
  const sortDirection = order === "asc" ? 1 : -1;
  const sortOptions: any = {};
  sortOptions[sort] = sortDirection;

  // Get quizzes with pagination
  const quizzes = await Quiz.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("createdBy", "username email");

  res.json({
    success: true,
    data: quizzes,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});
