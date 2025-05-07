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
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncError_1 = require("./catchAsyncError");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import {updateAccessToken} from "../controllers/user.controller"
const redis_1 = require("../utils/redis");
//authenticate user
exports.isAuthenticated = (0, catchAsyncError_1.CatchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let access_token = req.cookies.access_token;
    if (!access_token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            access_token = authHeader.split(' ')[1];
        }
    }
    if (!access_token) {
        return next(new ErrorHandler_1.ErrorHandler("Please login to access this resource", 400));
    }
    const decoded = jsonwebtoken_1.default.decode(access_token);
    if (!decoded) {
        return next(new ErrorHandler_1.ErrorHandler("Access token is not valid", 400));
    }
    // check if the access token is expired
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        try {
            // await updateAccessToken(req, res, next);
        }
        catch (error) {
            return next(error);
        }
    }
    else {
        const user = yield redis_1.redis.get(decoded.id);
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("Please login to access this resource", 400));
        }
        req.user = JSON.parse(user);
        next();
    }
}));
// // validate user role
// export const authorizeRoles = (...roles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (!req.user) {
//         return next(new ErrorHandler("User not authenticated", 401));
//       }
//       const userRole = req.user.role.toLowerCase();
//       const allowedRoles = roles.map(role => role.toLowerCase());
//       console.log("Role Check:", {
//         userRole,
//         allowedRoles,
//         hasAccess: allowedRoles.includes(userRole)
//       });
//       if (!allowedRoles.includes(userRole)) {
//         return next(
//           new ErrorHandler(
//             `Role: ${req.user.role} is not allowed to access this resource`,
//             403
//           )
//         );
//       }
//       next();
//     } catch (error: any) {
//       return next(new ErrorHandler("Role authorization failed", 403));
//     }
//   };
// };
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || "")) {
            return next(new ErrorHandler_1.ErrorHandler(`Role: ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
