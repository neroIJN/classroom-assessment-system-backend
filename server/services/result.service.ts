import QuizSubmissionModel from "../models/QuizSubmissionModel";
import ResultModel, { IResult } from "../models/result.model";

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