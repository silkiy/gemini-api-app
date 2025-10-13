import { Request, Response } from "express";
import { geminiModel} from "../config/gemini";


export const chatController = async (req: Request, res: Response) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({
            status: "error",
            message: "Prompt is required",
        });
    }

    try {
        const result = await geminiModel.invoke(prompt);

        let responseText = "";

        if (typeof result === "string") {
            responseText = result;
        } else if (result && typeof result === "object" && "text" in result) {
            responseText = (result as { text: string }).text;
        } else {
            responseText = "Unexpected response format from Gemini model.";
        }

        res.json({
            status: "success",
            response: responseText,
        });

    } catch (error) {
        console.error("Error in chatController:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};