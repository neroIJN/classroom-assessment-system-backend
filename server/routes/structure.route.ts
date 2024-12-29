import express from 'express';
import {
  createStructureController,
  getStructureByIdController,
  updateStructureController,
  deleteStructureController,
  getAllStructuresController,
  addStructureItemController,
  getStructureItemsController,
} from '../controllers/structure.controller';
import { checkStructureExists } from '../middleware/structure.middleware';
import { isAuthenticated } from '../middleware/auth';

const structureRouter = express.Router();

// Create a new structure
structureRouter.post('/create-structure', isAuthenticated, createStructureController);

// Get a structure by its ID
structureRouter.get('/get-structure/:structureId', checkStructureExists, getStructureByIdController);

// Update a structure by its ID
structureRouter.put('/update-structure/:structureId', checkStructureExists, updateStructureController);

// Delete a structure by its ID
structureRouter.delete('/delete-structure/:structureId', checkStructureExists, deleteStructureController);

// Get all structures for a specific creator
structureRouter.get('/get-all-structures-by-creator/:creatorId', getAllStructuresController);

// Add a new item to a structure
structureRouter.post('/add-structure-item/:structureId', checkStructureExists, addStructureItemController);

// Get all items of a specific structure
structureRouter.get('/get-structure-items/:structureId', checkStructureExists, getStructureItemsController);

export default structureRouter;
