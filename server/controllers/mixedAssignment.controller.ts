import { Request, Response } from "express";
import MixedAssignmentModel from "../models/MixedAssignment";

export const createMixedAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = new MixedAssignmentModel(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMixedAssignments = async (_req: Request, res: Response) => {
  try {
    const assignments = await MixedAssignmentModel.find();
    res.status(200).json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMixedAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await MixedAssignmentModel.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json(assignment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
