import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * The system instruction defining the AI's role and capabilities for the FIFA 2026 World Cup.
 */
const SYSTEM_INSTRUCTION = `
You are the official FIFA World Cup 2026 Smart Assistant. 
Your goal is to help fans navigate the stadiums, find facilities, translate local languages, and get real-time match information.
You must assist with:
- Navigation: Guide fans to their seats, gates, and facilities.
- Crowd Management: Provide updates on gate wait times and crowded areas.
- Translation: Act as a real-time multilingual translator.
- Sustainability: Educate fans on recycling bins, sustainable transport, and green initiatives.
Be concise, polite, and helpful. Format your responses with clear spacing.
`;

export let genAI: GoogleGenerativeAI | null = null;

/**
 * Resets the Gemini instance for testing purposes.
 */
export function resetGemini() {
  genAI = null;
}

/**
 * Initializes the Gemini API using the provided key or secure environment variable.
 * @param {string} [dynamicKey] - Optional API key provided by the user via UI.
 * @returns {boolean} True if initialized successfully, false otherwise.
 */
export function initializeGemini(dynamicKey?: string): boolean {
  try {
    const apiKey = dynamicKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY is not set in environment variables and no key was provided.');
      return false;
    }
    genAI = new GoogleGenerativeAI(apiKey);
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
    return false;
  }
}

/**
 * Generates a response from the AI model based on the chat history and new message.
 * @param {string} message - The new user message.
 * @param {Array<{role: string, parts: {text: string}[]}>} history - The previous chat history.
 * @returns {Promise<string>} The generated response text.
 */
export async function generateChatResponse(message: string, history: { role: string; parts: { text: string }[] }[]): Promise<string> {
  if (!genAI) {
    const initialized = initializeGemini();
    if (!initialized) {
      return 'Error: Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.';
    }
  }

  try {
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
    return 'Sorry, I am having trouble connecting. ' + (error.message || 'Please try again.');
  }
}
