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
exports.checkResultExists = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const result_model_1 = __importDefault(require("../models/result.model"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const checkResultExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid result ID", 400));
        }
        const result = yield result_model_1.default.findById(id);
        if (!result) {
            return next(new ErrorHandler_1.ErrorHandler("Result not found", 404));
        }
        req.result = result;
        next();
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler(error.message, 500));
    }
});
exports.checkResultExists = checkResultExists;
