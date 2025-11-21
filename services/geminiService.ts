import { GoogleGenAI, Type } from "@google/genai";
import { PartData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchPartBySKU = async (sku: string): Promise<PartData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User is searching for a spare part with SKU: "${sku}". 
      Act as a comprehensive automotive and industrial spare parts database.
      If the SKU looks random, invent a plausible high-tech mechanical part.
      Return the data in JSON format containing the name, category, price, stock status, technical description, compatibility list, and physical specs.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sku: { type: Type.STRING },
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            price: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            inStock: { type: Type.BOOLEAN },
            stockCount: { type: Type.INTEGER },
            description: { type: Type.STRING },
            compatibility: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            specifications: {
              type: Type.OBJECT,
              properties: {
                weight: { type: Type.STRING },
                dimensions: { type: Type.STRING },
                material: { type: Type.STRING },
              }
            }
          },
          required: ["sku", "name", "price", "description", "inStock"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No data returned from AI");
    }

    return JSON.parse(text) as PartData;
  } catch (error) {
    console.error("Error fetching part data:", error);
    throw error;
  }
};