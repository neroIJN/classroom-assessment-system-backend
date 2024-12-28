import { ErrorMiddleware } from './middleware/error';
import express, { NextFunction, Request, Response } from "express";
export const app = express();
require("dotenv").config();
import cors from "cors";
import cookieParser from 'cookie-parser';
import userAdminRouter  from "./routes/userAdmin.routes"
import userRouter from './routes/user.route';
import router from './routes/assignment.route';

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:4001'], // Allow requests from localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // If you're using cookies or authentication
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use("/api/v1", userAdminRouter,userRouter,router);
//Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working"
    });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
  });

app.use(ErrorMiddleware)