import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            auth?: {
                userId: string;
            };
        }
    }
}
declare const _default: {
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    index: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    show: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    bestRating: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateRating: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateBook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    destroyOne: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default _default;
