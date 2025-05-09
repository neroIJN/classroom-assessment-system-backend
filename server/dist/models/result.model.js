"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const resultSchema = new mongoose_1.default.Schema({
    registrationNumber: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    timeTaken: {
        type: Number,
        required: true,
    },
}, {
    timestamps: false,
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});
const ResultModel = mongoose_1.default.model("Result", resultSchema);
exports.default = ResultModel;
