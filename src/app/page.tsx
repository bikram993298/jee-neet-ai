'use client';

import { useState } from 'react';
import axios from 'axios';

type Section = { id: string; name: string };

type SolutionStep = { title: string; content: string };

type Solution = {
  id: string;
  steps: SolutionStep[];
  timeToSolve?: string;
  confidence?: number;
};

export default function HomePage() {
  const subjects: Section[] = [
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' },
    { id: 'math', name: 'Math' },
  ];

  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
  const [question, setQuestion] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);
  const [recentSolutions, setRecentSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  const handleSolve = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post<Solution>('/api/solve', {
        subject: selectedSubject,
        question,
      });
      setSolution(data);
      setRecentSolutions(prev => [data, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySolution = () => {
    if (!solution) return;
    const text = solution.steps
      .map((s, i) => `Step ${i + 1}: ${s.title}\n${s.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [id]: prev[id] === type ? undefined : type,
    }));
  };

  const loadRecentSolution = (s: Solution) => {
    setSolution(s);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🧠 AI Solution Engine</h1>

      {/* Input Panel */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block mb-2 font-medium">Subject</label>
          <div className="flex flex-wrap gap-2">
            {subjects.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedSubject === sub.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Question</label>
          <textarea
            rows={4}
            className="w-full border px-4 py-3 rounded-lg focus:ring focus:ring-blue-300"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Type your JEE/NEET question here..."
          />
        </div>

        <button
          onClick={handleSolve}
          disabled={loading || !question.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Get AI Solution'}
        </button>
      </div>

      {/* Solution Display */}
      {solution && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">🧾 Solution</h2>
            <button onClick={handleCopySolution} className="text-gray-500 hover:text-gray-800">
              Copy
            </button>
          </div>

          <div className="space-y-4">
            {solution.steps.map((step, i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">Step {i + 1}: {step.title}</h3>
                <p className="whitespace-pre-wrap">{step.content}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <span className="text-sm text-gray-500">
              Time: {solution.timeToSolve ?? '~2s'}
            </span>
            <span className="text-sm text-gray-500">
              Confidence: {solution.confidence ?? '—'}%
            </span>
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <span className="text-sm">Was this helpful?</span>
            {['up', 'down'].map(type => (
              <button
                key={type}
                onClick={() => handleFeedback(solution.id, type as 'up' | 'down')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  feedback[solution.id] === type
                    ? type === 'up'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {type === 'up' ? '👍' : '👎'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Solutions */}
      {recentSolutions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-lg font-semibold">Recent Solutions</h2>
          <div className="space-y-2">
            {recentSolutions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => loadRecentSolution(s)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50"
              >
                <p className="font-medium">{s.id} — {s.id /* or show subject */}</p>
                <p className="text-sm text-gray-500 truncate">{question}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
