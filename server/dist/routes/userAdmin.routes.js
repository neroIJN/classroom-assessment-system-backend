"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resultGenerator_controller_1 = require("./../controllers/resultGenerator.controller");
const express_1 = __importDefault(require("express"));
const assignment_controller_1 = require("../controllers/assignment.controller");
const userAdmin_controller_1 = require("../controllers/userAdmin.controller");
const auth_1 = require("../middleware/auth");
const auth_controller_1 = require("../controllers/auth.controller");
const userAdminRouter = express_1.default.Router();
// Admin-specific user management routes
userAdminRouter.post('/AdminRegistration', userAdmin_controller_1.registrationUser);
userAdminRouter.post('/activate-AdminUser', userAdmin_controller_1.activateUser);
userAdminRouter.post('/login-AdminUser', userAdmin_controller_1.loginUser);
userAdminRouter.get('/logout-AdminUser', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), userAdmin_controller_1.logoutUser);
userAdminRouter.get('/refreshAdminToken', userAdmin_controller_1.updateAccessToken);
userAdminRouter.get('/meAdmin', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), userAdmin_controller_1.getAdminInfo);
// Assignment management routes
userAdminRouter.post('/create-assignment', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.createAssignmentController);
userAdminRouter.get('/assignments/:id', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.getAssignmentByIdController);
userAdminRouter.put('/assignments/:id', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.updateAssignmentController);
userAdminRouter.delete('/assignments/:id', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.deleteAssignmentController);
userAdminRouter.get('/assignments/teacher/:teacherId', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.getAllAssignmentsController);
// Quiz-related routes
userAdminRouter.post('/quiz/:id/start', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.startQuizController);
userAdminRouter.post('/quiz/:id/submit', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.submitQuizController);
userAdminRouter.get('/quiz/submission/:submissionId', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.getQuizSubmissionController);
userAdminRouter.get('/quiz/user/:userId/submissions', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.getQuizSubmissionsByUserController);
userAdminRouter.get('/quiz/assignment/:id/submissions', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.getQuizSubmissionsByAssignmentController);
userAdminRouter.post('/quiz/:id/calculate-score', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), assignment_controller_1.calculateScoreController);
// Result generation routes
userAdminRouter.get('/download-excel', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), resultGenerator_controller_1.downloadExcelSheet);
userAdminRouter.get('/download-full-excel', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), resultGenerator_controller_1.downloadFullExcelSheet);
// User management routes
// update profile
userAdminRouter.put('/update-profile', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), userAdmin_controller_1.updateUserAdminProfileController);
//update password
userAdminRouter.put('/update-password', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('admin'), userAdmin_controller_1.updateUserPasswordController);
// Password reset routes
userAdminRouter.post('/forgot-password', auth_controller_1.forgotPassword);
userAdminRouter.get('/verify-reset-token', auth_controller_1.verifyResetToken);
userAdminRouter.post('/reset-password', auth_controller_1.resetPassword);
// Refresh access token
exports.default = userAdminRouter;
