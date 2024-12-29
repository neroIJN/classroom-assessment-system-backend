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

const router = express.Router();

// Create a new structure
router.post('/create', isAuthenticated, createStructureController);

// Get a structure by ID
router.get('/:id', checkStructureExists, getStructureByIdController);

// Update a structure by ID
router.put('/:id', checkStructureExists, updateStructureController);

// Delete a structure by ID
router.delete('/:id', checkStructureExists, deleteStructureController);

// Get all structures for a creator
router.get('/creator/:creatorId', getAllStructuresController);

// Add an item to a structure
router.post('/:id/item', checkStructureExists, addStructureItemController);

// Get items of a structure
router.get('/:id/items', checkStructureExists, getStructureItemsController);

export default router;
