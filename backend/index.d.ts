declare module "@google/genai" {
  export class GoogleGenAI {
    constructor(options: { apiKey: string });

    models: {
      generateContent(options: { model: string; contents: string }): Promise<{
        text: string;
        [key: string]: any;
      }>;
    };
  }
}
