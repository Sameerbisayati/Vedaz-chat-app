import express from "express";
import { login } from "../controllers/authController.js";
import upload from "../config/upload.js";

const router = express.Router();

router.post(
  "/login",
  upload.single("profilePhoto"),
  login
);

export default router;