"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const book_1 = __importDefault(require("../models/book"));
const cloudinary_1 = require("cloudinary");
const create = async (req, res, next) => {
    try {
        let book = JSON.parse(req.body.book);
        let imageFile = '';
        let userId = '';
        if (req.file) {
            imageFile = req.file.path;
        }
        if (req.auth) {
            userId = req.auth.userId;
        }
        const newBook = new book_1.default({
            ...book,
            userId: userId,
            ratings: [{ ...book.ratings[0], userId: userId }],
            imageUrl: imageFile,
        });
        await newBook.save();
        res.status(201).json({ message: 'Livre crée avec succès' });
    }
    catch (error) {
        res.status(400).json({
            error: error || 'Erreur lors de la création du livre',
        });
    }
};
const destroy = async (req, res, next) => {
    try {
        const response = await book_1.default.deleteMany();
        if ((response.acknowledged = true)) {
            res.status(200).json({ message: 'Tout les livres on été détruits' });
        }
    }
    catch (error) {
        res.status(200).json({ error: error || "une erreurs s'est produite" });
    }
};
const destroyOne = async (req, res, next) => {
    try {
        const { id } = req.params;
        let currentUserId = '';
        if (req.auth) {
            currentUserId = req.auth.userId;
        }
        const response = await book_1.default.findOneAndDelete({
            _id: id,
            userId: currentUserId,
        }); //  on récupère le livre où les champs id et userId correspondent à ceux fourni si non error
        if (response) {
            // Extraire le public_id de l'URL Cloudinary
            const imageUrl = response.imageUrl; // URL stockée dans la base de données
            const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0]; // Ex : "mes-images/<public_id>"
            // Supprimer l'image sur Cloudinary
            cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    console.error("Erreur lors de la suppression de l'image Cloudinary :", error);
                }
                else {
                    console.log('Image Cloudinary supprimée avec succès :', result);
                }
            });
            res
                .status(200)
                .json({ message: 'Livre supprimé avec succès', title: response.title });
        }
        else {
            res.status(401).json({
                message: "Vous n'êtes pas authorisé à éxécuter cette action",
            });
        }
    }
    catch (error) {
        res.status(200).json({ error: error || "une erreurs s'est produite" });
    }
};
const index = async (req, res, next) => {
    try {
        const books = await book_1.default.find();
        if (books) {
            res.status(200).json(books);
        }
    }
    catch (error) {
        res.status(200).json({ error: error || "une erreurs s'est produite" });
    }
};
const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await book_1.default.findOne({ _id: id });
        if (book) {
            res.status(200).json(book);
        }
        else {
            res.status(400).json({ message: "Aucun livre n'a été trouvé" });
        }
    }
    catch (error) {
        res.status(200).json({ error: error || "une erreurs s'est produite" });
    }
};
const bestRating = async (req, res, next) => {
    try {
        const books = await book_1.default.find();
        const bestBooks = books
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 3);
        if (bestBooks) {
            res.status(200).json(bestBooks);
        }
        else {
            res.status(200).json({ message: "Aucun livre n'a été trouvé" });
        }
    }
    catch (error) {
        res.status(200).json({ error: error || "une erreurs s'est produite" });
    }
};
const updateRating = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rating = req.body.rating > 5 ? 5 : req.body.rating < 0 ? 0 : req.body.rating;
        let book = await book_1.default.findOne({ _id: id });
        let userId = '';
        if (req.auth) {
            userId = req.auth.userId;
        }
        // si le livre existe
        if (book) {
            // si l'utilisateur n'a pas déjà évalué le livre
            if (!book.ratings.find((r) => r.userId === userId)) {
                const updatedBook = await book_1.default.findOneAndUpdate({ _id: id }, { $push: { ratings: { userId, grade: rating } } }, { runValidators: true, new: true });
                if (updatedBook) {
                    const totalRatings = updatedBook.ratings.length;
                    const sumOfRatings = updatedBook.ratings.reduce((acc, curr) => acc + curr.grade, 0);
                    const averageRating = sumOfRatings / totalRatings;
                    const ratedBook = await book_1.default.findOneAndUpdate({ _id: id }, { averageRating: averageRating }, { new: true });
                    if (updatedBook && ratedBook) {
                        res.status(200).json(ratedBook);
                    }
                    else {
                        res.status(200).json({ message: "Aucun livre n'a été trouvé" });
                    }
                }
            }
            else {
                res.status(400).json({ message: 'Vous avez déjà évalué ce livre.' });
            }
        }
        else {
            res.status(404).json({ message: "Ce livre n'existe plus." });
        }
    }
    catch (error) {
        res.status(200).json({ error: error || "une erreurs s'est produite" });
    }
};
const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        let book = await book_1.default.findOne({ _id: id });
        let currentUser = '';
        if (req.auth) {
            currentUser = req.auth.userId;
        }
        if (book) {
            if (book.userId === currentUser) {
                const { title, author, year, genre } = req.body;
                let imageUrl = '';
                if (req.file) {
                    imageUrl = req.file.path;
                }
                const updatingBook = imageUrl !== ''
                    ? { title, author, year, genre, imageUrl }
                    : { title, author, year, genre };
                const updatedBook = await book_1.default.findByIdAndUpdate(id, updatingBook, {
                    new: true,
                });
                if (!updatedBook) {
                    res.status(404).json({
                        message: 'Une erreure est survenue lors de la mis à jours du livre',
                        error: updatedBook,
                    });
                }
                else {
                    if (imageUrl !== '') {
                        // Extraire le public_id de l'URL Cloudinary
                        const oldImageUrl = book.imageUrl; // URL stockée dans la base de données
                        const publicId = oldImageUrl
                            .split('/')
                            .slice(-2)
                            .join('/')
                            .split('.')[0]; // Ex : "mes-images/<public_id>"
                        // Supprimer l'image sur Cloudinary
                        cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
                            if (error) {
                                console.error("Erreur lors de la suppression de l'image Cloudinary :", error);
                            }
                            else {
                                console.log('Image Cloudinary supprimée avec succès :', result);
                            }
                        });
                    }
                    res.status(200).json(updatedBook);
                }
            }
        }
        else {
            res.status(404).json({ message: 'Livre non trouvé.' });
        }
    }
    catch (error) {
        res.status(400).json({ error: error || "une erreurs s'est produite" });
    }
};
exports.default = {
    create,
    destroy,
    index,
    show,
    bestRating,
    updateRating,
    updateBook,
    destroyOne,
};
//# sourceMappingURL=book.js.map