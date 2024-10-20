import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface IBook extends Document {
  userId: String;
  title: string;
  author: string;
  imageUrl: string;
  year: number;
  genre: string;
  ratings: Array<Rating>;
  averageRating: number;
}
interface Rating {
  userId: string;
  grade: number;
}

const ratingSchema = new Schema<Rating>({
  userId: { type: String, required: true },
  grade: { type: Number, required: true },
});

const bookSchema = new Schema<IBook>({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  ratings: {
    type: [ratingSchema],
    default: [],
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0,
    required: true,
  },
});

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
