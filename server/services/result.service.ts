import ResultModel, { IResult } from "../models/result.model";

/**
 * Get results by assignment ID
 * @param assignmentId - Assignment ID
 * @returns A list of results
 */
export const getResultsByAssignmentId = async (assignmentId: string): Promise<IResult[]> => {
  return await ResultModel.find({ assignmentId }).select("registrationNumber score timeTaken submittedAt").exec();
};