import express from 'express';
import { createFeedbackController, getFeedbackByAssignmentIdController, getFeedbackByIdController } from '../controllers/feedback.controller';
import { isAuthenticated } from '../middleware/auth';

const feedbackRouter = express.Router();

// Add a new feedback
feedbackRouter.post('/feedback/create', isAuthenticated, createFeedbackController);

// Get feedback by id
feedbackRouter.get('/feedback/:id', getFeedbackByIdController);

// Get feedbacks by assignment id
feedbackRouter.get('/feedbacks/:assignmentId', getFeedbackByAssignmentIdController);

export default feedbackRouter;