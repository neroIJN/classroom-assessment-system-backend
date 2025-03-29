import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import EssayAssignmentModel from "../models/essay.model";
import { ErrorHandler } from "../utils/ErrorHandler";

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

// Middleware to check if essay assignment is currently available
export const checkEssayAssignmentAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const essayAssignment = (req as any).essayAssignment;
        const currentDate = new Date();
        
        if (!essayAssignment) {
            return next(new ErrorHandler("Essay assignment not found", 404));
        }
        
        // Check if the current date is within the essay assignment's availability period
        if (currentDate < essayAssignment.startDate) {
            return next(new ErrorHandler("This essay assignment is not yet available", 403));
        }
        
        if (currentDate > essayAssignment.endDate) {
            return next(new ErrorHandler("This essay assignment has expired", 403));
        }
        
        next();
    } catch (error: any) {
        next(new ErrorHandler(error.message || "Error checking essay assignment availability", 500));
    }
};

// Middleware to validate essay assignment input
export const validateEssayAssignmentInput = (req: Request, res: Response, next: NextFunction) => {
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
        message
    });
};