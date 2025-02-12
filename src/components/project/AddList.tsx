'use client';

interface AddListProps {
  isAdding: boolean;
  onAddClick: () => void;
  onCreateList: () => void;
  onCancel: () => void;
  listTitle: string;
  onListTitleChange: (value: string) => void;
}

export function AddList({
  isAdding,
  onAddClick,
  onCreateList,
  onCancel,
  listTitle,
  onListTitleChange
}: AddListProps) {
  if (!isAdding) {
    return (
      <button
        onClick={onAddClick}
        className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors text-gray-600"
      >
        + Yeni Liste Ekle
      </button>
    );
  }

  return (
    <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4">
      <input
        type="text"
        value={listTitle}
        onChange={(e) => onListTitleChange(e.target.value)}
        placeholder="Liste başlığı girin"
        className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={onCreateList}
          className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
        >
          Liste Ekle
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