"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const essaySubmissionSchema = new mongoose_1.default.Schema({
    assignmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'EssayAssignment',
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
                ref: 'EssayQuestion',
                required: true
            },
            modelAnswer: {
                type: String,
                required: true
            },
            studentAnswer: {
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
const EssaySubmissionModel = mongoose_1.default.model('EssaySubmission', essaySubmissionSchema);
exports.default = EssaySubmissionModel;
