import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.model";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// Get All users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};

// update user role
export const updateUserRoleService = async (res:Response,id: string,role:string) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

  res.status(201).json({
    success: true,
    user,
  });
}

// get user by id
export const getUserByIdService = async (res: Response, id: string) => {
  return await userModel.findById(id);
};

// update whether user repeat or not with repeat batch
export const updateUserRepeatBatchService = async (res: Response, id: string, repeatingBatch: number, isRepeater: boolean) => {
  const user = await userModel.findByIdAndUpdate(id, { repeatingBatch, isRepeater }, { new: true });

  res.status(201).json({
    success: true,
    user,
  });

  return user;
}