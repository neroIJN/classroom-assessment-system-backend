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
    getPastEssays,
    getEssayResultsService,
    getEssayViolationSummaryService,
    getStudentEssaySubmission
} from "../services/essay.service";
import EssayAssignmentModel from "../models/essay.model";
import { ErrorHandler } from "../utils/ErrorHandler";
import { getStudentEssayViolations } from "../services/result.service";
import userModel from "../models/user.model";

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
export const submitEssayAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract data from request body
    const { userId, answers, startTime, assignmentId, essayId, registrationNumber } = req.body;

    // Determine assignment ID from either route params or request body
    const finalAssignmentId = req.params.id || assignmentId || essayId;
    
    if (!finalAssignmentId) {
      return res.status(400).json({
        success: false,
        message: "Assignment ID is required",
      });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    const submission = {
      assignmentId: finalAssignmentId,
      userId,
      registrationNumber: registrationNumber || "",
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

export const getEssayResultsController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
      // Use assignmentId if that's what your router is using
      const assignmentId = req.params.assignmentId || req.params.id;

      // Log the request for debugging
      console.log(`Fetching essay results for assignment ID: ${assignmentId}`);

      // Fetch essay results
      const resultsData = await getEssayResultsService(assignmentId);

      res.status(200).json(resultsData);
  } catch (error) {
      console.error('Error fetching essay results:', error);
      next(new ErrorHandler(
          error instanceof Error ? error.message : 'Failed to fetch essay results', 
          500
      ));
  }
};

/**
* Controller to get violation summary for a specific assignment
*/
export const getEssayViolationSummaryController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
      const { id } = req.params;

      // Fetch violation summary
      const violationData = await getEssayViolationSummaryService(id);

      res.status(200).json(violationData);
  } catch (error) {
      next(new ErrorHandler(
          error instanceof Error ? error.message : 'Failed to fetch violation summary', 
          500
      ));
  }
};
export const getStudentEssayViolationsController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { id, sid } = req.params;

    // Fetch violations for the specific student
    const violations = await getStudentEssayViolations(id, sid);

    res.status(200).json({
      success: true,
      violations
    });
  } catch (error) {
    next(new ErrorHandler(
      error instanceof Error ? error.message : 'Failed to fetch student essay violations', 
      500
    ));
  }
};
export const getStudentEssayResultController = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { id, sid } = req.params;
    
    // Log the request for debugging
    console.log(`Fetching essay results for student ${sid} on assignment ${id}`);

    // Find the student submission using both IDs
    const submission = await getStudentEssaySubmission(id, sid);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'No submission found for this student'
      });
    }

    // Get student info
    const student = await userModel.findById(sid);

    // Return the result
    res.status(200).json({
      success: true,
      results: submission,
      studentInfo: student ? {
        name: student.name,
        email: student.email,
        registrationNumber: student.registrationNumber
      } : null
    });
  } catch (error) {
    console.error('Error fetching student essay result:', error);
    next(new ErrorHandler(
      error instanceof Error ? error.message : 'Failed to fetch student essay result', 
      500
    ));
  }
};