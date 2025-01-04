import mongoose from "mongoose";
import EssayAssignmentModel, {IEssay, IEssayAssignment} from "../models/essay.model";
import EssaySubmissionModel, { IEssaySubmission } from "../models/essaySubmissionModel";
import userModel from "../models/user.model";
import axios from 'axios';


/**
 * Create a new essay assignment
 * @param essayAssignmentData - Data for the new essay assignment
 * @returns The created essay assignment
 */
export const createEssayAssignment = async (essayAssignmentData: Partial<IEssayAssignment>): Promise<IEssayAssignment> => {
    const essayAssignment = new EssayAssignmentModel(essayAssignmentData);
    return await essayAssignment.save();
}

/**
 * * Get an essay by ts Id
 * @param id - Essay ID
 * @returns The essay, or null if not found
 */

export const getEssayById = async (id: string): Promise<IEssay | null> => {
    const essay = await EssayAssignmentModel.findById(id).exec();
    return essay as IEssay | null;
}

/**
 * Update an essay by its ID
 * @param id - Essay ID
 * @param updateData - Data to update
 * @returns The updated essay, or null if not found
 */

export const updateEssay = async (id: string, updateData: Partial<IEssayAssignment>): Promise<IEssayAssignment | null> => {
    return await EssayAssignmentModel.findByIdAndUpdate(id, updateData, {
        new: true,
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
 * Get all essays optionally filred by teacher Id
 * @param teacherId - (Optional) Teacher ID to filter essays
 * @returns A list of essays
 */

export const getAllEssays = async (teacherId?: string): Promise<IEssayAssignment[]> => {
    const filter = teacherId ? {teacherId} : {};
    return await EssayAssignmentModel.find(filter).exec();
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

    essay.questions.push({
        ...itemData,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as IEssay);
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
        throw new Error('Assignment not found');
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
        throw new Error('Assignment not found');
    }

    const user = await userModel.findById(submission.userId);
    if (!user) {
        throw new Error('User not found');
    }
    const registrationNumber = user.registrationNumber;

    const endTime = new Date();
    const timeTaken = (endTime.getTime() - submission.startTime.getTime()) / 60000;

    let score = 0;
    for (const answer of submission.answers) {
        const question = assignment.questions.find(q => q._id && q._id.toString() === answer.questionId);
        if (question) {
        const response = await axios.post('https://sentence-similarity-pi.vercel.app/similarity', {
            model_answer: answer.modelAnswer,
            student_answer: answer.studentAnswer
        });

        score += response.data.similarity_score;
        }
    }

    const essaySubmission = new EssaySubmissionModel({
        assignmentId: new mongoose.Types.ObjectId(submission.assignmentId),
        userId: new mongoose.Types.ObjectId(submission.userId),
        registrationNumber,
        answers: submission.answers.map(answer => ({
            questionId: new mongoose.Types.ObjectId(answer.questionId),
            modelAnswer: answer.modelAnswer,
            studentAnswer: answer.studentAnswer
        })),
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
}