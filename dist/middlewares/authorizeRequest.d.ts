import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    auth?: {
        userId: string;
    };
}
declare const authorizeRequest: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default authorizeRequest;
