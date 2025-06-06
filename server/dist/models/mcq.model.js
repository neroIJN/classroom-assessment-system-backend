"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mcqOptionSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: [true, "Option text is required"],
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
});
const mcqQuestionSchema = new mongoose_1.default.Schema({
    questionText: {
        type: String,
        required: [true, "Question text is required"],
    },
    options: {
        type: [mcqOptionSchema],
        validate: {
            validator: function (options) {
                return options.length === 4;
            },
            message: "Each question must have exactly four options",
        },
        required: [true, "Options are required"],
    },
    pointsForQuestion: {
        type: Number,
        default: 1,
    },
});
const assignmentSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: 3,
        maxlength: 100,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: 10,
        maxlength: 1000,
    },
    questions: [mcqQuestionSchema],
    teacherId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timeLimit: {
        type: Number,
        required: [true, "Time limit is required"],
        min: 1,
        max: 180, // Maximum 3 hours
    },
    guidelines: {
        type: [String],
        default: ["Guideline 1", "Guideline 2", "Guideline 3", "Guideline 4"],
        validate: {
            validator: function (guidelines) {
                return guidelines.length === 4;
            },
            message: "Each question must have exactly four guidelines",
        },
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    intendedBatch: {
        type: Number,
        required: [true, "Intended batch is required"],
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
    },
}, { timestamps: true });
const AssignmentModel = mongoose_1.default.model("Assignment", assignmentSchema);
exports.default = AssignmentModel;
// Example of a Postman request body for creating an assignment
// const exampleRequestBody = {
//   title: "Basic Quiz",
//   description: "Test your basic skills",
//   timeLimit: 10,
//   questions: [
//     {
//       questionText: "What is 2 + 2?",
//       options: [
//         { text: "3", isCorrect: false },
//         { text: "4", isCorrect: true },
//         { text: "5", isCorrect: false },
//         { text: "6", isCorrect: false }
//       ]
//     }
//   ],
//   guidelines: ["Guideline 1", "Guideline 2", "Guideline 3", "Guideline 4"],
//   password: "Test",
//   teacherId: "66f7bd8a6a41a029fdb5b47b",
//   startDate: "2025-04-01T08:00:00.000Z",
//   endDate: "2025-04-10T18:00:00.000Z"
// };
