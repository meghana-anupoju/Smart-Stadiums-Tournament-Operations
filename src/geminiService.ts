import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI;
let model: any;

export function initializeGemini(apiKey: string) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
    return false;
  }
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
    return 'Error: Gemini API not initialized. Please provide your API key first.';
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
    return 'Sorry, I am having trouble connecting to the network right now. Please check your API key and try again.';
  }
}
