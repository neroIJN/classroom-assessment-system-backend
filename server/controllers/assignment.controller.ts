import { Request, Response, NextFunction } from 'express';
import {
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAllAssignments,
  getActiveAssignments,
  getUpcomingAssignments,
  getPastAssignments,
  startQuiz,
  submitQuiz,
  getQuizSubmission,
  getQuizSubmissionsByUser,
  getQuizSubmissionsByAssignment,
  updateScore,
  updateAttemptedStudentsService,
} from '../services/assignment.service';
import { IAssignment } from '../models/mcq.model';

// Create a new assignment
export const createAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignment = await createAssignment(req.body);
    console.log(assignment);
    res.status(201).json({
      success: true,
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

// Get an assignment by ID
export const getAssignmentByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignment = await getAssignmentById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }
    
    // For students accessing the waiting page, don't include questions to prevent cheating
    // Only return the basic information needed for the waiting page
    if (req.query.forWaiting === 'true') {
      return res.status(200).json({
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        timeLimit: assignment.timeLimit,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        teacherId: assignment.teacherId,
        success: true
      });
    }
    
    // Otherwise return the full assignment (for teachers or when taking the quiz)
    res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    next(error);
  }
};

// Update an assignment by ID
export const updateAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedAssignment = await updateAssignment(req.params.id, req.body);
    res.status(200).json({
      success: true,
      assignment: updatedAssignment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete an assignment by ID
export const deleteAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteAssignment(req.params.id);
    res.status(204).json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get all assignments for a teacher
export const getAllAssignmentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignments = await getAllAssignments(req.params.teacherId);
    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    next(error);
  }
};

// Get active assignments for a teacher
export const getActiveAssignmentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignments = await getActiveAssignments(req.params.teacherId);
    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    next(error);
  }
};

// Get upcoming assignments for a teacher
export const getUpcomingAssignmentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignments = await getUpcomingAssignments(req.params.teacherId);
    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    next(error);
  }
};

// Get past assignments for a teacher
export const getPastAssignmentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignments = await getPastAssignments(req.params.teacherId);
    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    next(error);
  }
};

// Start a quiz
export const startQuizController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assignment, startTime, score } = await startQuiz(req.params.id, req.body.userId);
    res.status(200).json({
      success: true,
      assignment,
      startTime,
      score,
    });
  } catch (error) {
    next(error);
  }
};

// Submit a quiz
export const submitQuizController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, answers, startTime } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Answers must be provided as an array',
      });
    }

    const submission = {
      assignmentId: req.params.id,
      userId,
      answers,
      startTime: new Date(startTime),
    };

    const result = await submitQuiz(submission);
    res.status(200).json({
      success: true,
      submission: result,
    });
  } catch (error: any) {
    console.error('Error in quiz submission:', error);
    if (error.message === 'Time limit exceeded' || 
        error.message === 'This assignment has expired, submissions are no longer accepted' ||
        error.message.includes('Question') || 
        error.message.includes('Option')) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

// Get a specific quiz submission
export const getQuizSubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submission = await getQuizSubmission(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
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

// Get all quiz submissions for a user
export const getQuizSubmissionsByUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissions = await getQuizSubmissionsByUser(req.params.userId);
    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// Get all quiz submissions for an assignment
export const getQuizSubmissionsByAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissions = await getQuizSubmissionsByAssignment(req.params.id);
    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// Calculate the score real time for quiz
export const calculateScoreController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignment = await getAssignmentById(req.params.id);
    const { answers } = req.body;

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    const score = updateScore(assignment, answers);
    res.status(200).json({
      success: true,
      score
    });
  } catch (error) {
    next(error);
  }
};

// update attempted students
export const updateAttemptedStudentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assignmentId, studentId } = req.body;
    const assignment = await updateAttemptedStudentsService(assignmentId, studentId);
    // const assignment = await getAssignmentById(assignmentId);
    // if (!assignment) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Assignment not found',
    //   });
    // }
    // if (!assignment.attemptedStudents.includes(studentId)) {
    //   assignment.attemptedStudents.push(studentId);
    //   await assignment.save();
    // }
    // res.status(200).json({
    //   success: true,
    //   attemptedStudents: assignment.attemptedStudents,
    // });
    return res.status(200).json({
      success: true,
      attemptedStudents: assignment.attemptedStudents,
    });
  } catch (error) {
    next(error);
  }
};