import { Request, Response, NextFunction } from "express";
import {
  createStructure,
  getStructureById,
  updateStructure,
  deleteStructure,
  getAllStructures,
  addStructureItem,
} from "../services/structure.service";
import StructureModel from "../models/structure.model";

// Create a new structure
export const createStructureController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const structure = await createStructure(req.body);
    res.status(201).json({
      success: true,
      structure,
    });
  } catch (error) {
    next(error);
  }
};

// Get a structure by ID
export const getStructureByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const structure = await getStructureById(req.params.id);
    if (!structure) {
      return res.status(404).json({
        success: false,
        message: "Structure not found",
      });
    }
    res.status(200).json({
      success: true,
      structure,
    });
  } catch (error) {
    next(error);
  }
};

// Update a structure by ID
export const updateStructureController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedStructure = await updateStructure(req.params.id, req.body);
    res.status(200).json({
      success: true,
      structure: updatedStructure,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a structure by ID
export const deleteStructureController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteStructure(req.params.id);
    res.status(204).json({
      success: true,
      message: "Structure deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all structures
export const getAllStructuresController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const structures = await getAllStructures(req.query.creatorId as string); // Optionally filter by creatorId
    res.status(200).json({
      success: true,
      structures,
    });
  } catch (error) {
    next(error);
  }
};

// Add a structure item
export const addStructureItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const structure = await addStructureItem(req.params.id, req.body);
    res.status(201).json({
      success: true,
      structure,
    });
  } catch (error) {
    next(error);
  }
};

// Get items of a structure
export const getStructureItemsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const structure = await getStructureById(req.params.id);
    if (!structure) {
      return res.status(404).json({
        success: false,
        message: "Structure not found",
      });
    }
    res.status(200).json({
      success: true,
      items: structure.items,
    });
  } catch (error) {
    next(error);
  }
};


