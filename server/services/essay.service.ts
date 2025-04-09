import mongoose from "mongoose";
import EssayAssignmentModel, {IEssay, IEssayAssignment} from "../models/essay.model";
import EssaySubmissionModel, { IEssaySubmission } from "../models/essaySubmissionModel";
import userModel from "../models/user.model";
import axios from 'axios';
import { ErrorHandler } from "../utils/ErrorHandler";

/**
 * Create a new essay assignment
 * @param essayAssignmentData - Data for the new essay assignment
 * @returns The created essay assignment
 */
export const createEssayAssignment = async (essayAssignmentData: Partial<IEssayAssignment>): Promise<IEssayAssignment> => {
    // Validate date logic
    const startDate = new Date(essayAssignmentData.startDate as Date);
    const endDate = new Date(essayAssignmentData.endDate as Date);
    
    if (startDate >= endDate) {
        throw new ErrorHandler('End date must be after start date', 400);
    }
    
    const essayAssignment = new EssayAssignmentModel(essayAssignmentData);
    return await essayAssignment.save();
}

/**
 * Get an essay by its Id
 * @param id - Essay ID
 * @returns The essay, or null if not found
 */
export const getEssayById = async (id: string): Promise<IEssayAssignment | null> => {
    return await EssayAssignmentModel.findById(id).exec();
}

/**
 * Update an essay by its ID
 * @param id - Essay ID
 * @param updateData - Data to update
 * @returns The updated essay, or null if not found
 */
export const updateEssay = async (id: string, updateData: Partial<IEssayAssignment>): Promise<IEssayAssignment | null> => {
    // If updating dates, validate them
    if (updateData.startDate || updateData.endDate) {
        const essay = await EssayAssignmentModel.findById(id);
        if (!essay) {
            throw new ErrorHandler('Essay assignment not found', 404);
        }
        
        const startDate = new Date(updateData.startDate || essay.startDate);
        const endDate = new Date(updateData.endDate || essay.endDate);
        
        if (startDate >= endDate) {
            throw new ErrorHandler('End date must be after start date', 400);
        }
    }
    
    return await EssayAssignmentModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    }).exec();
};

/**
 * Delete an essay by its ID
 * @param id - Essay ID
 */
export const deleteEssay = async (id: string): Promise<void> => {
    await EssayAssignmentModel.findByIdAndDelete(id).exec();
};

/**
 * Get all essays optionally filtered by teacher Id
 * @param teacherId - (Optional) Teacher ID to filter essays
 * @returns A list of essays
 */
export const getAllEssays = async (teacherId?: string): Promise<IEssayAssignment[]> => {
    const filter = teacherId ? {teacherId} : {};
    return await EssayAssignmentModel.find(filter).exec();
};

/**
 * Get active essay assignments for a teacher
 * @param teacherId - Teacher ID
 * @returns A list of active essay assignments
 */
export const getActiveEssays = async (teacherId: string): Promise<IEssayAssignment[]> => {
    const currentDate = new Date();
    return await EssayAssignmentModel.find({
        teacherId,
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
    }).exec();
};

/**
 * Get upcoming essay assignments for a teacher
 * @param teacherId - Teacher ID
 * @returns A list of upcoming essay assignments
 */
export const getUpcomingEssays = async (teacherId: string): Promise<IEssayAssignment[]> => {
    const currentDate = new Date();
    return await EssayAssignmentModel.find({
        teacherId,
        startDate: { $gt: currentDate }
    }).exec();
};

/**
 * Get past essay assignments for a teacher
 * @param teacherId - Teacher ID
 * @returns A list of past essay assignments
 */
export const getPastEssays = async (teacherId: string): Promise<IEssayAssignment[]> => {
    const currentDate = new Date();
    return await EssayAssignmentModel.find({
        teacherId,
        endDate: { $lt: currentDate }
    }).exec();
};

/**
 * Add an item to an essay assignment
 * @param essayId - Essay ID
 * @param itemData - Data for the new essay item
 * @returns The updated essay
 */
