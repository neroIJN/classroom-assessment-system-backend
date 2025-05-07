"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedbackByAssignmentIdController = exports.getFeedbackByIdController = exports.createFeedbackController = void 0;
const feedback_service_1 = require("../services/feedback.service");
const createFeedbackController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedback = yield (0, feedback_service_1.createFeedback)(req.body);
        res.status(201).json({
            success: true,
            feedback,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createFeedbackController = createFeedbackController;
// Get a feedback by ID
const getFeedbackByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const feedback = yield (0, feedback_service_1.getFeedbackById)(req.params.id);
    res.status(200).json({
        success: true,
        feedback,
    });
});
exports.getFeedbackByIdController = getFeedbackByIdController;
// get feedbacks for assignment id
const getFeedbackByAssignmentIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const feedback = yield (0, feedback_service_1.getFeedbackByAssignmentId)(req.params.assignmentId);
    res.status(200).json({
        success: true,
        feedback,
    });
});
exports.getFeedbackByAssignmentIdController = getFeedbackByAssignmentIdController;
