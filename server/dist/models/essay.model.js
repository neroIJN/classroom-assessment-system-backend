"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema for essays
const essaysSchema = new mongoose_1.Schema({
    questionText: {
        type: String,
        required: [true, "Question text is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    },
});
const essayAssignmentSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Assignment title is required"],
        minlength: 3,
        maxlength: 100,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: 10,
        maxlength: 500,
    },
    questions: [essaysSchema],
    guidelines: {
        type: [String],
        default: ["Guideline 1", "Guideline 2", "Guideline 3", "Guideline 4"],
        validate: {
            validator: function (guidelines) {
                return guidelines.length === 4;
            },
            message: "Each assignment must have exactly four guidelines",
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
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
    },
}, { timestamps: true });
const EssayAssignmentModel = mongoose_1.default.model("EssayAssignment", essayAssignmentSchema);
exports.default = EssayAssignmentModel;
