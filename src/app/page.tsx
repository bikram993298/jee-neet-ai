'use client';
import { useState } from 'react';
import axios from 'axios';

const subjects = [
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'biology', name: 'Biology' },
];

type Solution = { steps: { title: string; content: string }[]; time?: string; confidence?: number };

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
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h1 className="text-2xl font-semibold">AI Solution Engine</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setSubject(s.id)}
                className={`py-3 rounded-lg border flex items-center justify-center space-x-2 text-sm ${subject === s.id ? 'bg-blue-50 border-blue-300 text-blue-700' : 'hover:bg-gray-50'}`}
              >
                {/* replace placeholder with icons */} 
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Difficulty Level</label>
            <select value={level} onChange={e => setLevel(e.target.value)} className="w-full border px-3 py-2 rounded">
              {['Easy', 'Medium', 'Hard'].map(l => <option key={l}>{l}</option>)}
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

        {solution && (
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold">🧾 Step-by-Step Solution</h2>
            <div className="space-y-4">
              {solution.steps.map((step, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">Step {i + 1}: {step.title}</h3>
                  <p className="whitespace-pre-wrap">{step.content}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 border-t text-sm text-gray-600">
              <span>Avg Accuracy: {solution.confidence ?? 'N/A'}%</span>
              <span>Response Time: {solution.time ?? '—'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar with Quick Tips & Stats */}
      <aside className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Quick Tips</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>Be specific in your question</li>
            <li>Include values & conditions</li>
            <li>Upload diagrams for clarity</li>
            <li>Mention topic if known</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">AI Performance</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between"><span>Solutions Generated</span><span>2,847</span></div>
            <div className="flex justify-between"><span>Avg Accuracy</span><span className="text-green-600">94.2%</span></div>
            <div className="flex justify-between"><span>Response Time</span><span className="text-blue-600">2.3s</span></div>
          </div>
        </div>
      </aside>
    </div>
  );
}
