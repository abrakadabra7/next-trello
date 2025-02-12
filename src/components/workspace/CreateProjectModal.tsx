'use client';

interface CreateProjectModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  projectTitle: string;
  onProjectTitleChange: (value: string) => void;
  projectDescription: string;
  onProjectDescriptionChange: (value: string) => void;
}

export function CreateProjectModal({
  onClose,
  onSubmit,
  projectTitle,
  onProjectTitleChange,
  projectDescription,
  onProjectDescriptionChange
}: CreateProjectModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white/90 backdrop-blur-sm rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Yeni Proje Oluştur</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proje Adı
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => onProjectTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Projenizin adını girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => onProjectDescriptionChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 text-black"
              placeholder="Proje açıklaması girin"
            />          
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 