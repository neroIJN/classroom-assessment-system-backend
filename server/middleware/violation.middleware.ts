// src/middleware/violation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ViolationType } from '../utils/violation.types';

export class ViolationMiddleware {
  validateViolationPayload = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { studentId, quizId, violation } = req.body;

      if (!studentId || !quizId || !violation) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
        return;
      }

      const validViolationTypes: ViolationType[] = [
        'Tab Switch',
        'Window Switch',
        'Mouse Exit',
        'Keyboard Shortcut',
        'Right Click',
        'Fullscreen Exit'
      ];

      if (!validViolationTypes.includes(violation.type)) {
        res.status(400).json({
          success: false,
          message: 'Invalid violation type'
        });
        return;
      }

      if (!violation.timestamp || isNaN(Date.parse(violation.timestamp))) {
        res.status(400).json({
          success: false,
          message: 'Invalid timestamp'
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Middleware validation error',
        error: (error as Error).message
      });
    }
  };
}