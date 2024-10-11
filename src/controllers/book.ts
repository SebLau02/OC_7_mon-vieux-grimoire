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
    const { title, author, year, genre, ratings } = req.body;
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
      averageRating: 0,
    });

    await book.save();
    res.status(201).json({ message: "Livre crée avec succès" });
  } catch (error: any) {
    res.status(400).json({
      error: error || "Erreur lors de la création du livre",
    });
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await Book.deleteMany();
    console.log(response);
    if ((response.acknowledged = true)) {
      res.status(200).json({ message: "Tout les livres on été détruits" });
    }
  } catch (error: any) {
    res.status(200).json({ error: error || "une erreurs s'est produite" });
  }
};

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find();
    if (books) {
      res.status(200).json(books);
    }
  } catch (error: any) {
    res.status(200).json({ error: error || "une erreurs s'est produite" });
  }
};

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    const book = await Book.findOne({ _id: id });

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(400).json({ message: "Aucun livre n'a été trouvé" });
    }
  } catch (error: any) {
    res.status(200).json({ error: error || "une erreurs s'est produite" });
  }
};

const bestRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.find();
    const bestBooks = books
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);
    if (bestBooks) {
      res.status(200).json(bestBooks);
    } else {
      res.status(200).json({ message: "Aucun livre n'a été trouvé" });
    }
  } catch (error: any) {
    res.status(200).json({ error: error || "une erreurs s'est produite" });
  }
};

const updateRating = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    let userId = "";
    if (req.auth) {
      userId = req.auth.userId;
    }

    const updatedBook = await Book.updateOne(
      { _id: id },
      { $push: { ratings: { userId, grade: rating } } },
      { runValidators: true }
    );
    let book = await Book.findOne({ _id: id });
    if (book) {
      const totalRatings = book.ratings.length;
      const sumOfRatings =
        book.ratings.reduce((acc, curr) => acc + curr.grade, 0) + rating;
      console.log(totalRatings, sumOfRatings);
      const averageRating = sumOfRatings / totalRatings;
      await Book.updateOne({ _id: id }, { averageRating: averageRating });
    }
    book = await Book.findOne({ _id: id });
    if (updatedBook && book) {
      res.status(200).json(book);
    } else {
      res.status(200).json({ message: "Aucun livre n'a été trouvé" });
    }
  } catch (error: any) {
    res.status(200).json({ error: error || "une erreurs s'est produite" });
  }
};

export default { create, destroy, index, show, bestRating, updateRating };
