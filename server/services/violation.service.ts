// src/services/violation.service.ts
import { ViolationModel } from '../models/violation.model';
import { ICreateViolationDto, IViolation } from '../utils/violation.types';
import { Types } from 'mongoose';

export class ViolationService {
  async createViolation(violationDto: ICreateViolationDto): Promise<IViolation> {
    try {
      const violation = new ViolationModel({
        studentId: new Types.ObjectId(violationDto.studentId),
        quizId: new Types.ObjectId(violationDto.quizId),
        violation: {
          ...violationDto.violation,
          timestamp: new Date(violationDto.violation.timestamp)
        }
      });

      return await violation.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create violation: ${error.message}`);
      }
      throw error;
    }
  }

  async getViolationsByQuiz(quizId: string): Promise<IViolation[]> {
    try {
      return await ViolationModel.find({ quizId: new Types.ObjectId(quizId) });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch violations: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      throw error;
    }
  }
  async getViolationsByQuizAndStudent(quizId: string, studentId: string) {
    try {
      return await ViolationModel.find({
        quizId: new Types.ObjectId(quizId),
        studentId: new Types.ObjectId(studentId)
      }).sort({ 'violation.timestamp': 1 });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch violations: ${error.message}`);
      }
      throw error;
    }
  }

  async getQuizViolationsSummary(quizId: string) {
    try {
      // Aggregate violations by student
      const summary = await ViolationModel.aggregate([
        {
          $match: {
            quizId: new Types.ObjectId(quizId)
          }
        },
        {
          $group: {
            _id: '$studentId',
            totalViolations: { $sum: 1 },
            violationTypes: {
              $push: '$violation.type'
            }
          }
        },
        {
          $lookup: {
            from: 'users',  // Assuming your user collection name
            localField: '_id',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $project: {
            studentName: '$student.name',
            totalViolations: 1,
            violationTypes: 1
          }
        }
      ]);

      return summary;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch violations summary: ${error.message}`);
      }
      throw error;
    }
  }


  async getLiveViolations(quizId: string, timeWindow: number = 30): Promise<IViolation[]> {
    try {
      // Get violations from the last 'timeWindow' minutes (default 30 minutes)
      const cutoffTime = new Date(Date.now() - timeWindow * 60 * 1000);
      
      return await ViolationModel.find({
        quizId,
        'violation.timestamp': { $gte: cutoffTime }
      })
      .populate('studentId', 'name email registrationNumber')
      .sort({ 'violation.timestamp': -1 });
    } catch (error) {
      throw new Error(`Failed to fetch live violations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

