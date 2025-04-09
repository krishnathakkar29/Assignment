import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

// Define interface for profile data
interface ProfileData {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
  [key: string]: any; // For any additional fields
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });


export const generatePersonalizedMessage = async (
  profileData: ProfileData
): Promise<string> => {
  try {
    const prompt = `
    Generate a personalized LinkedIn outreach message based on the following profile information:
    
    Name: ${profileData.name}
    Job Title: ${profileData.job_title}
    Company: ${profileData.company}
    Location: ${profileData.location}
    Summary: ${profileData.summary}
    
    The message should be:
    - Professional and friendly
    - Mention specific details about their work or background
    - Brief (maximum 3-4 sentences)
    - Include a call to action to connect or schedule a meeting
    - Focus on how our campaign management system with AI-generated messages can help them improve their outreach
    
    Do not use generic salutations like "Dear" or "To whom it may concern".
    Directly give the response in the form of a LinkedIn message strictly.Make it affitmitive and do not end with a question at the end
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response?.text.trim() || "No message generated.";
  } catch (error) {
    const err = error as Error;
    console.error("Error generating personalized message:", err);
    throw new Error(`Failed to generate personalized message: ${err.message}`);
  }
};
