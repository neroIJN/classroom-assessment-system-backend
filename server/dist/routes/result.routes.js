"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const resultGenerator_controller_1 = require("../controllers/resultGenerator.controller");
const essay_controller_1 = require("../controllers/essay.controller");
const resultRouter = express_1.default.Router();
resultRouter.get("/downloadExcel/:assignmentId", auth_1.isAuthenticated, resultGenerator_controller_1.downloadExcelSheet);
resultRouter.get("/downloadFullExcel/:assignmentId", auth_1.isAuthenticated, resultGenerator_controller_1.downloadFullExcelSheet);
resultRouter.get("/results/:assignmentId", auth_1.isAuthenticated, resultGenerator_controller_1.getResultsController);
resultRouter.get('/viewResult/:assignmentId/student/:userId', auth_1.isAuthenticated, resultGenerator_controller_1.getStudentQuizResultsController);
// Essay results endpoints
resultRouter.get("/essay/results/:assignmentId", auth_1.isAuthenticated, essay_controller_1.getEssayResultsController);
resultRouter.get("/essay/violations/:assignmentId/summary", auth_1.isAuthenticated, essay_controller_1.getEssayViolationSummaryController);
resultRouter.get("/essay/violations/:assignmentId/student/:userId", auth_1.isAuthenticated, essay_controller_1.getStudentEssayViolationsController);
resultRouter.get("/essay/viewResult/:id/student/:sid", auth_1.isAuthenticated, essay_controller_1.getStudentEssayResultController);
exports.default = resultRouter;
