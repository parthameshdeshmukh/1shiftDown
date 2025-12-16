// FIX: Import Modality for image editing.
import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import type { NewCarFormData, NewCarRecommendation, UsedCarFormData, UsedCarListing } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- NEW CAR RECOMMENDATIONS ---

export const getNewCarRecommendations = async (formData: NewCarFormData): Promise<Omit<NewCarRecommendation, 'image'>[]> => {
  try {
    const response = await fetch('http://localhost:5000/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    return await response.json() as Omit<NewCarRecommendation, 'image'>[];
  } catch (error) {
    console.error("Error fetching new car recommendations:", error);
    throw new Error("Failed to generate new car recommendations.");
  }
};


// --- USED CAR LISTINGS ---

export const getUsedCarListings = async (formData: UsedCarFormData): Promise<Omit<UsedCarListing, 'image'>[]> => {
  try {
    const response = await fetch('http://localhost:5000/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    return await response.json() as Omit<UsedCarListing, 'image'>[];
  } catch (error) {
    console.error("Error fetching used car listings:", error);
    throw new Error("Failed to generate used car listings.");
  }
};

// Helper to determine car type from model name for better image prompts
export const inferCarTypeFromTitle = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (['virtus', 'slavia', 'verna', 'city', 'amaze', 'dzire', 'aura', 'camry'].some(sedan => lowerTitle.includes(sedan))) return 'Sedan';
  if (['baleno', 'swift', 'i20', 'altroz', 'tiago', 'glanza', 'celerio', 'ignis', 'wagon r', 'alto'].some(hatch => lowerTitle.includes(hatch))) return 'Hatchback';
  if (['carens', 'ertiga', 'xl6', 'triber'].some(muv => lowerTitle.includes(muv))) return 'MUV';
  if (['creta', 'seltos', 'harrier', 'nexon', 'thar', 'xuv700', 'punch', 'hector', 'ecosport', 'fortuner', 'innova', 'brezza', 'venue', 'kushaq', 'taigun', 'kiger', 'magnite', 'hyryder', 'grand vitara', 'exter', 'jimny', 'sonet', 'scorpio', 'bolero', 'compass', 'c3', 'safari', 'fronx', 'xuv300', 'xuv400'].some(suv => lowerTitle.includes(suv))) return 'SUV';
  if (lowerTitle.includes('suv')) return 'SUV';
  if (lowerTitle.includes('sedan')) return 'Sedan';
  if (lowerTitle.includes('hatchback')) return 'Hatchback';
  return 'car'; // Generic fallback
};


// --- CAR IMAGE GENERATION ---
export const generateCarImage = async (makeModel: string, variant: string, carType: string, year?: number): Promise<string> => {
  try {
    const response = await fetch('http://localhost:5000/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ makeModel, variant, carType, year, isListing: false }),
    });

    if (!response.ok) {
      console.error("Image generation failed:", response.statusText);
      return ""; // Fallback handled by frontend
    }

    const data = await response.json();
    return data.imageUrl;

  } catch (error) {
    console.error(`Error generating image for ${makeModel}:`, error);
    return "";
  }
};

// --- FOR LISTINGS PAGE IMAGE GENERATION ---

export const generateListingCarImage = async (carTitle: string, fuelType: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:5000/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ carTitle, fuelType, isListing: true }),
    });

    if (!response.ok) {
      console.error("Image generation failed:", response.statusText);
      return "";
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error(`Error generating image for ${carTitle}:`, error);
    return "";
  }
};


// --- CHAT BOT ---
export const startChat = (): Chat => {
  const chatAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return chatAI.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      tools: [{ googleSearch: {} }],
      // FIX: Moved `systemInstruction` inside the `config` object as per the API specification.
      systemInstruction: 'You are a helpful and knowledgeable car expert assistant for 1Shift Down. Answer user questions about cars, the automotive industry, and related topics. If asked about this website, explain its features like AI car recommendations, PDI services, and listings. Be concise and friendly.',
    },
  });
};

// FIX: Add the missing editImage function to handle image editing.
// --- IMAGE EDITING ---
export const editImage = async (prompt: string, imageDataBase64: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageDataBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error('No image data found in the response.');

  } catch (error) {
    console.error("Error editing image with Gemini API:", error);
    throw new Error("Failed to edit image.");
  }
};