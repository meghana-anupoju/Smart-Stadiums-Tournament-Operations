import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let genAI: GoogleGenerativeAI;
let model: any;

try {
  genAI = new GoogleGenerativeAI(API_KEY || '');
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
}

const SYSTEM_INSTRUCTION = `
You are the official FIFA World Cup 2026 Smart Assistant. 
Your goal is to help fans navigate the stadiums, find facilities, translate local languages, and get real-time match information.
Be concise, polite, and helpful. Format your responses with clear spacing.
If asked about food, navigation, or restrooms, provide helpful examples or logical directions based on typical stadium layouts (since you are an AI, provide a plausible fictional but logical answer for specific stadiums if real-time data is unavailable).
You must also act as a translator when requested.
`;

export async function generateChatResponse(message: string, history: { role: string; parts: { text: string }[] }[]) {
  if (!model) {
    return 'Error: Gemini API not initialized properly. Please check your API key.';
  }

  try {
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
        { role: 'model', parts: [{ text: 'Understood. I am the FIFA World Cup 2026 Smart Assistant. How can I help you today?' }] },
        ...history
      ]
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Sorry, I am having trouble connecting to the network right now. Please try again later.';
  }
}
