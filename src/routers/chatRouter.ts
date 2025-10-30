import { Router } from "express";
import { chatController, summarizeNewsController } from "../controllers/chatControllers";

const router = Router();


router.post("/chat", chatController);
router.post("/summarize", summarizeNewsController);

export default router;