import { Router } from "express";
import multer from "multer";
import { chatController } from "../controllers/chatControllers";

const router = Router();


router.post("/chat", chatController);

export default router;