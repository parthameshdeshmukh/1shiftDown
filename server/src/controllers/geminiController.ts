import { Request, Response } from 'express';
import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set in server");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Types (Mirrored from frontend types for now, ideally shared)
interface NewCarFormData {
    budget: number;
    brands: string[];
    model: string;
    fuelTypes: string[];
    transmission: string[];
    yearlyRunning: number;
    bodyTypes: string[];
    colors: string[];
    features: string[];
}

interface UsedCarFormData {
    price: [number, number];
    brands: string[];
    model: string;
    year: [number, number];
    fuelTypes: string[];
    transmission: string[];
    kmsDriven: number;
    ownerCount: string[];
    location: string;
    registrationState: string;
    features: string[];
}

// --- NEW CAR RECOMMENDATIONS ---

const generateNewCarPrompt = (formData: NewCarFormData): string => {
    return `
    You are an expert car consultant for the Indian new car market.
    Based on the following filters, suggest the top 3 best new car models in India.
    Be highly contextual. For high yearly running (>15,000 km), strongly consider diesel/hybrids/EVs. For low running, prioritize petrol, features, and cost.

    User Filters:
    - Budget: Up to ₹${formData.budget.toLocaleString('en-IN')}
    - Brands: ${formData.brands.length > 0 ? formData.brands.join(', ') : 'Any'}
    - Model: ${formData.model || 'Any'}
    - Fuel Type(s): ${formData.fuelTypes.length > 0 ? formData.fuelTypes.join(', ') : 'Any'}
    - Transmission: ${formData.transmission.length > 0 ? formData.transmission.join(', ') : 'Any'}
    - Yearly Running: ${formData.yearlyRunning.toLocaleString('en-IN')} km
    - Body Type(s): ${formData.bodyTypes.length > 0 ? formData.bodyTypes.join(', ') : 'Any'}
    - Color(s): ${formData.colors.length > 0 ? formData.colors.join(', ') : 'Any'}
    - Must-have Features: ${formData.features.length > 0 ? formData.features.join(', ') : 'None'}

    For each car, provide:
    1.  make/model and variant.
    2.  Estimated on-road price (in INR, formatted with "₹" and lakh/crore units).
    3.  Mileage.
    4.  Two compelling reasons referencing user needs.
    5.  An array of 2-3 top features/highlights.
    6.  A "match score" (0-100) of how well it fits ALL criteria.
    7.  A valid link to the manufacturer or a major car portal.
    8.  The primary fuel type (e.g., "Petrol", "Diesel", "Electric", "CNG").
    9.  The primary body type (e.g., "SUV", "Sedan", "Hatchback").
    
    Output a JSON array of objects. If no matches, return an empty array.
  `;
};

export const getNewCarRecommendations = async (req: Request, res: Response) => {
    try {
        const formData: NewCarFormData = req.body;
        const prompt = generateNewCarPrompt(formData);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            makeModel: { type: Type.STRING },
                            variant: { type: Type.STRING },
                            price: { type: Type.STRING },
                            mileage: { type: Type.STRING },
                            reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                            link: { type: Type.STRING },
                            topFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                            matchScore: { type: Type.NUMBER },
                            fuelType: { type: Type.STRING },
                            bodyType: { type: Type.STRING },
                        },
                        required: ['makeModel', 'variant', 'price', 'mileage', 'reasons', 'link', 'topFeatures', 'matchScore', 'fuelType', 'bodyType'],
                    },
                },
            },
        });

        const jsonStr = response.text ? response.text.trim() : "[]";
        res.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error("Error fetching new car recommendations:", error);
        res.status(500).json({ error: "Failed to generate new car recommendations." });
    }
};

// --- USED CAR LISTINGS ---

