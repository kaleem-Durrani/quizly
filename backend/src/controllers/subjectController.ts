import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { Subject } from "../models";
import asyncHandler from "../utils/asyncHandler";
import { NotFoundError, BadRequestError, ForbiddenError } from "../utils/customErrors";
import { withTransaction } from "../utils/transactionUtils";

/**
 * Create a new subject
 * @route POST /api/subjects
 * @access Private/Admin
 */
export const createSubject = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, isActive } = req.body;
  
  // Check if subject with the same name already exists
  const existingSubject = await Subject.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  
  if (existingSubject) {
    throw new BadRequestError("Subject with this name already exists");
  }
  
  // Create new subject
  const subject = await Subject.create({
    name,
    description,
    isActive: isActive !== undefined ? isActive : true,
  });
  
  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    data: subject,
  });
});

/**
 * Get all subjects
 * @route GET /api/subjects
 * @access Private
 */
export const getSubjects = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search = "", sort = "name", order = "asc", active } = req.query;
  
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  
  // Build query based on search term and active status
  const query: any = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  
  if (active !== undefined) {
    query.isActive = active === "true";
  }
  
  // Set up sorting
  const sortDirection = order === "asc" ? 1 : -1;
  const sortOptions: any = {};
  sortOptions[sort as string] = sortDirection;
  
  // Count total subjects for pagination
  const total = await Subject.countDocuments(query);
  
  // Get subjects with pagination
  const subjects = await Subject.find(query)
    .sort(sortOptions)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);
  
  res.json({
    success: true,
    data: subjects,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
    },
  });
});

/**
 * Get subject by ID
 * @route GET /api/subjects/:id
 * @access Private
 */
export const getSubjectById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid subject ID format");
  }
  
  // Find subject
  const subject = await Subject.findById(id);
  
  if (!subject) {
    throw new NotFoundError("Subject not found");
  }
  
  res.json({
    success: true,
    data: subject,
  });
});

/**
 * Update subject
 * @route PUT /api/subjects/:id
 * @access Private/Admin
 */
export const updateSubject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, isActive } = req.body;
  
  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid subject ID format");
  }
  
  // Find subject
  const subject = await Subject.findById(id);
  
  if (!subject) {
    throw new NotFoundError("Subject not found");
  }
  
  // If name is being updated, check for duplicates
  if (name && name !== subject.name) {
    const existingSubject = await Subject.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: id }
    });
    
    if (existingSubject) {
      throw new BadRequestError("Subject with this name already exists");
    }
  }
  
  // Update subject fields
  if (name) subject.name = name;
  if (description !== undefined) subject.description = description;
  if (isActive !== undefined) subject.isActive = isActive;
  
  // Save the updated subject
  await subject.save();
  
  res.json({
    success: true,
    message: "Subject updated successfully",
    data: subject,
  });
});

/**
 * Delete subject
 * @route DELETE /api/subjects/:id
 * @access Private/Admin
 */
export const deleteSubject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Validate ID format
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid subject ID format");
  }
  
  // Find subject
  const subject = await Subject.findById(id);
  
  if (!subject) {
    throw new NotFoundError("Subject not found");
  }
  
  // Delete the subject
  await Subject.findByIdAndDelete(id);
  
  res.json({
    success: true,
    message: "Subject deleted successfully",
  });
});
