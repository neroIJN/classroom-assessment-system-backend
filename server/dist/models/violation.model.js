"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViolationModel = void 0;
// src/models/violation.model.ts
const mongoose_1 = require("mongoose");
const violationSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quizId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    violation: {
        type: {
            type: String,
            required: true,
            enum: ['Tab Switch', 'Window Switch', 'Mouse Exit', 'Keyboard Shortcut', 'Right Click', 'Fullscreen Exit']
        },
        timestamp: {
            type: Date,
            required: true
        },
        count: Number,
        key: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.ViolationModel = (0, mongoose_1.model)('Violation', violationSchema);
