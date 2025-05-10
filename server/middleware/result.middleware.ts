import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the 'result' property
declare global {
  namespace Express {
    interface Request {
      result?: any;
    }
  }
}
import mongoose from "mongoose";
import ResultModel from "../models/result.model";
import { ErrorHandler } from "../utils/ErrorHandler";

export const checkResultExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid result ID", 400));
    }

    const result = await ResultModel.findById(id);

    if (!result) {
      return next(new ErrorHandler("Result not found", 404));
    }

    req.result = result;
    next();
  } catch (error: any) {
    next(new ErrorHandler(error.message, 500));
  }
};