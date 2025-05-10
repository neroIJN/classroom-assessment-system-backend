"use strict";
// 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/quizSubmission.model.ts
const mongoose_1 = __importDefault(require("mongoose"));
const quizSubmissionSchema = new mongoose_1.default.Schema({
    assignmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    answers: [{
            questionId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true
            },
            questionText: {
                type: String,
                required: true
            },
            selectedOption: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true
            },
            selectedOptionText: {
                type: String,
                required: true
            }
        }],
    score: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});
const QuizSubmissionModel = mongoose_1.default.model('QuizSubmission', quizSubmissionSchema);
exports.default = QuizSubmissionModel;
