import { Request, Response, NextFunction } from "express";
import Book from "../models/book";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
    }
  }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, year, genre, ratings, averageRating } = req.body;
    let imageFile = "";
    let userId = "";
    if (req.file) {
      imageFile = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }
    if (req.auth) {
      userId = req.auth.userId;
    }
    ratings[0].userId = userId;

    const book = new Book({
      title,
      author,
      year,
      genre,
      ratings,
      imageUrl: imageFile,
      averageRating,
    });

    console.log(book);

    await book.save();
    res.status(201).json({ message: "Livre crée avec succès" });
  } catch (error: any) {
    res.status(400).json({
      error: error || "Erreur lors de la création du livre",
    });
  }
};

export default { create };
