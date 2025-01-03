import mongoose, { Document, Model, Schema } from "mongoose";

export interface IResult extends Document {
  assignmentId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  registrationNumber: string;
  score: number;
  timeTaken: number;
  submittedAt: Date;
}

const resultSchema: Schema<IResult> = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
  },
  { 
    timestamps: false,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

const ResultModel: Model<IResult> = mongoose.model("Result", resultSchema);

export default ResultModel;