import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { downloadExcelSheet, downloadFullExcelSheet } from "../controllers/resultGenerator.controller";

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


export default resultRouter;