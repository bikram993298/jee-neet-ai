import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { question, subject } = req.body;
  const prompt = `You are a JEE/NEET tutor. Solve this ${subject} question step-by-step:\n"${question}"`;

  const modelName = "gemini-2.5-flash";  // Change if you have access to others
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  try {
    const result = await axios.post(url, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const answer = result.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";
    res.status(200).json({ solution: answer });
  } catch (error: any) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Error solving question via Gemini API." });
  }
}
