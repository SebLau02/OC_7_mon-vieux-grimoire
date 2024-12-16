"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeAndConvertImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
// Définir un filtre pour n'accepter que les images
const filter = (req, file, callback) => {
    if (file.mimetype.split('/')[0] === 'image') {
        callback(null, true); // Accepte le fichier
    }
};
// Configurer multer pour stocker les fichiers en mémoire
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    fileFilter: filter,
}).single('image'); // Assurez-vous que le champ du formulaire est nommé 'image'
exports.upload = upload;
// Middleware pour redimensionner et convertir l'image
const resizeAndConvertImage = async (req, res, next) => {
    if (!req.file) {
        return next(); // Passez au middleware suivant si aucun fichier n'est présent
    }
    const outputFilePath = path_1.default.join('images', `${Date.now()}_output.webp`); // Chemin de sortie pour le fichier webp
    try {
        await (0, sharp_1.default)(req.file.buffer) // Utilisez le buffer d'image de multer
            .resize({ width: 400 }) // Redimensionner à 400px de large
            .toFormat('webp') // Convertir en format webp
            .toFile(outputFilePath); // Enregistrer le fichier sur disque
        // Optionnel: Supprimer le fichier original si nécessaire
        req.file.path = outputFilePath; // Mettre à jour le chemin de l'image dans la requête
        req.file.filename = path_1.default.basename(outputFilePath); // Mettre à jour le nom du fichier dans la requête
        next(); // Passez au middleware suivant
    }
    catch (error) {
        console.error("Erreur lors du redimensionnement et de la conversion de l'image:", error);
        res.status(500).json({ error: "Erreur lors du traitement de l'image" });
    }
};
exports.resizeAndConvertImage = resizeAndConvertImage;
//# sourceMappingURL=multer.js.map