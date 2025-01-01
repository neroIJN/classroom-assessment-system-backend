import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import EssayAssignmentModel from "../models/essay.model"; // Adjust the path to match your folder structure
import ErrorHandler from "../utils/ErrorHandler";

// Middleware to check if an essay assignment exists by ID
export const checkEssayAssignmentExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler("Invalid essay assignment ID", 400));
        }
        
        // Find the essay assignment by ID
        const essayAssignment = await EssayAssignmentModel.findById(id);
        
        if (!essayAssignment) {
            return next(new ErrorHandler("Essay assignment not found", 404));
        }
        
        // Attach the essay assignment to the request object for further use
        (req as any).essayAssignment = essayAssignment;
        next();
    } catch (error: any) {
        next(new ErrorHandler(error.message || "Error checking essay assignment existence", 500));
    }
};

// Global error-handling middleware
export const errorMiddleware = (
    err: ErrorHandler | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err instanceof ErrorHandler? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message
    });
};