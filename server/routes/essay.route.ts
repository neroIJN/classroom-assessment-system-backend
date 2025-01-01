import express from 'express';
import {
  createEssayAssignmentController,
  getEssayAssignmentByIdController,
  updateEssayAssignmentController,
  deleteEssayAssignmentController,
  getAllEssayAssignmentsController,
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

export default essayRouter;