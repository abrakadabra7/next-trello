'use client';

import { Draggable } from '@hello-pangea/dnd';

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

interface CardItemProps {
  card: Card;
  index: number;
  onClick: (card: Card) => void;
}

export function CardItem({ card, index, onClick }: CardItemProps) {
  return (
    <Draggable
      key={card.id}
      draggableId={card.id.toString()}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 rounded shadow-sm hover:shadow-md transition-all cursor-pointer ${
            card.status === 'todo' ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200' :
            card.status === 'in_progress' ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200' :
            card.status === 'review' ? 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200' :
            'bg-green-50 hover:bg-green-100 border border-green-200'
          }`}
          onClick={() => onClick(card)}
        >
          <h4 className={`font-medium ${
            card.status === 'todo' ? 'text-gray-800' :
            card.status === 'in_progress' ? 'text-blue-800' :
            card.status === 'review' ? 'text-yellow-800' :
            'text-green-800'
          }`}>{card.title}</h4>
          {card.due_date && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              <svg className={`w-4 h-4 ${
                card.status === 'todo' ? 'text-gray-500' :
                card.status === 'in_progress' ? 'text-blue-500' :
                card.status === 'review' ? 'text-yellow-500' :
                'text-green-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={
                card.status === 'todo' ? 'text-gray-600' :
                card.status === 'in_progress' ? 'text-blue-600' :
                card.status === 'review' ? 'text-yellow-600' :
                'text-green-600'
              }>
                {new Date(card.due_date).toLocaleDateString('tr-TR')}
              </span>
            </div>
          )}
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              card.status === 'todo' ? 'bg-gray-200 text-gray-700' :
              card.status === 'in_progress' ? 'bg-blue-200 text-blue-700' :
              card.status === 'review' ? 'bg-yellow-200 text-yellow-700' :
              'bg-green-200 text-green-700'
            }`}>
              {card.status === 'todo' ? 'Yapılacak' :
               card.status === 'in_progress' ? 'Devam Ediyor' :
               card.status === 'review' ? 'İncelemede' :
               'Tamamlandı'}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
} 