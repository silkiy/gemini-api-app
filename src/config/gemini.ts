import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import dotenv from "dotenv";
dotenv.config();

export const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY!,
});
