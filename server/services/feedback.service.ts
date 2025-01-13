import FeedbackModel, { IFeedback } from "../models/feedback.model";

export const createFeedback = async (feedbackData: IFeedback): Promise<IFeedback> => {
    const feedback = new FeedbackModel(feedbackData);
    return await feedback.save();
}

export const getFeedbackById = async (id: string): Promise<IFeedback | null> => {
    return await FeedbackModel.findById(id);
}

export const getFeedbackByAssignmentId = async (assignmentId: string): Promise<IFeedback[] | null> => {
    return await FeedbackModel.find({ assignmentId });
}