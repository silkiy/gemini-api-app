import { Request, Response } from "express";
import axios from "axios";
import { geminiModel } from "../config/gemini";
import fs from "fs";

const isRelatedToNews = (question: string) => {
    const keywords = [
        "berita",
        "artikel",
        "pernyataan",
        "kejadian",
        "peristiwa",
        "ringkasan",
        "tokoh",
        "dampak",
        "isu",
    ];
    return keywords.some((word) => question.toLowerCase().includes(word));
};

const summarizeFromUrl = async (url: string) => {
    const { data } = await axios.get(url, { timeout: 8000 });
    const textOnly = data
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const prompt = `
    Ringkas berita berikut secara objektif.
      Jangan gunakan kata pembuka seperti "Tentu", "Baik", atau "Berikut".
      Langsung mulai dengan isi ringkasan.
    ${textOnly.slice(0, 7000)}
  `;

    const result = await geminiModel.invoke(prompt);
    if (typeof result === "string") return result;
    if (result && typeof result === "object" && "text" in result)
        return (result as { text: string }).text;

    return "Unexpected response format.";
};

export const chatController = async (req: Request, res: Response) => {
    const { prompt, newsSummary } = req.body;

    if (!prompt) {
        return res.status(400).json({
            status: "error",
            message: "Prompt is required",
        });
    }

    try {
        let chatPrompt = "";
        const related = isRelatedToNews(prompt);

        if (newsSummary && related) {
            chatPrompt = `
      Berikut ringkasan berita:
      ${newsSummary}
      
      Jawab pertanyaan berikut berdasarkan berita di atas:
      ${prompt}
      `;
        } else {
            chatPrompt = prompt;
        }

        const result = await geminiModel.invoke(chatPrompt);

        let responseText = "";
        if (typeof result === "string") responseText = result;
        else if (result && typeof result === "object" && "text" in result)
            responseText = (result as { text: string }).text;
        else responseText = "Unexpected response format.";

        res.json({
            status: "success",
            response: responseText.trim(),
            usedContext: !!newsSummary && related,
        });
    } catch (error) {
        console.error("Error in chatController:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export const summarizeNewsController = async (req: Request, res: Response) => {
    const { articleUrl} = req.body;

    if (!articleUrl) {
        return res.status(400).json({
            status: "error",
            message: "Article URL is required",
        });
    }

    try {
        const summary = await summarizeFromUrl(articleUrl);

        res.json({
            status: "success",
            summary,
        });
    } catch (error) {
        console.error("Error in summarizeNewsController:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to summarize news",
        });
    }
};

export const analyzeImageController = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({
            status: "error",
            message: "No image uploaded",
        });
    }

    try {
        const imageBase64 = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;

        const prompt = "Analisis gambar berikut dan jelaskan isinya secara singkat dalam bahasa Indonesia.";

        const result = await geminiModel.invoke([
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    {
                        type: "image_url",
                        image_url: `data:${mimeType};base64,${imageBase64}`,
                    },
                ],
            },
        ]);

        let analysisText = "";
        if (typeof result === "string") analysisText = result;
        else if (result && typeof result === "object" && "text" in result)
            analysisText = (result as { text: string }).text;
        else analysisText = "Model tidak memberikan respon yang valid.";

        res.json({
            status: "success",
            analysis: analysisText,
        });
    } catch (error) {
        console.error("Error in analyzeImageController:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to analyze image",
        });
    }
};
