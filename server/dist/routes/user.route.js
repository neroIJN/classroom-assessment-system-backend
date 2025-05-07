"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const violation_controller_1 = require("../controllers/violation.controller");
const QuizTracking_controller_1 = require("../controllers/QuizTracking.controller");
const violation_middleware_1 = require("../middleware/violation.middleware");
const violationController = new violation_controller_1.ViolationController();
const violationMiddleware = new violation_middleware_1.ViolationMiddleware();
const userRouter = express_1.default.Router();
// User registration
userRouter.post('/registration', user_controller_1.registrationUser);
// User activation
userRouter.post('/activate-user', user_controller_1.activateUser);
// User login
userRouter.post('/login-user', user_controller_1.loginUser);
// User logout
userRouter.get('/logout-user', auth_1.isAuthenticated, user_controller_1.logoutUser);
// Refresh access token
userRouter.get('/refreshtoken', user_controller_1.updateAccessToken);
// Get user info
userRouter.get('/me', auth_1.isAuthenticated, user_controller_1.getUserInfo);
//vilate the user movement
userRouter.post('/violations', violationMiddleware.validateViolationPayload, violationController.logViolation);
//get user by id
userRouter.get('/user/:id', user_controller_1.getUserByIdController);
userRouter.get('/violations/:quizId/student/:studentId', violationController.getViolationsByQuizAndStudent);
userRouter.get('/violations/:quizId/summary', violationController.getQuizViolationsSummary);
userRouter.post('/quiz-session/start', QuizTracking_controller_1.startQuizSessionController);
userRouter.post('/quiz-session/heartbeat', QuizTracking_controller_1.heartbeatController);
userRouter.post('/quiz-session/complete', QuizTracking_controller_1.completeQuizSessionController);
// Get quiz activity stats for a specific quiz
userRouter.get('/stats/:quizId', QuizTracking_controller_1.getQuizStatsController);
// Route for getting live violations in a quiz
userRouter.get('/violations/:quizId/live', violationController.getLiveViolations);
// update whether a student is a repeater or not with repeat batch
userRouter.put('/update-repeater/:id', auth_1.isAuthenticated, user_controller_1.updateUserRepeatBatch);
exports.default = userRouter;
