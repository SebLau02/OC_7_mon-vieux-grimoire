import express, { Request, Response, NextFunction } from "express";
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

app.get("/api/stuff", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "première requête en ts" });
});

module.exports = app;
