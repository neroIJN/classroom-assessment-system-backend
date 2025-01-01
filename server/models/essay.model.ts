import mongoose, { Document, Model, Schema } from "mongoose";

// Define the schema for a essays
const essaysSchema: Schema = new Schema({
    questionText: {
        type: String,
        required: [true, "Question text is required"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
    },
});

export interface IEssay extends Document {
    questionText: string;
    answer: string;
}

export interface IEssayAssignment extends Document {
    title: string;
    description: string;
    questions: IEssay[];
    guidelines: string[];
    password: string;
    teacherId: mongoose.Schema.Types.ObjectId;
    timeLimit: number; // Time limit in minutes
    createdAt: Date;
    updatedAt: Date;
}

const essayAssignmentSchema: Schema<IEssayAssignment> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Assignment title is required"],
            minlength: 3,
            maxlength: 100,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            minlength: 10,
            maxlength: 500,
        },
        questions: [essaysSchema],
        guidelines: {
            type: [String],
            default: ["Guideline 1", "Guideline 2", "Guideline 3", "Guideline 4"],
            validate: {
                validator: function (guidelines: any[]) {
                    return guidelines.length === 4;
                },
                message: "Each assignment must have exactly four guidelines",
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        timeLimit: {
            type: Number,
            required: [true, "Time limit is required"],
            min: 1,
            max: 180, // Maximum 3 hours
        },
    },
    { timestamps: true }
);

const EssayAssignmentModel:Model<IEssayAssignment> = mongoose.model("EssayAssignment", essayAssignmentSchema);

export default EssayAssignmentModel;