export const addEssayItem = async (
    essayId: string,
    itemData: Partial<IEssay>
): Promise<IEssayAssignment | null> => {
    const essay = await EssayAssignmentModel.findById(essayId);
    if (!essay) {
        return null;
    }

    essay.questions.push(itemData as IEssay);
    return await essay.save();
};

interface EssaySubmission {
    assignmentId: string;
    userId: string;
    answers: { questionId: string; modelAnswer: string; studentAnswer: string }[];
    startTime: Date;
}

/**
 * Start an essay assignment
 * @param assignmentId - Essay assignment ID
 * @param userId - User ID
 * @returns The essay assignment and start time
 */
export const startEssayAssignment = async (assignmentId: string, userId: string): Promise<{assignment: IEssayAssignment; startTime: Date; score: number}> => {
    const assignment = await EssayAssignmentModel.findById(assignmentId);
    if (!assignment) {
        throw new ErrorHandler('Assignment not found', 404);
    }
    
    // Check if the assignment is currently available
    const currentDate = new Date();
    if (currentDate < assignment.startDate) {
        throw new ErrorHandler('This assignment is not yet available', 403);
    }
    
    if (currentDate > assignment.endDate) {
        throw new ErrorHandler('This assignment has expired', 403);
    }

    const startTime = new Date();
    const score = 0;

    return {assignment, startTime, score};
}

/**
 * Submit an essay assignment
 * @param submission - Essay submission data
 * @returns The essay submission
 */
export const submitEssay = async (submission: EssaySubmission): Promise<IEssaySubmission> => {
    const assignment = await EssayAssignmentModel.findById(submission.assignmentId);
    if (!assignment) {
        throw new ErrorHandler('Assignment not found', 404);
    }
    
    // Check if the assignment is still available for submission
    const currentDate = new Date();
    if (currentDate > assignment.endDate) {
        throw new ErrorHandler('This assignment has expired, submissions are no longer accepted', 403);
    }

    // Get registration number from user if not provided
    let registrationNumber = submission.registrationNumber;
    if (!registrationNumber) {
        const user = await userModel.findById(submission.userId);
        if (!user) {
            throw new ErrorHandler('User not found', 404);
        }
        registrationNumber = user.registrationNumber;
    }

    const endTime = new Date();
    const timeTaken = (endTime.getTime() - submission.startTime.getTime()) / 60000;
    
    // Check if time limit is exceeded
    if (timeTaken > assignment.timeLimit) {
        throw new ErrorHandler('Time limit exceeded', 400);
    }

    let score = 0;
    const processedAnswers = [];
    
    for (const answer of submission.answers) {
        const question = assignment.questions.find(q => q._id && q._id.toString() === answer.questionId);
        if (question) {
            try {
                const response = await axios.post('https://sentence-similarity-pi.vercel.app/similarity', {
                    model_answer: answer.modelAnswer,
                    student_answer: answer.studentAnswer
                });

                // Add similarity score to processed answer
                const processedAnswer = {
                    questionId: new mongoose.Types.ObjectId(answer.questionId),
                    modelAnswer: answer.modelAnswer,
                    studentAnswer: answer.studentAnswer,
                    similarityScore: response.data.similarity_score
                };
                
                processedAnswers.push(processedAnswer);
                score += response.data.similarity_score;
            } catch (error) {
                console.error('Error calculating similarity:', error);
                // Add answer without similarity score
                processedAnswers.push({
                    questionId: new mongoose.Types.ObjectId(answer.questionId),
                    modelAnswer: answer.modelAnswer,
                    studentAnswer: answer.studentAnswer,
                    similarityScore: 0
                });
            }
        }
    }

    const essaySubmission = new EssaySubmissionModel({
        assignmentId: new mongoose.Types.ObjectId(submission.assignmentId),
        userId: new mongoose.Types.ObjectId(submission.userId),
        registrationNumber,
        answers: processedAnswers,
        score,
        timeTaken,
        submittedAt: endTime,
    });

    await essaySubmission.save();

    return essaySubmission;
};

