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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStructureItem = exports.getAllStructures = exports.deleteStructure = exports.updateStructure = exports.getStructureById = exports.createStructure = void 0;
const structure_model_1 = __importDefault(require("../models/structure.model"));
/**
 * Create a new structure
 * @param structureData - Data for the new structure
 * @returns The created structure
 */
const createStructure = (structureData) => __awaiter(void 0, void 0, void 0, function* () {
    const structure = new structure_model_1.default(structureData);
    return yield structure.save();
});
exports.createStructure = createStructure;
/**
 * Get a structure by its ID
 * @param id - Structure ID
 * @returns The structure, or null if not found
 */
const getStructureById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield structure_model_1.default.findById(id).populate("items.parentId").exec();
});
exports.getStructureById = getStructureById;
/**
 * Update a structure by its ID
 * @param id - Structure ID
 * @param updateData - Data to update
 * @returns The updated structure, or null if not found
 */
const updateStructure = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield structure_model_1.default.findByIdAndUpdate(id, updateData, { new: true }).exec();
});
exports.updateStructure = updateStructure;
/**
 * Delete a structure by its ID
 * @param id - Structure ID
 */
const deleteStructure = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield structure_model_1.default.findByIdAndDelete(id).exec();
});
exports.deleteStructure = deleteStructure;
/**
 * Get all structures, optionally filtering by creator ID
 * @param creatorId - (Optional) Creator ID to filter structures
 * @returns A list of structures
 */
const getAllStructures = (creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = creatorId ? { creatorId } : {};
    return yield structure_model_1.default.find(filter).exec();
});
exports.getAllStructures = getAllStructures;
/**
 * Add an item to a structure
 * @param structureId - Structure ID
 * @param itemData - Data for the new structure item
 * @returns The updated structure
 */
const addStructureItem = (structureId, itemData) => __awaiter(void 0, void 0, void 0, function* () {
    const structure = yield structure_model_1.default.findById(structureId);
    if (!structure) {
        throw new Error("Structure not found");
    }
    structure.items.push(Object.assign(Object.assign({}, itemData), { createdAt: new Date(), updatedAt: new Date() }));
    return yield structure.save();
});
exports.addStructureItem = addStructureItem;
