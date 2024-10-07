import express from "express";
import bookController from "../controllers/book";
import authorizeRequest from "../middlewares/authorizeRequest";
import upload from "../middlewares/multer";

const router = express.Router();

router.post("/", authorizeRequest, upload, bookController.create);

export default router;
