import express from 'express';
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  updateAccessToken,
} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';

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

export default userRouter;
