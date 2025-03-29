import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFeedback extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    assignmentId: mongoose.Schema.Types.ObjectId;
    feedback: string;
    createdAt: Date;
    updatedAt: Date;
}

const feedbackSchema: Schema<IFeedback> = new mongoose.Schema(
    {
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        feedback: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret._id;
                delete ret.__v;
            },
        }
    }
);

const FeedbackModel : Model<IFeedback> = mongoose.model("Feedback", feedbackSchema);

export default FeedbackModel;