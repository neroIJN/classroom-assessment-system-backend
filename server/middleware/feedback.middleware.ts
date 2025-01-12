import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ErrorHandler } from "../utils/ErrorHandler";
import FeedbackModel from "../models/feedback.model";

export const checkFeedbackExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler('Invalid feedback ID', 400));
        }

        const feedback = await FeedbackModel.findById(id);

        if (!feedback) {
            return next(new ErrorHandler('Feedback not found', 404));
        }

        // req.feedback = feedback;
        next();
    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
};

export const errorMiddleware = (err: ErrorHandler | Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof ErrorHandler ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
    });
};