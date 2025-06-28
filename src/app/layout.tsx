import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'StudyAI – AI Solver',
  description: 'AI-powered solver for JEE & NEET problems',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-800 antialiased">
        {/* Header Nav Bar */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> StudyAI</div>
                <nav className="hidden md:flex space-x-4 text-sm font-medium">
                  {['Dashboard', 'AI Solver', 'Practice', 'Mock Tests', 'Materials'].map((label) => (
                    <a key={label} href="#" className={`px-3 py-1 rounded-md ${label === 'AI Solver' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                      {label}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative">
                  <svg className="w-6 h-6" /* search icon */ />
                </button>
                <button className="relative">
                  <svg className="w-6 h-6" /* bell icon */ />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white rounded-full text-xs">3</span>
                </button>
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">A</div>
                  <span className="hidden md:block text-sm">Bikram Barman</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
