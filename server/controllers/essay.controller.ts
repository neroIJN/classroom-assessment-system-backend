import { Request, Response, NextFunction } from "express";
import {
    createEssayAssignment,
    getEssayById,
    updateEssay,
    deleteEssay,
    getAllEssays,
    addEssayItem,
  } from "../services/essay.service";
  import EssayAssignmentModel from "../models/essay.model";

// Create a new essay assignment
export const createEssayAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const essayAssignment = await createEssayAssignment(req.body);
    res.status(201).json({
      success: true,
      essayAssignment,
    });
  } catch (error) {
    next(error);
  }
};

// Get an essay assignment by ID
export const getEssayAssignmentByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const essayAssignment = await getEssayById(req.params.id);
      if (!essayAssignment) {
        return res.status(404).json({
          success: false,
          message: "Essay assignment not found",
        });
      }
      res.status(200).json({
        success: true,
        essayAssignment,
      });
    } catch (error) {
      next(error);
    }
};

// Update an essay assignment by ID
export const updateEssayAssignmentController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const updatedEssayAssignment = await updateEssay(req.params.id, req.body);
        res.status(200).json({
            success: true,
            essayAssignment: updatedEssayAssignment,
        });
    } catch (error) {
        next(error);
    }
};

// Delete an essay assignment by ID
export const deleteEssayAssignmentController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        await deleteEssay(req.params.id);
        res.status(204).json({
            success: true,
            message: "Essay assignment deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Get all essay assignments
export const getAllEssayAssignmentsController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const essayAssignments = await getAllEssays(req.params.teacherId);
        res.status(200).json({
            success: true,
            essayAssignments,
        });
    } catch (error) {
        next(error);
    }
};

// Add an item to an essay assignment
export const addEssayItemController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const updatedEssayAssignment = await addEssayItem(req.params.id, req.body);
        res.status(200).json({
            success: true,
            essayAssignment: updatedEssayAssignment,
        });
    } catch (error) {
        next(error);
    }
};