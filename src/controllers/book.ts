import { Request, Response, NextFunction } from 'express';
import Book from '../models/book';
import fs from 'fs';
import path from 'path';

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
    let book = JSON.parse(req.body.book);
    let imageFile = '';
    let userId = '';
    if (req.file) {
      imageFile = `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`;
    }
    if (req.auth) {
      userId = req.auth.userId;
    }

    const newBook = new Book({
      ...book,
      userId: userId,
      ratings: [{ ...book.ratings[0], userId: userId }],
      imageUrl: imageFile,
    });

    await newBook.save();
    res.status(201).json({ message: 'Livre crée avec succès' });
  } catch (error: any) {
    res.status(400).json({
      error: error || 'Erreur lors de la création du livre',
    });
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await Book.deleteMany();
    if ((response.acknowledged = true)) {
      res.status(200).json({ message: 'Tout les livres on été détruits' });
    }
  } catch (error: any) {
    res.status(200).json({ error: error || "une erreurs s'est produite" });
  }
};

const destroyOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const response = await Book.findOneAndDelete({ _id: id });
    if (response) {
      const filename = response.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression de l'image :", err);
        } else {
          console.log('Image supprimée avec succès :', filename);
        }
      });
      res
        .status(200)
        .json({ message: 'Livre supprimé avec succès', title: response.title });
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
    const { id } = req.params;
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
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const rating =
      req.body.rating > 5 ? 5 : req.body.rating < 0 ? 0 : req.body.rating;
    let book = await Book.findOne({ _id: id });
    let userId = '';
    if (req.auth) {
      userId = req.auth.userId;
    }
    // si le livre existe
    if (book) {
      // si l'utilisateur n'a pas déjà évalué le livre
      if (!book.ratings.find((r) => r.userId === userId)) {
        const updatedBook = await Book.findOneAndUpdate(
          { _id: id },
          { $push: { ratings: { userId, grade: rating } } },
          { runValidators: true, new: true },
        );
        if (updatedBook) {
          const totalRatings = updatedBook.ratings.length;
          const sumOfRatings = updatedBook.ratings.reduce(
            (acc, curr) => acc + curr.grade,
            0,
          );
          const averageRating = sumOfRatings / totalRatings;
          const ratedBook = await Book.findOneAndUpdate(
            { _id: id },
            { averageRating: averageRating },
            { new: true },
          );
          if (updatedBook && ratedBook) {
            res.status(200).json(ratedBook);
          } else {
            res.status(200).json({ message: "Aucun livre n'a été trouvé" });
          }
        }
      } else {
        res.status(400).json({ message: 'Vous avez déjà évalué ce livre.' });
      }
    } else {
      res.status(404).json({ message: "Ce livre n'existe plus." });
    }
  } catch (error: any) {
    res.status(200).json({ error: error || "une erreurs s'est produite" });
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    let book = await Book.findOne({ _id: id });
    let currentUser = '';
    if (req.auth) {
      currentUser = req.auth.userId;
    }
    if (book) {
      if (book.userId === currentUser) {
        let reqBook = JSON.parse(req.body.book);
        const { title, author, year, genre } = reqBook;

        let imageUrl = '';
        if (req.file) {
          imageUrl = `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
          }`;
        }
        const updatingBook =
          imageUrl !== ''
            ? { title, author, year, genre, imageUrl }
            : { title, author, year, genre };
        const updatedBook = await Book.findByIdAndUpdate(id, updatingBook, {
          new: true,
        });

        if (!updatedBook) {
          res.status(404).json({
            message: 'Une erreure est survenue lors de la mis à jours du livre',
            error: updatedBook,
          });
        } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.error("Erreur lors de la suppression de l'image :", err);
            } else {
              console.log('Image supprimée avec succès :', filename);
            }
          });
          res.status(200).json(updatedBook);
        }
      }
    } else {
      res.status(404).json({ message: 'Livre non trouvé.' });
    }
  } catch (error: any) {
    res.status(200).json({ error: error || "une erreurs s'est produite" });
  }
};

export default {
  create,
  destroy,
  index,
  show,
  bestRating,
  updateRating,
  updateBook,
  destroyOne,
};
