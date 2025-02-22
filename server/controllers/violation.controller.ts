// src/controllers/violation.controller.ts
import { Request, Response } from 'express';
import { ViolationService } from '../services/violation.service';
import { ICreateViolationDto } from '../utils/violation.types';

export class ViolationController {
  private violationService: ViolationService;

  constructor() {
    this.violationService = new ViolationService();
  }

  logViolation = async (req: Request, res: Response): Promise<void> => {
    try {
      const violationDto: ICreateViolationDto = req.body;
      const violation = await this.violationService.createViolation(violationDto);

      res.status(201).json({
        success: true,
        message: 'Violation logged successfully',
        violation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to log violation',
        error: (error instanceof Error) ? error.message : 'Unknown error'
      });
    }
  };
  getViolationsByQuizAndStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quizId, studentId } = req.params;
      
      const violations = await this.violationService.getViolationsByQuizAndStudent(quizId, studentId);

      res.status(200).json({
        success: true,
        violations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch violations',
        error: (error instanceof Error) ? error.message : 'Unknown error'
      });
    }
  };

  // Add this method to get summary for all students in a quiz
  getQuizViolationsSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quizId } = req.params;
      
      const summary = await this.violationService.getQuizViolationsSummary(quizId);

      res.status(200).json({
        success: true,
        summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch violations summary',
        error: (error instanceof Error) ? error.message : 'Unknown error'
      });
    }
  };
}