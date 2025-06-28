'use client';

import { useState } from 'react';
import axios from 'axios';

const subjects = [
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'biology', name: 'Biology' },
];

type Step = { title: string; content: string };
type Solution = { steps: Step[]; time?: string; confidence?: number };

export default function AISolverPage() {
  const [subject, setSubject] = useState(subjects[0].id);
  const [level, setLevel] = useState('Medium');
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post<Solution>('/api/solve', { subject, question });
      setSolution(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto py-6 px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Input */}
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h1 className="text-2xl font-semibold">AI Solution Engine</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setSubject(s.id)}
                className={`py-3 rounded-lg border flex items-center justify-center space-x-2 text-sm ${
                  subject === s.id
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{s.name}</span>
              </button>
            ))}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Difficulty Level</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              {['Easy', 'Medium', 'Hard'].map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Enter Your Question</label>
            <textarea
              rows={4}
              placeholder="Type your question here..."
              className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-300"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </div>
          <button
            onClick={handleSolve}
            disabled={loading || !question.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Solving...' : 'Get Solution'}
          </button>
        </div>

        {/* Solution */}
        {solution && (
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">🧾 Step-by-Step Solution</h2>
              {loading && (
                <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
            </div>

            <div className="divide-y divide-gray-200 rounded-lg bg-white shadow">
              {solution.steps.map((step, idx) => (
                <details key={idx} className="p-4 hover:bg-gray-50">
                  <summary className="cursor-pointer text-lg font-medium text-gray-800">
                    Step {idx + 1}: {step.title}
                  </summary>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {step.content}
                  </p>
                </details>
              ))}
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex justify-between text-sm text-gray-600">
              <span>Accuracy: {solution.confidence ?? '—'}%</span>
              <span>Time: {solution.time ?? '—2s'}</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const full = solution.steps
                    .map((s, i) => `Step ${i + 1}: ${s.title}\n${s.content}`)
                    .join('\n\n');
                  navigator.clipboard.writeText(full);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                Copy Full Solution
              </button>
              <span>Was this helpful?</span>
              <button className="px-3 py-1 text-green-600 rounded hover:bg-green-100">
                👍
              </button>
              <button className="px-3 py-1 text-red-600 rounded hover:bg-red-100">
                👎
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Quick Tips</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>Be specific in your question</li>
            <li>Include values & constraints</li>
            <li>Upload diagrams if needed</li>
            <li>Mention the topic if known</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">AI Performance</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Solutions Generated</span>
              <span>2,847</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Accuracy</span>
              <span className="text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Response Time</span>
              <span className="text-blue-600">2.3s</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
