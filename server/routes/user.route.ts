import express from 'express';
import {
  activateUser,
  getUserByIdController,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  updateAccessToken,
  updateUserRepeatBatch,
} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
import { ViolationController } from '../controllers/violation.controller';
import { startQuizSessionController, heartbeatController, completeQuizSessionController, getQuizStatsController } from '../controllers/QuizTracking.controller';
import { ViolationMiddleware } from '../middleware/violation.middleware';
import { createFeedbackController, getFeedbackByAssignmentIdController, getFeedbackByIdController } from '../controllers/feedback.controller';
const violationController = new ViolationController();
const violationMiddleware = new ViolationMiddleware();
const userRouter = express.Router();

// User registration
userRouter.post('/registration', registrationUser);

// User activation
userRouter.post('/activate-user', activateUser);

// User login
userRouter.post('/login-user', loginUser);

// User logout
userRouter.get('/logout-user', isAuthenticated, logoutUser);

// Refresh access token
userRouter.get('/refreshtoken', updateAccessToken);

// Get user info
userRouter.get('/me', isAuthenticated, getUserInfo);
//vilate the user movement
userRouter.post('/violations', violationMiddleware.validateViolationPayload,
  violationController.logViolation);
//get user by id
userRouter.get('/user/:id', getUserByIdController);

userRouter.get(
  '/violations/:quizId/student/:studentId',
  violationController.getViolationsByQuizAndStudent
);

userRouter.get(
  '/violations/:quizId/summary',
  violationController.getQuizViolationsSummary
);

userRouter.post('/quiz-session/start',
  startQuizSessionController);

userRouter.post('/quiz-session/heartbeat', 
  heartbeatController);

userRouter.post('/quiz-session/complete', 
  completeQuizSessionController);
// Get quiz activity stats for a specific quiz
userRouter.get('/stats/:quizId', getQuizStatsController);
// Route for getting live violations in a quiz
userRouter.get(
  '/violations/:quizId/live',
  violationController.getLiveViolations
);

// update whether a student is a repeater or not with repeat batch
userRouter.put(
  '/update-repeater/:id', isAuthenticated, updateUserRepeatBatch);

// Add a new feedback
userRouter.post('/feedback/create', isAuthenticated, createFeedbackController);

// Get feedback by id
userRouter.get('/feedback/:id', getFeedbackByIdController);

// Get feedbacks by assignment id
userRouter.get('/feedbacks/:assignmentId', getFeedbackByAssignmentIdController);

export default userRouter;


