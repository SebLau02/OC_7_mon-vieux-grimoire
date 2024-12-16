import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Définir un filtre pour n'accepter que les images
const filter: (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => void = (req, file, callback) => {
  if (file.mimetype.split('/')[0] === 'image') {
    callback(null, true); // Accepte le fichier
  }
};

// Configurer multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

const upload: RequestHandler = multer({
  storage,
  fileFilter: filter,
}).single('image'); // Assurez-vous que le champ du formulaire est nommé 'image'

// Middleware pour redimensionner et convertir l'image
const resizeAndConvertImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    return next(); // Passez au middleware suivant si aucun fichier n'est présent
  }

  const outputFilePath = path.join('images', `${Date.now()}_output.webp`); // Chemin de sortie pour le fichier webp

  try {
    await sharp(req.file.buffer) // Utilisez le buffer d'image de multer
      .resize({ width: 400 }) // Redimensionner à 400px de large
      .toFormat('webp') // Convertir en format webp
      .toFile(outputFilePath); // Enregistrer le fichier sur disque

    // Optionnel: Supprimer le fichier original si nécessaire
    req.file.path = outputFilePath; // Mettre à jour le chemin de l'image dans la requête
    req.file.filename = path.basename(outputFilePath); // Mettre à jour le nom du fichier dans la requête

    next(); // Passez au middleware suivant
  } catch (error) {
    console.error(
      "Erreur lors du redimensionnement et de la conversion de l'image:",
      error,
    );
    res.status(500).json({ error: "Erreur lors du traitement de l'image" });
  }
};

export { upload, resizeAndConvertImage };
