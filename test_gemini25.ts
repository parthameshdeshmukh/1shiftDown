import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

const ai = new GoogleGenAI({});

async function test() {
    try {
        const res = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: "hello",
        });
        console.log("2.0-flash success", res.text);
    } catch (e: any) {
        console.error("2.0-flash err:", e.message);
    }

    try {
        const res = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: "hello",
        });
        console.log("flash-latest success", res.text);
    } catch (e: any) {
        console.error("flash-latest err:", e.message);
    }
}
test();
