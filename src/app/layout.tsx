import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: '🧠 AI Solution Engine',
  description: 'AI-powered step-by-step JEE/NEET question solver',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </body>
    </html>
  );
}
