// @google/genai integration to provide AI-based suggestions.
import { GoogleGenAI } from "@google/genai";
import { Task } from '../types';

// FIX: Initialize the GoogleGenAI client.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// FIX: Replace mock function with a real call to the Gemini API.
export const getAIBasedSuggestion = async (task: Task): Promise<string> => {
  const prompt = `You are an AI productivity coach. A user is struggling with a task they want to avoid.
Task name: "${task.name}"
Description: "${task.description || 'No description provided.'}"
Impact tier: "${task.tier}"
Category: "${task.category}"

Please provide one short, encouraging, and actionable suggestion (2-3 sentences) to help the user stay on track and avoid this task.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting AI suggestion:", error);
    return "I'm having a little trouble thinking of a suggestion right now. Please try again in a moment.";
  }
};
