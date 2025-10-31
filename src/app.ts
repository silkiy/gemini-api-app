import express, { Request, Response } from "express";
import webRouter from "./routers/index";
import { parse } from "url";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (
                origin.startsWith("chrome-extension://") ||
                origin.startsWith("http://localhost") ||
                origin === "https://gist-ai.vercel.app"
            ) {
                return callback(null, true);
            }

            return callback(new Error("CORS not allowed for this origin"));
        },
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type"],
    })
);

app.use(express.json({ limit: "20mb" }));

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