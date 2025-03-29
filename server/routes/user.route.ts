import express from 'express';
import {
  activateUser,
  getUserByIdController,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  updateAccessToken,
} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
import { ViolationController } from '../controllers/violation.controller';
import { ViolationMiddleware } from '../middleware/violation.middleware';
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
export default userRouter;
