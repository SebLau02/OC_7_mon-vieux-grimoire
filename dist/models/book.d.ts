import mongoose, { Document } from "mongoose";
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
declare const Book: mongoose.Model<IBook, {}, {}, {}, mongoose.Document<unknown, {}, IBook> & IBook & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Book;
