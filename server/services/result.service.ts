import QuizSubmissionModel from "../models/QuizSubmissionModel";
import ResultModel, { IResult } from "../models/result.model";
import {ViolationModel} from "../models/violation.model";
import { Types } from "mongoose";
/**
 * Get results by assignment ID
 * @param assignmentId - Assignment ID
 * @returns A list of results
 */
export const getResultsByAssignmentId = async (assignmentId: string): Promise<IResult[]> => {
  return await ResultModel.find({ assignmentId }).select("registrationNumber score timeTaken submittedAt").exec();
};
export const getStudentQuizResults = async (assignmentId: string, userId: string) => {
  try {
    const submission = await QuizSubmissionModel.findOne({
      assignmentId: assignmentId,
      userId: userId,
    }).select('answers score timeTaken submittedAt'); // Only selecting relevant fields

    if (!submission) {
      return null;
    }

    return {
      userId: submission.userId,
      assignmentId: submission.assignmentId,
      answers: submission.answers,
      score: submission.score,
      timeTaken: submission.timeTaken,
      submittedAt: submission.submittedAt,
    };
  } catch (error) {
    throw new Error('Error retrieving quiz results');
  }
};

export const getAssignmentViolationStats = async (assignmentId: string) => {
  try {
    const stats = await ViolationModel.aggregate([
      {
        $match: { quizId: new Types.ObjectId(assignmentId) }
      },
      {
        $group: {
          _id: null,
          totalViolations: { $sum: 1 },
          violationsByType: {
            $push: "$type"
          },
          uniqueStudents: { $addToSet: "$studentId" }
        }
      },
      {
        $project: {
          _id: 0,
          totalViolations: 1,
          uniqueStudentsCount: { $size: "$uniqueStudents" },
          violationsByType: {
            $reduce: {
              input: "$violationsByType",
              initialValue: {},
              in: {
                $mergeObjects: [
                  "$$value",
                  { $literal: { ["$$this"]: 1 } }
                ]
              }
            }
          }
        }
      }
    ]);

    return stats[0] || {
      totalViolations: 0,
      uniqueStudentsCount: 0,
      violationsByType: {}
    };
  } catch (error) {
    throw new Error(`Failed to fetch violation statistics: ${error.message}`);
  }
};
/**
 * Get essay violations for a specific student
 * @param assignmentId - Essay assignment ID
 * @param studentId - Student ID
 * @returns Array of violations for the student
 */
export const getStudentEssayViolations = async (assignmentId: string, studentId: string) => {
  try {
    // Convert string IDs to ObjectIds
    const quizId = new Types.ObjectId(assignmentId);
    const studentObjectId = new Types.ObjectId(studentId);
    
    // Find violations for this student on this assignment
    const violations = await ViolationModel.find({
      quizId: quizId,
      studentId: studentObjectId
    }).sort({ "violation.timestamp": -1 }); // Most recent first
    
    return violations;
  } catch (error) {
    console.error('Error fetching student essay violations:', error);
    throw new Error(`Failed to fetch student violations: ${error.message}`);
  }
};