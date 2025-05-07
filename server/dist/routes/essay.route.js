"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const essay_controller_1 = require("../controllers/essay.controller");
const essay_middleware_1 = require("../middleware/essay.middleware");
const auth_1 = require("../middleware/auth");
const essayRouter = express_1.default.Router();
// Create a new essay assignment
essayRouter.post('/essay/create', auth_1.isAuthenticated, essay_controller_1.createEssayAssignmentController);
// Get an essay assignment by ID
essayRouter.get('/essay/:id', essay_middleware_1.checkEssayAssignmentExists, essay_controller_1.getEssayAssignmentByIdController);
// Update an essay assignment by ID
essayRouter.put('/essay/update/:id', essay_middleware_1.checkEssayAssignmentExists, essay_controller_1.updateEssayAssignmentController);
// Delete an essay assignment by ID
essayRouter.delete('/essay/:id', essay_middleware_1.checkEssayAssignmentExists, essay_controller_1.deleteEssayAssignmentController);
// Get all essay assignments for a teacher
essayRouter.get('/essay/teacher/:teacherId', essay_controller_1.getAllEssayAssignmentsController);
// Get active, upcoming, and past essay assignments
essayRouter.get('/essay/active/:teacherId', essay_controller_1.getActiveEssayAssignmentsController);
essayRouter.get('/essay/upcoming/:teacherId', essay_controller_1.getUpcomingEssayAssignmentsController);
essayRouter.get('/essay/past/:teacherId', essay_controller_1.getPastEssayAssignmentsController);
// Start a essay assignment
essayRouter.post('/essay/:id/start', essay_controller_1.startEssayAssignmentController);
// Submit a essay assignment (two different routes for the same functionality)
essayRouter.post('/essay/:id/submit', essay_controller_1.submitEssayAssignmentController);
essayRouter.post('/essay-submission', essay_controller_1.submitEssayAssignmentController); // New alternative route
// Get essay results routes
essayRouter.get('/essay/:id/results', essay_controller_1.getEssayResultsController);
essayRouter.get('/essay/:id/violations', essay_controller_1.getEssayViolationSummaryController);
essayRouter.get('/essay/:id/student/:sid/violations', essay_controller_1.getStudentEssayViolationsController);
essayRouter.get('/essay/:id/student/:sid/results', essay_controller_1.getStudentEssayResultController);
// Get a specific essay submission
essayRouter.get('/essay/submission/:submissionId', essay_controller_1.getEssaySubmissionController);
// Get all essay submissions for a user
essayRouter.get('/essay/submissions/user/:userId', essay_controller_1.getEssaySubmissionsByUserController);
// Get all essay submissions for an assignment
essayRouter.get('/essay/:id/submissions', essay_controller_1.getEssaySubmissionsByAssignmentController);
exports.default = essayRouter;
