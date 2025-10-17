
import { GoogleGenAI, Type } from "@google/genai";
import type { DailyQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export async function generateQuestionFromPdf(pdfBase64: string): Promise<DailyQuestion> {
  const pdfPart = {
    inlineData: {
      data: pdfBase64,
      mimeType: 'application/pdf',
    },
  };

  const textPart = {
    text: `From the provided document, generate one unique, challenging aptitude or reasoning question suitable for a daily quiz. Provide the correct answer. The question should be different from any previously generated questions. Format the output as a JSON object with two keys: 'question' and 'answer'.`
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [textPart, pdfPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ["question", "answer"],
      },
    },
  });

  const jsonStr = response.text.trim();
  const data = JSON.parse(jsonStr);
  return data as DailyQuestion;
}

export async function evaluateAnswer(question: string, correctAnswer: string, userAnswer: string): Promise<boolean> {
  const prompt = `The original question was: "${question}". The correct answer is: "${correctAnswer}". The user's submitted answer is: "${userAnswer}". Is the user's answer correct? Consider variations in wording but prioritize the core concept being correct. Respond with a JSON object with a single key 'isCorrect' which is a boolean value.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                isCorrect: { type: Type.BOOLEAN },
            },
            required: ["isCorrect"],
        },
    },
  });

  const jsonStr = response.text.trim();
  const data = JSON.parse(jsonStr);
  return data.isCorrect;
}