/**
 * Get a specific essay submission
 * @param submissionId - Essay submission ID
 * @returns The essay submission, or null if not found
 */
export const getEssaySubmission = async (submissionId: string): Promise<IEssaySubmission | null> => {
    return await EssaySubmissionModel.findById(submissionId);
};

/**
 * Get all essay submissions for a specific user
 * @param userId - User ID
 * @returns A list of essay submissions
 */
export const getEssaySubmissionsByUser = async (userId: string): Promise<IEssaySubmission[]> => {
    return await EssaySubmissionModel.find({userId});
};

/**
 * Get all essay submissions for a specific assignment
 * @param assignmentId - Assignment ID
 * @returns A list of essay submissions
 */
export const getEssaySubmissionsByAssignment = async (assignmentId: string): Promise<IEssaySubmission[]> => {
    return await EssaySubmissionModel.find({assignmentId});
};

export const getEssayResultsService = async (assignmentId: string) => {
    // Validate assignmentId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        throw new Error('Invalid assignment ID');
    }

    // Aggregate results with user details
    const results = await EssaySubmissionModel.aggregate([
        // Match submissions for the specific assignment
        { 
            $match: { 
                assignmentId: new mongoose.Types.ObjectId(assignmentId) 
            } 
        },
        // Lookup user details
        {
            $lookup: {
                from: 'users', // Assuming the user collection is named 'users'
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        // Unwind the user details
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        // Project the desired fields
        {
            $project: {
                _id: 1,
                registrationNumber: '$registrationNumber',
                score: 1,
                timeTaken: 1,
                userId: 1,
                submittedAt: 1,
                studentName: '$userDetails.name', // Assuming the user model has a 'name' field
                essayAnswer: { $arrayElemAt: ['$answers.studentAnswer', 0] }, // Get first answer if multiple
                similarityScore: { $arrayElemAt: ['$answers.similarityScore', 0] } // Get first similarity score
            }
        },
        // Sort by score in descending order
        {
            $sort: { score: -1 }
        }
    ]);

    return {
        success: true,
        results: results
    };
};

/**
 * Get violation summary for a specific assignment
 * @param assignmentId - ID of the essay assignment
 * @returns Object containing violation summary
 */
export const getEssayViolationSummaryService = async (assignmentId: string) => {
    // Validate assignmentId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        throw new Error('Invalid assignment ID');
    }

    // Aggregate violations with user details
    const summary = await EssaySubmissionModel.aggregate([
        // Match submissions for the specific assignment
        { 
            $match: { 
                assignmentId: new mongoose.Types.ObjectId(assignmentId) 
            } 
        },
        // Lookup user details
        {
            $lookup: {
                from: 'users', // Assuming the user collection is named 'users'
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        // Unwind the user details
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        // Group by student and count violations
        {
            $group: {
                _id: '$userId',
                studentName: { $first: '$userDetails.name' },
                totalViolations: { $sum: 1 }, // You might want to adjust this based on your violation tracking
                violationTypes: { $addToSet: 'Similarity Violation' } // Example violation type
            }
        },
        // Sort by total violations in descending order
        {
            $sort: { totalViolations: -1 }
        }
    ]);

    return {
        success: true,
        summary: summary
    };
};
/**
 * Get a specific student's essay submission for an assignment
 * @param assignmentId - Essay assignment ID
 * @param studentId - Student ID
 * @returns The student's essay submission or null if not found
 */
export const getStudentEssaySubmission = async (assignmentId: string, studentId: string): Promise<IEssaySubmission | null> => {
    if (!mongoose.Types.ObjectId.isValid(assignmentId) || !mongoose.Types.ObjectId.isValid(studentId)) {
        throw new Error('Invalid ID format');
    }
    
    return await EssaySubmissionModel.findOne({
        assignmentId: new mongoose.Types.ObjectId(assignmentId),
        userId: new mongoose.Types.ObjectId(studentId)
    });
};