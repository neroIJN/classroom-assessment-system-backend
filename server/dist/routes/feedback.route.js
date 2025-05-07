"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedback_controller_1 = require("../controllers/feedback.controller");
const auth_1 = require("../middleware/auth");
const feedbackRouter = express_1.default.Router();
// Add a new feedback
feedbackRouter.post('/feedback/create', auth_1.isAuthenticated, feedback_controller_1.createFeedbackController);
// Get feedback by id
feedbackRouter.get('/feedback/:id', feedback_controller_1.getFeedbackByIdController);
// Get feedbacks by assignment id
feedbackRouter.get('/feedbacks/:assignmentId', feedback_controller_1.getFeedbackByAssignmentIdController);
exports.default = feedbackRouter;
