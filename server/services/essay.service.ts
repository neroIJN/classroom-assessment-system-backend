import EssayAssignmentModel, {IEssay, IEssayAssignment} from "../models/essay.model";


/**
 * Create a new essay assignment
 * @param essayAssignmentData - Data for the new essay assignment
 * @returns The created essay assignment
 */
export const createEssayAssignment = async (essayAssignmentData: Partial<IEssayAssignment>): Promise<IEssayAssignment> => {
    const essayAssignment = new EssayAssignmentModel(essayAssignmentData);
    return await essayAssignment.save();
}

/**
 * * Get an essay by ts Id
 * @param id - Essay ID
 * @returns The essay, or null if not found
 */

export const getEssayById = async (id: string): Promise<IEssay | null> => {
    const essay = await EssayAssignmentModel.findById(id).exec();
    return essay as IEssay | null;
}

/**
 * Update an essay by its ID
 * @param id - Essay ID
 * @param updateData - Data to update
 * @returns The updated essay, or null if not found
 */

export const updateEssay = async (id: string, updateData: Partial<IEssayAssignment>): Promise<IEssayAssignment | null> => {
    return await EssayAssignmentModel.findByIdAndUpdate(id, updateData, {
        new: true,
    }).exec();
};

/**
 * Delete an essay by its ID
 * @param id - Essay ID
 */

export const deleteEssay = async (id: string): Promise<void> => {
    await EssayAssignmentModel.findByIdAndDelete(id).exec();
};

/**
 * Get all essays optionally filred by teacher Id
 * @param teacherId - (Optional) Teacher ID to filter essays
 * @returns A list of essays
 */

export const getAllEssays = async (teacherId?: string): Promise<IEssayAssignment[]> => {
    const filter = teacherId ? {teacherId} : {};
    return await EssayAssignmentModel.find(filter).exec();
};

/**
 * Add an item to an essay assignment
 * @param essayId - Essay ID
 * @param itemData - Data for the new essay item
 * @returns The updated essay
 */

export const addEssayItem = async (
    essayId: string,
    itemData: Partial<IEssay>
): Promise<IEssayAssignment | null> => {
    const essay = await EssayAssignmentModel.findById(essayId);
    if (!essay) {
        return null;
    }

    essay.questions.push({
        ...itemData,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as IEssay);
    return await essay.save();
};