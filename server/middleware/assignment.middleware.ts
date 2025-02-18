import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import AssignmentModel from '../models/mcq.model';
import {ErrorHandler} from "../utils/ErrorHandler";

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