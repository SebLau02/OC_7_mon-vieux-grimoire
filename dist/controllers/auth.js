"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = async (req, res, next) => {
    const { password, email } = req.body;
    try {
        const hash = await bcrypt_1.default.hash(password, 10);
        const user = new user_1.default({ email, password: hash });
        await user.save();
        res.status(201).json({ message: "Utilisateur créé avec succès!" });
    }
    catch (error) {
        res.status(400).json({
            error: "Erreur lors de la création de l'utilisateur",
        });
    }
};
const login = async (req, res, next) => {
    try {
        const user = await user_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(401).json({ message: "Paire login/mot de passe incorrecte" });
        }
        if (user) {
            const valid = await bcrypt_1.default.compare(req.body.password, user.password);
            if (!valid) {
                res
                    .status(401)
                    .json({ message: "Paire login/mot de passe incorrecte" });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            res.status(200).json({
                userId: user._id,
                token: token,
            });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
const getAllUser = async (req, res, next) => {
    try {
        const users = await user_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || "Erreur lors de la création de l'utilisateur",
        });
    }
};
exports.default = { signup, login, getAllUser };
//# sourceMappingURL=auth.js.map