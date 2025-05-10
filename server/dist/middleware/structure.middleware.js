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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.checkStructureExists = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const structure_model_1 = __importDefault(require("../models/structure.model")); // Adjust the path to match your folder structure
const ErrorHandler_1 = require("../utils/ErrorHandler");
// Middleware to check if a structure exists by ID
const checkStructureExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate the ID format
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid structure ID", 400));
        }
        // Find the structure by ID
        const structure = yield structure_model_1.default.findById(id);
        if (!structure) {
            return next(new ErrorHandler_1.ErrorHandler("Structure not found", 404));
        }
        // Attach the structure to the request object for further use
        req.structure = structure;
        next();
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler(error.message || "Error checking structure existence", 500));
    }
});
exports.checkStructureExists = checkStructureExists;
// Global error-handling middleware
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err instanceof ErrorHandler_1.ErrorHandler ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorMiddleware = errorMiddleware;
