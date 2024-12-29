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

const structurerouter = express.Router();

// Create a new structure
structurerouter.post('/create', isAuthenticated, createStructureController);

// Get a structure by ID
structurerouter.get('/:id', checkStructureExists, getStructureByIdController);

// Update a structure by ID
structurerouter.put('/:id', checkStructureExists, updateStructureController);

// Delete a structure by ID
structurerouter.delete('/:id', checkStructureExists, deleteStructureController);

// Get all structures for a creator
structurerouter.get('/creator/:creatorId', getAllStructuresController);

// Add an item to a structure
structurerouter.post('/:id/item', checkStructureExists, addStructureItemController);

// Get items of a structure
structurerouter.get('/:id/items', checkStructureExists, getStructureItemsController);

export default structurerouter;
