import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import StructureModel from "../models/structure.model"; // Adjust the path to match your folder structure
import ErrorHandler from "../utils/ErrorHandler";

// Middleware to check if a structure exists by ID
export const checkStructureExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler("Invalid structure ID", 400));
    }

    // Find the structure by ID
    const structure = await StructureModel.findById(id);

    if (!structure) {
      return next(new ErrorHandler("Structure not found", 404));
    }

    // Attach the structure to the request object for further use
    (req as any).structure = structure;
    next();
  } catch (error: any) {
    next(new ErrorHandler(error.message || "Error checking structure existence", 500));
  }
};

// Global error-handling middleware
export const errorMiddleware = (
  err: ErrorHandler | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ErrorHandler ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
