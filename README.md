# FIFA World Cup 2026 GenAI Smart Assistant

A highly capable, GenAI-powered smart assistant designed to enhance the stadium experience for fans during the FIFA World Cup 2026. This web application provides multilingual assistance, navigation, and real-time operational information using a beautiful, responsive, and accessible interface.

## Challenge Vertical: Multilingual Assistance and Navigation for Fans

This project addresses the challenge of navigating massive World Cup stadiums, ordering food, locating specific gates, and overcoming language barriers. The **GenAI Smart Assistant** leverages Google's advanced LLMs (Gemini API) to contextually answer queries, act as an immediate translator, and intelligently guess stadium layouts if exact metadata is missing. 

### Approach and Logic

1. **User Persona**: A football fan who might speak a different language than the host nation and needs help finding amenities, or just wants to know "How to get to Gate 4".
2. **Logic & Flow**:
   - The fan accesses the web app on their mobile device.
   - The UI uses premium Glassmorphism and Neon highlights (fitting the World Cup 2026 aesthetic).
   - The fan types a question in natural language (e.g., "Where are the bathrooms?").
   - A secure system prompt is injected alongside the user's query and sent to the **Gemini 1.5 Flash Model**.
   - The model parses the context (being the official World Cup assistant) and returns a concise, polite, and helpful response.
   - The response is displayed dynamically with micro-animations.

### How it Works

The application is built using a modern, robust stack designed for maximum performance, maintainability, and code quality:
- **Frontend**: Vite + React (TypeScript) for a lightning-fast development cycle and strict typing.
- **Styling**: Vanilla CSS with custom properties for rich dark-mode aesthetics, removing the bulk of large CSS frameworks to keep the repository tiny (under 10MB).
- **GenAI**: `@google/generative-ai` SDK connects directly to the Gemini API.
- **Testing**: Vitest + React Testing Library ensures functionality remains pristine.

### Assumptions Made
1. **GenAI Provider**: We are utilizing the Google Gemini API due to its free tier accessibility and speed.
2. **API Keys**: It is assumed that the environment variable `VITE_GEMINI_API_KEY` is securely injected during deployment. The API key is **not** committed to the repository for security reasons.
3. **Responsive Design**: The primary device for this application is a mobile phone (Mobile-First Design), as fans will be walking around the stadium.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/meghana-anupoju/fifa-genai-assistant.git
cd fifa-genai-assistant
```

2. Install Dependencies:
```bash
npm install
```

3. Setup Environment Variables:
Create a `.env` file in the root of the project and add your Gemini API Key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the Development Server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` to interact with the assistant.

### Running Tests
To validate functionality (Evaluation Focus Area: Testing):
```bash
npm run test
```

## Evaluation Focus Areas Addressed
- **Code Quality**: Strict TypeScript, modular React components, clean separation of concerns.
- **Security**: API keys are isolated in `.env` and `.gitignore` correctly prevents accidental commits.
- **Efficiency**: Vite and Vanilla CSS guarantee minimal bundle sizes and fast load times.
- **Testing**: Vitest suite implemented to validate the chat interface and rendering logic.
- **Accessibility**: Semantic HTML, ARIA labels for interactive elements, screen-reader friendly live regions for AI responses.
