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
exports.updateUserService = exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const redis_1 = require("../utils/redis");
const userAdmin_model_1 = __importDefault(require("../models/userAdmin.model"));
const userAdmin_model_2 = __importDefault(require("../models/userAdmin.model"));
// get user by id
const getUserById = (id, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userJson = yield redis_1.redis.get(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        res.status(201).json({
            success: true,
            user,
        });
    }
});
exports.getUserById = getUserById;
// Get All users
const getAllUsersService = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userAdmin_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    });
});
exports.getAllUsersService = getAllUsersService;
// update user role
const updateUserRoleService = (res, id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userAdmin_model_1.default.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
        success: true,
        user,
    });
});
exports.updateUserRoleService = updateUserRoleService;
// update user
const updateUserService = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userAdmin_model_2.default.findByIdAndUpdate(id, body, { new: true });
});
exports.updateUserService = updateUserService;
