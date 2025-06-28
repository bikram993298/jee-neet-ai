// pages/api/solve.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type SolutionStep = { title: string; content: string };
type Solution = {
  id: string;
  steps: SolutionStep[];
  timeToSolve?: string;
  confidence?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Solution | { error: string }>
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const { subject, question } = req.body;
  const prompt = `As a JEE/NEET tutor, explain step-by-step how to solve this ${subject} question:\n${question}`;

  const modelName = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  try {
    const { data } = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const chunks = text.split('\n\n').filter(Boolean);

    const steps: SolutionStep[] = chunks.map((blk, i) => ({
      title: `Part ${i + 1}`,
      content: blk.trim(),
    }));

    const solution: Solution = {
      id: Date.now().toString(),
      steps,
      timeToSolve: data.candidates?.[0]?.metadata?.responseTime,
      confidence: data.candidates?.[0]?.metadata?.confidence,
    };

    res.status(200).json(solution);
  } catch (e: any) {
    console.error('Gemini API error:', e.response?.data || e.message);
    res.status(500).json({ error: 'Failed to generate solution.' });
  }
}
