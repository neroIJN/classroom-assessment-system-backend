"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assignment_controller_1 = require("../controllers/assignment.controller");
const assignment_middleware_1 = require("../middleware/assignment.middleware");
const assignment_middleware_2 = require("../middleware/assignment.middleware");
const router = express_1.default.Router();
// Create a new assignment
// Get an assignment by ID
router.get('/:id', assignment_middleware_1.checkAssignmentExists, assignment_controller_1.getAssignmentByIdController);
// Update an assignment by ID
router.put('/:id', assignment_middleware_1.checkAssignmentExists, assignment_controller_1.updateAssignmentController);
// Delete an assignment by ID
router.delete('/:id', assignment_middleware_1.checkAssignmentExists, assignment_controller_1.deleteAssignmentController);
// Get all assignments for a teacher
router.get('/teacher/:teacherId', assignment_controller_1.getAllAssignmentsController);
// Start a quiz
router.post('/:id/start', assignment_controller_1.startQuizController);
// Submit a quiz
router.post('/:id/submit', assignment_middleware_2.validateQuizSubmission, assignment_controller_1.submitQuizController);
// Get a specific quiz submission
router.get('/submission/:submissionId', assignment_controller_1.getQuizSubmissionController);
// Get all quiz submissions for a user
router.get('/submissions/user/:userId', assignment_controller_1.getQuizSubmissionsByUserController);
// Get all quiz submissions for an assignment
router.get('/:id/submissions', assignment_controller_1.getQuizSubmissionsByAssignmentController);
exports.default = router;
