import { Request } from "express";
import { IUser } from "../models/userAdmin.model";

declare global {
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}