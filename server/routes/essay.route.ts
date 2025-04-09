import express from 'express';
import {
  createEssayAssignmentController,
  getEssayAssignmentByIdController,
  updateEssayAssignmentController,
  deleteEssayAssignmentController,
  getAllEssayAssignmentsController,
  startEssayAssignmentController,
  submitEssayAssignmentController,
  getEssaySubmissionController,
  getEssaySubmissionsByUserController,
  getEssaySubmissionsByAssignmentController,
  getActiveEssayAssignmentsController,
  getUpcomingEssayAssignmentsController,
  getPastEssayAssignmentsController,
  getEssayResultsController,
  getEssayViolationSummaryController,
  getStudentEssayViolationsController,
  getStudentEssayResultController
} from '../controllers/essay.controller';
import { checkEssayAssignmentExists } from '../middleware/essay.middleware';
import { isAuthenticated } from '../middleware/auth';

const essayRouter = express.Router();

// Create a new essay assignment
essayRouter.post('/essay/create', isAuthenticated, createEssayAssignmentController);

// Get an essay assignment by ID
essayRouter.get('/essay/:id', checkEssayAssignmentExists, getEssayAssignmentByIdController);

// Update an essay assignment by ID
essayRouter.put('/essay/update/:id', checkEssayAssignmentExists, updateEssayAssignmentController);

// Delete an essay assignment by ID
essayRouter.delete('/essay/:id', checkEssayAssignmentExists, deleteEssayAssignmentController);

// Get all essay assignments for a teacher
essayRouter.get('/essay/teacher/:teacherId', getAllEssayAssignmentsController);

// Get active, upcoming, and past essay assignments
essayRouter.get('/essay/active/:teacherId', getActiveEssayAssignmentsController);
essayRouter.get('/essay/upcoming/:teacherId', getUpcomingEssayAssignmentsController);
essayRouter.get('/essay/past/:teacherId', getPastEssayAssignmentsController);

// Start a essay assignment
essayRouter.post('/essay/:id/start', startEssayAssignmentController);

// Submit a essay assignment (two different routes for the same functionality)
essayRouter.post('/essay/:id/submit', submitEssayAssignmentController);
essayRouter.post('/essay-submission', submitEssayAssignmentController); // New alternative route

// Get essay results routes
essayRouter.get('/essay/:id/results', getEssayResultsController);
essayRouter.get('/essay/:id/violations', getEssayViolationSummaryController);
essayRouter.get('/essay/:id/student/:sid/violations', getStudentEssayViolationsController);
essayRouter.get('/essay/:id/student/:sid/results', getStudentEssayResultController);

// Get a specific essay submission
essayRouter.get('/essay/submission/:submissionId', getEssaySubmissionController);

// Get all essay submissions for a user
essayRouter.get('/essay/submissions/user/:userId', getEssaySubmissionsByUserController);

// Get all essay submissions for an assignment
essayRouter.get('/essay/:id/submissions', getEssaySubmissionsByAssignmentController);

export default essayRouter;