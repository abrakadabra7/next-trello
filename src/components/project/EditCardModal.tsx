'use client';

interface Card {
  id: number;
  title: string;
  description: string;
  list_id: number;
  position: number;
  is_completed: boolean;
  created_at: string;
  due_date: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done';
}

interface EditCardModalProps {
  card: Card;
  onClose: () => void;
  onUpdateStatus: (cardId: number, newStatus: Card['status']) => void;
}

export function EditCardModal({
  card,
  onClose,
  onUpdateStatus
}: EditCardModalProps) {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(17, 24, 39, 0.2)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Kartı Düzenle</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-800 mb-2">{card.title}</h3>
          {card.due_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(card.due_date).toLocaleDateString('tr-TR')}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durum
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateStatus(card.id, 'todo')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  card.status === 'todo'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Yapılacak
              </button>
              <button
                onClick={() => onUpdateStatus(card.id, 'in_progress')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  card.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Devam Ediyor
              </button>
              <button
                onClick={() => onUpdateStatus(card.id, 'review')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  card.status === 'review'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                İncelemede
              </button>
              <button
                onClick={() => onUpdateStatus(card.id, 'done')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  card.status === 'done'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tamamlandı
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 