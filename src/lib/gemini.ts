import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MeditationDraft {
  title: string;
  visualPrompt: string;
  script: string;
}

export type VoiceName = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';

export async function generateMeditationDraft(
  topic: string,
  durationMinutes: number
): Promise<MeditationDraft> {
  const prompt = `Create a calming, guided meditation script.
Topic: ${topic}
Approximate Duration: ${durationMinutes} minutes.

Instructions:
1. Provide a beautiful, calming title.
2. Provide a 'visualPrompt'. This should be a highly detailed, photorealistic prompt for an AI image generator to create a serene, atmospheric background image that perfectly matches the mood of this meditation (e.g. "A serene mountain landscape at golden hour with snow-capped peaks reflected in a still alpine lake, photorealistic").
3. Provide the 'script'. This is the spoken text. Write it with a calming, slow pace in mind. Use short sentences. Add ellipses (...) to indicate pauses. Make sure the length roughly corresponds to ${durationMinutes} minutes of slow speaking (about 100-130 words per minute).`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the meditation" },
          visualPrompt: { type: Type.STRING, description: "Prompt for image generation" },
          script: { type: Type.STRING, description: "Spoken meditation script" },
        },
        required: ["title", "visualPrompt", "script"],
      },
    },
  });

  const jsonStr = response.text || "";
  try {
    return JSON.parse(jsonStr) as MeditationDraft;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to generate meditation draft.");
  }
}

export async function generateImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt + ", beautiful, highly detailed, photorealistic, cinematic lighting, 4k resolution",
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType || 'image/png'};base64,${base64EncodeString}`;
    }
  }
  throw new Error("No image data found in response");
}

export async function generateAudio(script: string, voice: VoiceName): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: [{ parts: [{ text: script }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
      return `data:${part.inlineData.mimeType || 'audio/wav'};base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No audio data found in response");
}
