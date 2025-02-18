import { Request, Response, NextFunction } from 'express';
import {
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getAllAssignments,
  startQuiz,
  submitQuiz,
  getQuizSubmission,
  getQuizSubmissionsByUser,
  getQuizSubmissionsByAssignment,
  updateScore,
  
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
export const getAssignmentByIdController = async (req: Request, res: Response) => {
  const assignment = await getAssignmentById(req.params.id);
  res.status(200).json({
    success: true,
    assignment,
  });
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

// Start a quiz
export const startQuizController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assignment, startTime } = await startQuiz(req.params.id, req.body.userId);
    res.status(200).json({
      success: true,
      assignment,
      startTime,
    });
  } catch (error) {
    next(error);
  }
};

// Submit a quiz
// export const submitQuizController = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { userId, answers, startTime } = req.body;

//     if (!Array.isArray(answers)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Answers must be provided as an array',
//       });
//     }

//     const submission = {
//       assignmentId: req.params.id,
//       userId,
//       answers,
//       startTime: new Date(startTime),
//     };

//     const result = await submitQuiz(submission);
//     res.status(200).json({
//       success: true,
//       submission: result,
//     });
//   } catch (error: any) {
//     console.error('Error in quiz submission:', error);
//     if (error.message === 'Time limit exceeded') {
//       res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     } else {
//       next(error);
//     }
//   }
// };

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

//calculate the score real time for quiz,
//Here teacher can use this method if need , after the assignment the result wiil be visible to the users

export const calculateScoreController = async (req: Request, res: Response, next: NextFunction) =>{
  try {
    const assignment = await getAssignmentById(req.params.id)
    const {answers} = req.body;

    if(assignment){
      const score = updateScore(assignment, answers);
      res.status(200).json({
        success:true,
        score
      })
    }
  } catch (error) {
    next(error)
  }
};

