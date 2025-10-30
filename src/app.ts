import express, { Request, Response } from "express";
import webRouter from "./routers/index";
import { parse } from "url";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api", webRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        message: "NOT FOUND",
        code: 404,
    });
});

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

else if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default function handler(req: any, res: any) {
    const parsedUrl = parse(req.url!, true);
    req.query = parsedUrl.query;
    app(req as any, res as any);
}