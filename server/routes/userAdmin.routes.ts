import { downloadExcelSheet, downloadFullExcelSheet } from './../controllers/resultGenerator.controller';
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
  calculateScoreController,
} from '../controllers/assignment.controller';
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  updateAccessToken,
} from '../controllers/userAdmin.controller';
import { isAuthenticated, authorizeRoles } from '../middleware/auth';

const userAdminRouter = express.Router();

// Admin-specific user management routes
userAdminRouter.post('/AdminRegistration', registrationUser);
userAdminRouter.post('/activate-AdminUser', activateUser);
userAdminRouter.post('/login-AdminUser', loginUser);
userAdminRouter.get('/logout-AdminUser', isAuthenticated, logoutUser);
userAdminRouter.get('/refreshAdminToken', updateAccessToken);
userAdminRouter.get('/meAdmin', isAuthenticated, getUserInfo);

// Assignment management routes
userAdminRouter.post(
  '/create-assignment',
  isAuthenticated,
  authorizeRoles('admin'), // Restrict to admin role
  createAssignmentController
);
userAdminRouter.get(
  '/assignments/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  getAssignmentByIdController
);
userAdminRouter.put(
  '/assignments/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  updateAssignmentController
);
userAdminRouter.delete(
  '/assignments/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteAssignmentController
);
userAdminRouter.get(
  '/assignments/teacher/:teacherId',
  isAuthenticated,
  authorizeRoles('admin'),
  getAllAssignmentsController
);

// Quiz-related routes
userAdminRouter.post(
  '/quiz/:id/start',
  isAuthenticated,
  authorizeRoles('admin'),
  startQuizController
);
userAdminRouter.post(
  '/quiz/:id/submit',
  isAuthenticated,
  submitQuizController
);
userAdminRouter.get(
  '/quiz/submission/:submissionId',
  isAuthenticated,
  authorizeRoles('admin'),
  getQuizSubmissionController
);
userAdminRouter.get(
  '/quiz/user/:userId/submissions',
  isAuthenticated,
  authorizeRoles('admin'),
  getQuizSubmissionsByUserController
);
userAdminRouter.get(
  '/quiz/assignment/:id/submissions',
  isAuthenticated,
  authorizeRoles('admin'),
  getQuizSubmissionsByAssignmentController
);
userAdminRouter.post(
  '/quiz/:id/calculate-score',
  isAuthenticated,
  authorizeRoles('admin'),
  calculateScoreController
);


export default userAdminRouter;
