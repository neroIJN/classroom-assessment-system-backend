"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStructureItemsController = exports.addStructureItemController = exports.getAllStructuresController = exports.deleteStructureController = exports.updateStructureController = exports.getStructureByIdController = exports.createStructureController = void 0;
const structure_service_1 = require("../services/structure.service");
// Create a new structure
const createStructureController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const structure = yield (0, structure_service_1.createStructure)(req.body);
        res.status(201).json({
            success: true,
            structure,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createStructureController = createStructureController;
// Get a structure by ID
const getStructureByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const structure = yield (0, structure_service_1.getStructureById)(req.params.id);
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
    }
    catch (error) {
        next(error);
    }
});
exports.getStructureByIdController = getStructureByIdController;
// Update a structure by ID
const updateStructureController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedStructure = yield (0, structure_service_1.updateStructure)(req.params.id, req.body);
        res.status(200).json({
            success: true,
            structure: updatedStructure,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateStructureController = updateStructureController;
// Delete a structure by ID
const deleteStructureController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, structure_service_1.deleteStructure)(req.params.id);
        res.status(204).json({
            success: true,
            message: "Structure deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteStructureController = deleteStructureController;
// Get all structures
const getAllStructuresController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const structures = yield (0, structure_service_1.getAllStructures)(req.query.creatorId); // Optionally filter by creatorId
        res.status(200).json({
            success: true,
            structures,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllStructuresController = getAllStructuresController;
// Add a structure item
const addStructureItemController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const structure = yield (0, structure_service_1.addStructureItem)(req.params.id, req.body);
        res.status(201).json({
            success: true,
            structure,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addStructureItemController = addStructureItemController;
// Get items of a structure
const getStructureItemsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const structure = yield (0, structure_service_1.getStructureById)(req.params.id);
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
    }
    catch (error) {
        next(error);
    }
});
exports.getStructureItemsController = getStructureItemsController;
