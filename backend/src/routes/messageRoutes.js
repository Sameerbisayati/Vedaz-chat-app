import express from "express";
import {
  fetchMessages,
  sendMessage
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/", fetchMessages);
router.post("/", sendMessage);

export default router;