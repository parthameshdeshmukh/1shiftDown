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
        console.log("2.0 flash success", res.text);
    } catch (e: any) {
        console.error("2.0 flash err:", e.message);
    }

    try {
        const res = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: "hello",
        });
        console.log("1.5 flash success", res.text);
    } catch (e: any) {
        console.error("1.5 flash err:", e.message);
    }
}
test();
