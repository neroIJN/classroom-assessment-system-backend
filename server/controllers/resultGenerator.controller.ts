require("dotenv").config();
import xlsx from 'xlsx';
import { Request, Response, NextFunction } from "express";

import { ErrorHandler } from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import QuizSubmissionModel from '../models/QuizSubmissionModel';



export const generateExcelSheet = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await QuizSubmissionModel.find({}).then(result => {
                if(result.length > 0){
                    let response = JSON.parse(JSON.stringify(result));
                    let workbook = xlsx.utils.book_new();
                    let worksheet = xlsx.utils.json_to_sheet(response);
                    xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
                    xlsx.writeFile(workbook, 'resultSheet.xlsx');
                    res.status(200).json({success: true, message: "Excel file generated successfully", response})
                }else{
                    return next(new ErrorHandler("NO data to found to export", 400));
                }
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);




export const downloadExcelSheet = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const assignmentId = req.params.assignmentId; // Assuming you have an assignmentId in the URL parameters
            const results = await QuizSubmissionModel.find({ assignmentId: assignmentId }); // Query based on assignmentId
            
            if (results.length > 0) {
                const response = JSON.parse(JSON.stringify(results));
                const workbook = xlsx.utils.book_new();
                const worksheet = xlsx.utils.json_to_sheet(response);
                xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');
                
                // Create a buffer for the Excel file
                const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

                // Set headers for file download
                res.setHeader('Content-Disposition', 'attachment; filename=resultSheet.xlsx');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');


                // Send the Excel file as a response
                res.send(excelBuffer);
            } else {
                return next(new ErrorHandler("No data found to export", 400));
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);
