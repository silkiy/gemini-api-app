import { Router } from "express";
import { chatController, summarizeNewsController, analyzeImageController } from "../controllers/chatControllers";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/chat", chatController);
router.post("/summarize", summarizeNewsController);
router.post("/analyze-image", upload.single("image"), analyzeImageController);

export default router;