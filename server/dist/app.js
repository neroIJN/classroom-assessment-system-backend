"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const error_1 = require("./middleware/error");
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userAdmin_routes_1 = __importDefault(require("./routes/userAdmin.routes"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const assignment_route_1 = __importDefault(require("./routes/assignment.route"));
const result_routes_1 = __importDefault(require("./routes/result.routes"));
const structure_route_1 = __importDefault(require("./routes/structure.route"));
const essay_route_1 = __importDefault(require("./routes/essay.route"));
const feedback_route_1 = __importDefault(require("./routes/feedback.route"));
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://47.128.238.249:3001', 'http://47.128.238.249:3000'], // Allow requests from localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If you're using cookies or authentication
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
exports.app.use("/api/v1", userAdmin_routes_1.default, user_route_1.default, assignment_route_1.default, structure_route_1.default, essay_route_1.default, result_routes_1.default, feedback_route_1.default);
//Testing API
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working"
    });
});
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
exports.app.use(error_1.ErrorMiddleware);
