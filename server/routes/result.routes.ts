import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { downloadExcelSheet, downloadFullExcelSheet, getResultsController, getStudentQuizResultsController } from "../controllers/resultGenerator.controller";
import { getEssayResultsController, getEssayViolationSummaryController, getStudentEssayResultController, getStudentEssayViolationsController } from "../controllers/essay.controller";

const resultRouter = express.Router();

resultRouter.get(
  "/downloadExcel/:assignmentId",
  isAuthenticated,
  downloadExcelSheet
);

resultRouter.get(
  "/downloadFullExcel/:assignmentId",
  isAuthenticated,
  downloadFullExcelSheet
);
resultRouter.get(
  "/results/:assignmentId",
  isAuthenticated,
  getResultsController
);
resultRouter.get('/viewResult/:assignmentId/student/:userId', 
  isAuthenticated,
  getStudentQuizResultsController);

// Essay results endpoints
resultRouter.get(
  "/essay/results/:assignmentId",
  isAuthenticated,
  getEssayResultsController
);

resultRouter.get(
  "/essay/violations/:assignmentId/summary",
  isAuthenticated,
  getEssayViolationSummaryController
);

resultRouter.get(
  "/essay/violations/:assignmentId/student/:userId",
  isAuthenticated,
  getStudentEssayViolationsController
);
resultRouter.get(
  "/essay/viewResult/:id/student/:sid",
  isAuthenticated,
  getStudentEssayResultController
);
export default resultRouter;