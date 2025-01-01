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