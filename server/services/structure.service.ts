import StructureModel, { IStructure, IStructureItem } from "../models/structure.model";

/**
 * Create a new structure
 * @param structureData - Data for the new structure
 * @returns The created structure
 */
export const createStructure = async (structureData: Partial<IStructure>): Promise<IStructure> => {
  const structure = new StructureModel(structureData);
  return await structure.save();
};

/**
 * Get a structure by its ID
 * @param id - Structure ID
 * @returns The structure, or null if not found
 */
export const getStructureById = async (id: string): Promise<IStructure | null> => {
  return await StructureModel.findById(id).populate("items.parentId").exec();
};

/**
 * Update a structure by its ID
 * @param id - Structure ID
 * @param updateData - Data to update
 * @returns The updated structure, or null if not found
 */
export const updateStructure = async (id: string, updateData: Partial<IStructure>): Promise<IStructure | null> => {
  return await StructureModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
};

/**
 * Delete a structure by its ID
 * @param id - Structure ID
 */
export const deleteStructure = async (id: string): Promise<void> => {
  await StructureModel.findByIdAndDelete(id).exec();
};

/**
 * Get all structures, optionally filtering by creator ID
 * @param creatorId - (Optional) Creator ID to filter structures
 * @returns A list of structures
 */
export const getAllStructures = async (creatorId?: string): Promise<IStructure[]> => {
  const filter = creatorId ? { creatorId } : {};
  return await StructureModel.find(filter).exec();
};

/**
 * Add an item to a structure
 * @param structureId - Structure ID
 * @param itemData - Data for the new structure item
 * @returns The updated structure
 */
export const addStructureItem = async (
  structureId: string,
  itemData: Partial<IStructureItem>
): Promise<IStructure | null> => {
  const structure = await StructureModel.findById(structureId);
  if (!structure) {
    throw new Error("Structure not found");
  }

  structure.items.push({
    ...itemData,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as IStructureItem);

  return await structure.save();
};
