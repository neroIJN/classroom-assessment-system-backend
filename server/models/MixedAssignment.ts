import mongoose, { Document, Model, Schema } from "mongoose";

const mcqOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const mcqQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: {
    type: [mcqOptionSchema],
    validate: [(opt: any[]) => opt.length === 4, "Each MCQ must have exactly four options."],
  },
  pointsForQuestion: { type: Number, default: 1 },
});

const essayQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  answer: { type: String, required: true },
});

export interface IMixedAssignment extends Document {
  title: string;
  description: string;
  mcqQuestions: typeof mcqQuestionSchema[];
  essayQuestions: typeof essayQuestionSchema[];
  guidelines: string[];
  password: string;
  intendedBatch: number;
  teacherId: mongoose.Schema.Types.ObjectId;
  timeLimit: number;
  startDate: Date;
  endDate: Date;
  attemptedStudents: mongoose.Schema.Types.ObjectId[];
}

const mixedAssignmentSchema = new Schema<IMixedAssignment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    mcqQuestions: [mcqQuestionSchema],
    essayQuestions: [essayQuestionSchema],
    guidelines: {
      type: [String],
      default: ["Guideline 1", "Guideline 2", "Guideline 3", "Guideline 4"],
      validate: [(g: string[]) => g.length === 4, "Must have 4 guidelines"],
    },
    password: { type: String, required: true }, 
    intendedBatch: { type: Number, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timeLimit: { type: Number, min: 1, max: 180, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    attemptedStudents: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

const MixedAssignmentModel: Model<IMixedAssignment> = mongoose.model("MixedAssignment", mixedAssignmentSchema);
export default MixedAssignmentModel;
