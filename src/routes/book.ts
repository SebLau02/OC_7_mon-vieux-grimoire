import express from "express";
import bookController from "../controllers/book";
import authorizeRequest from "../middlewares/authorizeRequest";
import upload from "../middlewares/multer";

const router = express.Router();

router.get("/", bookController.index);
router.get("/bestrating", bookController.bestRating);
router.get("/:id/rating", authorizeRequest, bookController.updateRating);
router.get("/:id", bookController.show);

router.post("/", authorizeRequest, upload, bookController.create);
router.delete("/", authorizeRequest, bookController.destroy);

export default router;
