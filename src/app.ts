import express, { Request, Response } from "express";
import webRouter from "./routers/index";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api", webRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        message: "NOT FOUND",
        code: 404,
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
