import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { downloadExcelSheet, downloadFullExcelSheet, getResultsController, getStudentQuizResultsController } from "../controllers/resultGenerator.controller";

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
export default resultRouter;