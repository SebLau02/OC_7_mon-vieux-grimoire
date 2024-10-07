import express from "express";
import authController from "../controllers/auth";

const router = express.Router();

router.post("/signup", authController.signup);
router.get("/users", authController.getAllUser);
router.post("/login", authController.login);

export default router;
