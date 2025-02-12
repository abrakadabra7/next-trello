'use client';

interface DeleteProjectModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteProjectModal({ onCancel, onConfirm }: DeleteProjectModalProps) {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(17, 24, 39, 0.2)' }}
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Projeyi Sil</h2>
        <p className="text-gray-600 mb-6">
          Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
} 