import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { password, email } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé avec succès!" });
  } catch (error: any) {
    res.status(400).json({
      error: "Erreur lors de la création de l'utilisateur",
    });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(401).json({ message: "Paire login/mot de passe incorrecte" });
    }
    if (user) {
      const valid = await bcrypt.compare(req.body.password, user.password);

      if (!valid) {
        res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }

      res.status(200).json({
        userId: user._id,
        token: "TOKEN",
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || "Erreur lors de la création de l'utilisateur",
    });
  }
};

export default { signup, login, getAllUser };
