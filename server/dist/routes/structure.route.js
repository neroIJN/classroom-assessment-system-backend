"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const structure_controller_1 = require("../controllers/structure.controller");
const structure_middleware_1 = require("../middleware/structure.middleware");
const auth_1 = require("../middleware/auth");
const structureRouter = express_1.default.Router();
// Create a new structure
structureRouter.post('/create-structure', auth_1.isAuthenticated, structure_controller_1.createStructureController);
// Get a structure by its ID
structureRouter.get('/get-structure/:structureId', structure_middleware_1.checkStructureExists, structure_controller_1.getStructureByIdController);
// Update a structure by its ID
structureRouter.put('/update-structure/:structureId', structure_middleware_1.checkStructureExists, structure_controller_1.updateStructureController);
// Delete a structure by its ID
structureRouter.delete('/delete-structure/:structureId', structure_middleware_1.checkStructureExists, structure_controller_1.deleteStructureController);
// Get all structures for a specific creator
structureRouter.get('/get-all-structures-by-creator/:creatorId', structure_controller_1.getAllStructuresController);
// Add a new item to a structure
structureRouter.post('/add-structure-item/:structureId', structure_middleware_1.checkStructureExists, structure_controller_1.addStructureItemController);
// Get all items of a specific structure
structureRouter.get('/get-structure-items/:structureId', structure_middleware_1.checkStructureExists, structure_controller_1.getStructureItemsController);
exports.default = structureRouter;
