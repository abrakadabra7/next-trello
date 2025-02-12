'use client';

import { useRouter } from 'next/navigation';

interface TopBarProps {
  project: {
    id: number;
    title: string;
    description: string;
  };
  onDeleteClick: () => void;
}

export function TopBar({ project, onDeleteClick }: TopBarProps) {
  const router = useRouter();

  return (
    <div className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-16">
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => router.push('/workspace')}
              className="text-gray-600 hover:text-gray-800 mb-2 flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Çalışma Alanına Dön
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">{project.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
          </div>
          <button 
            onClick={onDeleteClick}
            className="text-red-600 hover:text-red-700 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300"
          >
            Projeyi Sil
          </button>
        </div>
      </div>
    </div>
  );
} 