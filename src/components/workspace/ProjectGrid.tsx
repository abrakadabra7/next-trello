'use client';

import { useRouter } from 'next/navigation';

interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface ProjectGridProps {
  projects: Project[];
  onDeleteClick: (projectId: number) => void;
  onCreateClick: (e: React.MouseEvent) => void;
}

export function ProjectGrid({ projects, onDeleteClick, onCreateClick }: ProjectGridProps) {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="h-2 bg-blue-600 rounded-t-xl" />
            <div className="p-5">
              <div 
                onClick={() => router.push(`/project/${project.id}`)}
                className="mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{project.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {new Date(project.created_at).toLocaleDateString('tr-TR')}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(project.id);
                  }}
                  className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Yeni Proje Oluştur Kartı */}
        <button 
          onClick={onCreateClick}
          className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-blue-600"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Yeni Proje Oluştur</span>
        </button>
      </div>
    </div>
  );
} 