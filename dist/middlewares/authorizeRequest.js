"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizeRequest = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] ?? '';
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.auth = {
            userId: decodedToken.userId,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Non authorisé' });
    }
};
exports.default = authorizeRequest;
//# sourceMappingURL=authorizeRequest.js.map