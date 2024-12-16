import { Request, Response, NextFunction } from "express";
declare const _default: {
    signup: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default _default;