const generateUsedCarPrompt = (formData: UsedCarFormData): string => {
    return `
    You are a used car search aggregator for the Indian market.
    Find 3-5 real used car listings from platforms like Cars24, CarDekho, Spinny, and OLX based on these filters.
    If a filter is blank or has an empty array, consider all options for it. Be strict with the filters that are provided.
    It is critical that the listed price for every result falls strictly within the provided price range.

    User Filters:
    - Price Range (INR): ${formData.price[0]} to ${formData.price[1]}
    - Brands: ${formData.brands.length > 0 ? formData.brands.join(', ') : 'Any'}
    - Model: ${formData.model || 'Any'}
    - Year Range: ${formData.year[0]} to ${formData.year[1]}
    - Fuel Type(s): ${formData.fuelTypes.length > 0 ? formData.fuelTypes.join(', ') : 'Any'}
    - Transmission: ${formData.transmission.length > 0 ? formData.transmission.join(', ') : 'Any'}
    - Max Kilometers Driven: Up to ${formData.kmsDriven.toLocaleString('en-IN')} km
    - Owner Count: ${formData.ownerCount.length > 0 ? formData.ownerCount.join(', ') : 'Any'}
    - Location/City: ${formData.location || 'Any'}
    - Registration State: ${formData.registrationState || 'Any'}
    - Features: ${formData.features.length > 0 ? formData.features.join(', ') : 'Any'}

    For each listing, provide: make/model, variant, listed price (INR), platform, year, and kms driven.
    Also provide the primary fuel type, a strict "match score" (0-100%) of how well it fits ALL criteria, and a URL.
    The listed price for each car MUST be within the user's specified range.
    Output a JSON array of objects. Format price with "₹" and lakh/crore units. If no matches, return an empty array.
  `;
};

export const getUsedCarListings = async (req: Request, res: Response) => {
    try {
        const formData: UsedCarFormData = req.body;
        const prompt = generateUsedCarPrompt(formData);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            makeModel: { type: Type.STRING },
                            variant: { type: Type.STRING },
                            price: { type: Type.STRING },
                            platform: { type: Type.STRING },
                            year: { type: Type.INTEGER },
                            kmsDriven: { type: Type.STRING },
                            matchScore: { type: Type.NUMBER },
                            link: { type: Type.STRING },
                            fuelType: { type: Type.STRING },
                        },
                        required: ['makeModel', 'variant', 'price', 'platform', 'year', 'kmsDriven', 'matchScore', 'link', 'fuelType'],
                    },
                },
            },
        });

        const jsonStr = response.text ? response.text.trim() : "[]";
        res.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error("Error fetching used car listings:", error);
        res.status(500).json({ error: "Failed to generate used car listings." });
    }
};


// --- CAR IMAGE GENERATION ---
export const generateCarImage = async (req: Request, res: Response) => {
    try {
        const { makeModel, variant, carType, year, carTitle, fuelType, isListing } = req.body;

        let prompt = "";

        if (isListing) {
            // Listing Logic
            const getCarTypeFromTitle = (title: string): string => {
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

            const type = getCarTypeFromTitle(carTitle);
            let backgroundPrompt = "daylight, in a modern city setting.";

            switch (type) {
                case 'SUV':
                    backgroundPrompt = "on a clean city road with a slightly elevated view, showing its SUV stance.";
                    break;
                case 'Sedan':
                    backgroundPrompt = "on a premium showroom floor with elegant posture and studio lighting.";
                    break;
                case 'Hatchback':
                    backgroundPrompt = "parked in a modern driveway with soft, natural lighting.";
                    break;
            }
            if (fuelType && fuelType.toLowerCase() === 'electric') {
                backgroundPrompt = "in a futuristic setting with soft, ambient lighting.";
            }

            prompt = `Generate a high-quality, photo-realistic front three-quarter view image of a ${carTitle}. The car should be placed ${backgroundPrompt} The image must be professional and suitable for a car listings website.`;

        } else {
            // Recommendation Logic
            const currentYear = new Date().getFullYear();
            const carYear = year || currentYear;

            let backgroundPrompt = "showroom background, premium lighting, ¾ front angle."; // default
            const carTypeLower = carType ? carType.toLowerCase() : 'car';

            if (carTypeLower.includes('suv')) {
                backgroundPrompt = "with an SUV stance, in a realistic showroom with studio lighting, ¾ front angle.";
            } else if (carTypeLower.includes('sedan')) {
                backgroundPrompt = "with a sedan style, on a premium showroom floor with daylight reflection, ¾ front angle.";
            } else if (carTypeLower.includes('hatchback')) {
                backgroundPrompt = "in a modern city driveway with soft, natural lighting, ¾ front angle.";
            }

            if (makeModel.toLowerCase().includes('ev') || variant.toLowerCase().includes('ev')) {
                backgroundPrompt = "in a futuristic setting with soft, ambient lighting, ¾ front angle.";
            }

            prompt = `Generate a realistic image of a ${carYear} ${makeModel} ${variant}, ${backgroundPrompt}`;
        }


        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    res.json({ imageUrl: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` });
                    return;
                }
            }
        }
        res.status(500).json({ error: 'No image data found in the response.' });

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Failed to generate image." });
    }
}
