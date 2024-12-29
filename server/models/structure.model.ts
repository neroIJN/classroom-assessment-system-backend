import mongoose, { Document, Model, Schema } from "mongoose";

// Define the schema for a structure item
const structureItemSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Structure item name is required"],
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: 10,
    maxlength: 500,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StructureItem",
    default: null,
  },
  level: {
    type: Number,
    required: [true, "Level is required"],
    min: 0,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Interface for structure items
export interface IStructureItem extends Document {
  name: string;
  description: string;
  parentId: mongoose.Types.ObjectId | null;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the structure
export interface IStructure extends Document {
  title: string;
  description: string;
  items: IStructureItem[];
  creatorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the structure
const structureSchema: Schema<IStructure> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Structure title is required"],
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Structure description is required"],
      minlength: 10,
      maxlength: 1000,
    },
    items: {
      type: [
        {
          name: { type: String, required: true, minlength: 3, maxlength: 100 },
          description: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 500,
          },
          parentId: { type: mongoose.Schema.Types.ObjectId, ref: "StructureItem" },
          level: { type: Number, required: true, min: 0 },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Create the model
const StructureModel: Model<IStructure> = mongoose.model<IStructure>(
  "Structure",
  structureSchema
);

export default StructureModel;

