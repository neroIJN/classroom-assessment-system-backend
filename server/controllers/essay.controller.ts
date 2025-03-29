import { Request, Response, NextFunction } from "express";
import {
    createEssayAssignment,
    getEssayById,
    updateEssay,
    deleteEssay,
    getAllEssays,
    addEssayItem,
    startEssayAssignment,
    submitEssay,
    getEssaySubmission,
    getEssaySubmissionsByUser,
    getEssaySubmissionsByAssignment,
    getActiveEssays,
    getUpcomingEssays,
    getPastEssays
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

// Get active essay assignments
export const getActiveEssayAssignmentsController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const essayAssignments = await getActiveEssays(req.params.teacherId);
        res.status(200).json({
            success: true,
            essayAssignments,
        });
    } catch (error) {
        next(error);
    }
};

// Get upcoming essay assignments
export const getUpcomingEssayAssignmentsController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const essayAssignments = await getUpcomingEssays(req.params.teacherId);
        res.status(200).json({
            success: true,
            essayAssignments,
        });
    } catch (error) {
        next(error);
    }
};

// Get past essay assignments
export const getPastEssayAssignmentsController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const essayAssignments = await getPastEssays(req.params.teacherId);
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

// Start an essay assignment
export const startEssayAssignmentController = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const {assignment, startTime, score} = await startEssayAssignment(req.params.id, req.body.userId);
    res.status(200).json({
      success: true,
      assignment,
      startTime,
      score
    });
  } catch (error) {
    next(error);    
  }
};

// Submit an essay assignment
export const submitEssayAssignmentController = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const {userId, answers, startTime} = req.body;

    if(!Array.isArray(answers)){
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const submission = {
      assignmentId: req.params.id,
      userId,
      answers,
      startTime: new Date(startTime),
    };

    const result = await submitEssay(submission);
    res.status(200).json({
      success: true,
      submission: result,
    });
  } catch (error: any) {
    console.error("Error in essay submission:", error);
    if (error.message === "Time limit exceeded" || 
        error.message === "This assignment has expired, submissions are no longer accepted" ||
        error.message === "This assignment is not yet available") {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }   
  }
};

// Get specific essay submission
export const getEssaySubmissionController = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const submission = await getEssaySubmission(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }
    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    next(error);
  }
};

// Get all essay submissions for a user
export const getEssaySubmissionsByUserController = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const submissions = await getEssaySubmissionsByUser(req.params.userId);
    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// Get all essay submissions for an assignment
export const getEssaySubmissionsByAssignmentController = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const submissions = await getEssaySubmissionsByAssignment(req.params.assignmentId);
    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};