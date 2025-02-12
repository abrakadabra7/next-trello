'use client';

interface AddCardProps {
  isAdding: boolean;
  onAddClick: () => void;
  onCreateCard: () => void;
  onCancel: () => void;
  cardTitle: string;
  onCardTitleChange: (value: string) => void;
  dueDate: string;
  onDueDateChange: (value: string) => void;
}

export function AddCard({
  isAdding,
  onAddClick,
  onCreateCard,
  onCancel,
  cardTitle,
  onCardTitleChange,
  dueDate,
  onDueDateChange
}: AddCardProps) {
  if (!isAdding) {
    return (
      <button 
        onClick={onAddClick}
        className="w-full py-2 px-3 bg-white rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm text-left"
      >
        + Kart Ekle
      </button>
    );
  }

  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <input
        type="text"
        value={cardTitle}
        onChange={(e) => onCardTitleChange(e.target.value)}
        placeholder="Kart başlığı girin"
        className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        autoFocus
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => onDueDateChange(e.target.value)}
        className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
      />
      <div className="flex gap-2">
        <button
          onClick={onCreateCard}
          className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
        >
          Kart Ekle
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm"
        >
          İptal
        </button>
      </div>
    </div>
  );
} 