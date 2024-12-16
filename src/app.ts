import express, { Request, Response, NextFunction, Express } from 'express';
const mongoose = require('mongoose');
const app: Express = express();
import authRoutes from './routes/auth';
import bookRoutes from './routes/book';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// mongoose.connect(
//   'mongodb+srv://OCR_P7:dSiBGFPe1bhVNMGY@cluster0.je84pvt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
// );
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, '../images')));

export default app;
