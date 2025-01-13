import { Request, Response, NextFunction } from 'express';
import { createFeedback, getFeedbackByAssignmentId, getFeedbackById } from "../services/feedback.service";

export const createFeedbackController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const feedback = await createFeedback(req.body);
        res.status(201).json({
            success: true,
            feedback,
        });
    } catch (error) {
        next(error);
    }
};

// Get a feedback by ID
 export const getFeedbackByIdController = async (req: Request, res: Response, next: NextFunction) => {
    const feedback = await getFeedbackById(req.params.id);
    res.status(200).json({
        success: true,
        feedback,
    });
};

// get feedbacks for assignment id
export const getFeedbackByAssignmentIdController = async (req: Request, res: Response, next: NextFunction) => {
    const feedback = await getFeedbackByAssignmentId(req.params.assignmentId);
    res.status(200).json({
        success: true,
        feedback,
    });
};