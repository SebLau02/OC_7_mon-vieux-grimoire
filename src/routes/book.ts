import express from 'express';
import bookController from '../controllers/book';
import authorizeRequest from '../middlewares/authorizeRequest';
import { upload, resizeAndConvertImage } from '../middlewares/multer';

const router = express.Router();

router.get('/', bookController.index);
router.get('/bestrating', bookController.bestRating);
router.post('/:id/rating', authorizeRequest, bookController.updateRating);
router.get('/:id', bookController.show);

router.post(
  '/',
  authorizeRequest,
  upload,
  resizeAndConvertImage,
  bookController.create,
);
router.delete('/', authorizeRequest, bookController.destroy);
router.delete('/:id', authorizeRequest, bookController.destroyOne);
router.put('/:id', authorizeRequest, upload, resizeAndConvertImage, bookController.updateBook);

export default router;
