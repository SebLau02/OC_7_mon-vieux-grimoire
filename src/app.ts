import express, { Request, Response, NextFunction } from "express";
import User from "./models/user";
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect(
    "mongodb+srv://OCR_P7:dSiBGFPe1bhVNMGY@cluster0.je84pvt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/stuff", (req: Request, res: Response, next: NextFunction) => {
  const user = new User({
    ...req.body,
  });
  user
    .save()
    .then(() => {
      res.status(201).json({ message: "Utilisateur créé avec succès!" });
    })
    .catch((err) => res.status(400).json({ err }));
});

app.delete(
  "/api/stuff/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (user) {
        await user.deleteOne();
        res.status(200).json({ message: "Utilisateur supprimé avec succès!" });
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé!" });
      }
    } catch (error) {
      res.status(500).json({
        error:
          "Une erreur est survenue lors de la suppression de l'utilisateur.",
      });
    }
  }
);

app.get(
  "/api/stuff",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des utilisateurs." });
    }
  }
);

export default app;
