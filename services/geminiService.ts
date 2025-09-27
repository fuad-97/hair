import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedImage, StyleOptions, Gender } from '../types';
import { BEARD_STYLES, HAIR_LENGTH, HAIR_TEXTURE } from "../constants";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  const base64Data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };
};

const createPromptVariations = (options: StyleOptions, gender: Gender): { id: string, description: string }[] => {
    const hairTexture = options.hairTexture || HAIR_TEXTURE[0];
    const hairLength = options.hairLength || HAIR_LENGTH[2];
    const beardStyle = options.beardStyle || (gender === 'male' ? BEARD_STYLES[0] : '');

    if (gender === 'female') {
        return [
            { id: 'f_style1', description: `a straight, ${hairLength} hairstyle with a ${hairTexture} texture.` },
            { id: 'f_style2', description: `a wavy, ${hairLength} hairstyle with a ${hairTexture} texture.` },
            { id: 'f_style3', description: `an elegant updo suitable for ${hairLength}, ${hairTexture} hair.` },
            { id: 'f_style4', description: `a stylish bob cut that would work for ${hairTexture} hair.` },
        ];
    } else { // male
         return [
            { id: 'm_style1', description: `a classic short haircut with ${hairTexture} texture and ${beardStyle}.` },
            { id: 'm_style2', description: `a modern, ${hairLength} haircut with ${hairTexture} texture, styled casually, and with ${beardStyle}.` },
            { id: 'm_style3', description: `a professional, slicked-back ${hairLength} hairstyle with ${hairTexture} texture, complemented by ${beardStyle}.` },
            { id: 'm_style4', description: `a trendy undercut hairstyle for ${hairLength}, ${hairTexture} hair, with ${beardStyle}.` },
        ];
    }
}

export const generateStyleVariations = async (
  imageFile: File,
  options: StyleOptions,
  gender: Gender,
): Promise<GeneratedImage[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = await fileToGenerativePart(imageFile);
  
  const stylesToGenerate = createPromptVariations(options, gender);

  const generationPromises = stylesToGenerate.map(async (style) => {
    const prompt = `Based on the person in the image, edit their photo to give them a new look. The new style is: ${style.description}. Ensure the result is highly realistic, maintaining the original person's facial features, skin tone, and the background. The new hair should blend seamlessly.`;
    const textPart = { text: prompt };
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
          return { src: imageUrl, prompt: prompt, id: style.id };
        }
      }
      return null;
    } catch (error) {
      console.error(`Error generating style for prompt: ${prompt}`, error);
      return null;
    }
  });

  const results = await Promise.all(generationPromises);
  
  const successfulResults = results.filter((r): r is GeneratedImage => r !== null);

  if (successfulResults.length === 0) {
      throw new Error("The AI was unable to generate any styles. Please try a different image or options.");
  }

  return successfulResults;
};