import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI;
let model: any;

export function initializeGemini(apiKey: string, baseUrl?: string, modelName?: string) {
  try {
    const config: any = {};
    if (baseUrl) {
      config.baseUrl = baseUrl;
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
    
    // The library allows overriding the base URL if needed by modifying the fetch function or using undocumented config.
    // Actually, @google/generative-ai doesn't natively expose a clean baseUrl override in the constructor for the public API,
    // but we can try to pass it if they support it, or we can just hope the user's proxy works.
    // Some proxies use the standard endpoint and intercept it, some require modifying the global fetch.
    
    model = genAI.getGenerativeModel(
      { model: modelName || 'gemini-1.5-flash' }, 
      baseUrl ? { baseUrl } : undefined
    );
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
If asked about food, navigation, or restrooms, provide helpful examples or logical directions based on typical stadium layouts.
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
  } catch (error: any) {
    console.error('Error generating response:', error);
    if (error.message?.includes('404')) {
        return 'API Error (404 Not Found): Your API key was accepted, but the selected model was not found for your account. If you are using a custom hackathon endpoint, please enter the correct Base URL and Model Name in the configuration.';
    }
    return 'Sorry, I am having trouble connecting. ' + (error.message || 'Please check your API key and try again.');
  }
}
