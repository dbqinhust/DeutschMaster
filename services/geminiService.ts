
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GermanWord, WordType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIAssistedWord = async (input: string): Promise<Partial<GermanWord>> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the following word/phrase into German and provide linguistic context: "${input}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          german: { type: Type.STRING },
          english: { type: Type.STRING },
          type: { type: Type.STRING, enum: Object.values(WordType) },
          gender: { type: Type.STRING, enum: ['der', 'die', 'das', 'none'] },
          exampleSentence: { type: Type.STRING },
          exampleTranslation: { type: Type.STRING },
        },
        required: ['german', 'english', 'type', 'exampleSentence', 'exampleTranslation']
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  if (data.gender === 'none') delete data.gender;
  return data;
};

export const playGermanTTS = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak naturally in German: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decodedData = decode(base64Audio);
      const audioBuffer = await decodeAudioData(decodedData, audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
};

// Decoding helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
