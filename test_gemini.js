import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyFakeKey1234567890abcdef';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function test() {
  try {
    const result = await model.generateContent('Say hi');
    console.log(result.response.text());
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
