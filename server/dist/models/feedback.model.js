"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const feedbackSchema = new mongoose_1.default.Schema({
    assignmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        },
    }
});
const FeedbackModel = mongoose_1.default.model("Feedback", feedbackSchema);
exports.default = FeedbackModel;
