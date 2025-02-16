import express from 'express';
import {
  createAssignmentController,
  getAssignmentByIdController,
  updateAssignmentController,
  deleteAssignmentController,
  getAllAssignmentsController,
  startQuizController,
  submitQuizController,
  getQuizSubmissionController,
  getQuizSubmissionsByUserController,
  getQuizSubmissionsByAssignmentController,
} from '../controllers/assignment.controller';
import { checkAssignmentExists } from '../middleware/assignment.middleware';
import { isAuthenticated,authorizeRoles } from '../middleware/auth';
import { validateQuizSubmission } from '../middleware/assignment.middleware';
const router = express.Router();

// Create a new assignment


// Get an assignment by ID
router.get('/:id', checkAssignmentExists, getAssignmentByIdController);

// Update an assignment by ID
router.put('/:id', checkAssignmentExists, updateAssignmentController);

// Delete an assignment by ID
router.delete('/:id', checkAssignmentExists, deleteAssignmentController);

// Get all assignments for a teacher
router.get('/teacher/:teacherId', getAllAssignmentsController);

// Start a quiz
router.post('/:id/start', startQuizController);

// Submit a quiz
router.post('/:id/submit',validateQuizSubmission, submitQuizController);

// Get a specific quiz submission
router.get('/submission/:submissionId', getQuizSubmissionController);

// Get all quiz submissions for a user
router.get('/submissions/user/:userId', getQuizSubmissionsByUserController);

// Get all quiz submissions for an assignment
router.get('/:id/submissions', getQuizSubmissionsByAssignmentController);

export default router;
