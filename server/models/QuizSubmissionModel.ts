import mongoose, { Document, Schema } from "mongoose";
import userModel from "./user.model";
export interface IQuizSubmission extends Document {
  assignmentId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  registrationNumber: string;
  answers: {
    questionId: mongoose.Schema.Types.ObjectId;
    selectedOption: mongoose.Schema.Types.ObjectId;
  }[];
  score: number;
  timeTaken: number;
  submittedAt: Date;
}

const quizSubmissionSchema: Schema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
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
      required: true
    },
    selectedOption: {
      type: mongoose.Schema.Types.ObjectId,
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


const QuizSubmissionModel = mongoose.model<IQuizSubmission>('QuizSubmission', quizSubmissionSchema);

export default QuizSubmissionModel;