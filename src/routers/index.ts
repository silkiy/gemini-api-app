import * as express from "express";

import chatRouter from "./chatRouter";

const router = express.Router();

router.use("/chat", chatRouter);

export default router;