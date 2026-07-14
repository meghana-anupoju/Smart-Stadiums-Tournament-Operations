const SYSTEM_INSTRUCTION = `
You are the official FIFA World Cup 2026 Smart Assistant. 
Your goal is to help fans navigate the stadiums, find facilities, translate local languages, and get real-time match information.
Be concise, polite, and helpful. Format your responses with clear spacing.
If asked about food, navigation, or restrooms, provide helpful examples or logical directions based on typical stadium layouts.
You must also act as a translator when requested.
`;

export function initializeGemini() {
  return true; // No initialization needed for keyless AI
}

export async function generateChatResponse(message: string, history: { role: string; parts: { text: string }[] }[]) {
  try {
    const formattedMessages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      { role: 'assistant', content: 'Understood. I am the FIFA World Cup 2026 Smart Assistant. How can I help you today?' },
      ...history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts[0].text
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formattedMessages,
        model: 'openai' // Routes to a fast, free LLM automatically
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.text();
    return data || "Sorry, I am having trouble connecting to the network right now.";
  } catch (error) {
    console.error('Error generating response:', error);
    return 'Sorry, the AI service is currently unavailable. Please try again later.';
  }
}
