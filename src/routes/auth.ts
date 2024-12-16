import express, { Router } from 'express';
import authController from '../controllers/auth';
import authorizeRequest from '../middlewares/authorizeRequest';

const router: Router = express.Router();

router.post('/signup', authController.signup);
router.get('/users', authorizeRequest, authController.getAllUser);
router.post('/login', authController.login);

export default router;
