import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
// @ts-ignore
import streamifier from 'streamifier';

// Configurer Cloudinary
cloudinary.config({
  cloud_name: 'dw7tgqocy', // Remplace par ton cloud name
  api_key: '537182271922579', // Remplace par ta clé API
  api_secret: 'vzFObYPL__GdZHJkooosw72vHxs', // Remplace par ton secret API
});

// Définir un filtre pour n'accepter que les images
const filter: (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => void = (req, file, callback) => {
  if (file.mimetype.split('/')[0] === 'image') {
    callback(null, true); // Accepte le fichier
  } else {
    callback(new Error('Seuls les fichiers image sont autorisés.'));
  }
};

// Configurer multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

const upload: RequestHandler = multer({
  storage,
  fileFilter: filter,
}).single('image'); // Assurez-vous que le champ du formulaire est nommé 'image'

// Middleware pour redimensionner, convertir et uploader l'image
const resizeAndUploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    return next(); // Passez au middleware suivant si aucun fichier n'est présent
  }

  try {
    // Redimensionner et convertir l'image en buffer
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 400 }) // Redimensionner à 400px de large
      .toFormat('webp') // Convertir en format webp
      .toBuffer(); // Convertir en buffer pour uploader sur Cloudinary

    // Uploader l'image sur Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mes-images', // Optionnel : spécifie un dossier
        format: 'webp', // Optionnel : force le format webp
      },
      (error, result) => {
        if (error) {
          console.error("Erreur lors de l'upload vers Cloudinary :", error);
          return res
            .status(500)
            .json({ error: "Erreur lors de l'upload de l'image" });
        }
        if (req.file && result) {
          // Ajouter l'URL publique à la requête pour l'utiliser dans les middlewares suivants
          req.file.path = result.secure_url;
        }
        next();
      },
    );

    // Convertir le buffer en stream et l'envoyer à Cloudinary
    streamifier.createReadStream(buffer).pipe(uploadStream);
  } catch (error) {
    console.error(
      "Erreur lors du redimensionnement et de l'upload de l'image :",
      error,
    );
    res.status(500).json({ error: "Erreur lors du traitement de l'image" });
  }
};

export { upload, resizeAndUploadImage };
