import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import AssignmentModel from '../models/mcq.model';
import { ErrorHandler } from "../utils/ErrorHandler";

export const checkAssignmentExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid assignment ID', 400));
    }
    
    const assignment = await AssignmentModel.findById(id);
    
    if (!assignment) {
      return next(new ErrorHandler('Assignment not found', 404));
    }
    
    req.assignment = assignment;
    next();
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const checkAssignmentAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignment = req.assignment;
    const currentDate = new Date();
    
    if (!assignment) {
      return next(new ErrorHandler('Assignment not found', 404));
    }
    
    // Check if the current date is within the assignment's availability period
    if (currentDate < assignment.startDate) {
      return next(new ErrorHandler('This assignment is not yet available', 403));
    }
    
    if (currentDate > assignment.endDate) {
      return next(new ErrorHandler('This assignment has expired', 403));
    }
    
    next();
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const validateAssignmentInput = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, questions, timeLimit, startDate, endDate } = req.body;

  // Basic validation
  if (!title || !description || !questions || !timeLimit || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  // Validate date format and logic
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (start < now && req.method === 'POST') {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past for new assignments'
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format'
    });
  }

  next();
};

export const errorMiddleware = (err: ErrorHandler | Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ErrorHandler ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const validateQuizSubmission = (req: Request, res: Response, next: NextFunction) => {
  const { userId, answers, startTime } = req.body;
  const assignmentId = req.params.id;
  
  if (!userId || !assignmentId || !answers || !startTime) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: userId, assignmentId, answers, or startTime'
    });
  }
  
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(assignmentId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid userId or assignmentId format'
    });
  }
  
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Answers must be a non-empty array'
    });
  }
  
  const isValidAnswers = answers.every(answer => 
    answer.questionId &&
    answer.selectedOption &&
    mongoose.Types.ObjectId.isValid(answer.questionId) &&
    mongoose.Types.ObjectId.isValid(answer.selectedOption)
  );
  
  if (!isValidAnswers) {
    return res.status(400).json({
      success: false,
      message: 'Invalid answer format. Each answer must have valid questionId and selectedOption'
    });
  }
  
  try {
    new Date(startTime);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid startTime format'
    });
  }
  
  next();
};