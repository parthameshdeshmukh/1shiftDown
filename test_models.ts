import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

const ai = new GoogleGenAI({});

async function getModels() {
    try {
        const response = await ai.models.list();
        for await (const model of response) {
            console.log(model.name);
        }
    } catch(e) {
        console.error(e);
    }
}
getModels();
