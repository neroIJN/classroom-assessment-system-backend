import mongoose, { Document, Schema } from "mongoose";

export interface IEssaySubmission extends Document {
    assignmentId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    registrationNumber: string;
    answers: {
        questionId: mongoose.Schema.Types.ObjectId;
        modelAnswer: string;
        studentAnswer: string;
    }
    score: number;
    timeTaken: number;
    submittedAt: Date;
}

const essaySubmissionSchema: Schema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EssayAssignment',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registrationNumber:{
        type: String,
        required:true
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EssayQuestion',
            required: true
        },
        modelAnswer: {
            type: String,
            required: true
        },
        studentAnswer: {
            type: String,
            required: true
        }
    }],
    score: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const EssaySubmissionModel = mongoose.model<IEssaySubmission>('EssaySubmission', essaySubmissionSchema);

export default EssaySubmissionModel;