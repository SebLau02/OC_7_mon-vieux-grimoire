import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  auth?: {
    userId: string;
  };
}

const authorizeRequest = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ?? "";
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.auth = {
      userId: decodedToken.userId,
    };

    next();
  } catch (error: any) {
    res.status(401).json({ error: "Non authorisé" });
  }
};

export default authorizeRequest;
