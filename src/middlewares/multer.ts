import multer, { StorageEngine } from 'multer';
import { Request } from 'express';

const MIME_TYPES: { [key: string]: string } = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback) => {
    callback(null, 'images');
  },
  filename: (req: Request, file: Express.Multer.File, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
});

const upload = multer({ storage: storage }).single('image');

export default upload;
