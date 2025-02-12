'use client';

interface WorkspaceHeaderProps {
  onCreateClick: (e: React.MouseEvent) => void;
}

export function WorkspaceHeader({ onCreateClick }: WorkspaceHeaderProps) {
  return (
    <div className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Çalışma Alanım</h1>
            <p className="text-sm text-gray-500 mt-1">Tüm projeleriniz ve panolarınız burada</p>
          </div>
          <button 
            onClick={onCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Proje
          </button>
        </div>
      </div>
    </div>
  );
} 