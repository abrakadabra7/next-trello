'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { CardItem } from './CardItem';
import { AddCard } from './AddCard';

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

interface List {
  id: number;
  title: string;
  position: number;
  project_id: number;
}

interface ListItemProps {
  list: List;
  index: number;
  cards: Card[];
  onDeleteClick: () => void;
  onCardClick: (card: Card) => void;
  addingCardToList: number | null;
  onAddCardClick: () => void;
  onCreateCard: () => void;
  onCancelAddCard: () => void;
  newCardTitle: string;
  onCardTitleChange: (value: string) => void;
  newCardDueDate: string;
  onCardDueDateChange: (value: string) => void;
}

export function ListItem({
  list,
  index,
  cards,
  onDeleteClick,
  onCardClick,
  addingCardToList,
  onAddCardClick,
  onCreateCard,
  onCancelAddCard,
  newCardTitle,
  onCardTitleChange,
  newCardDueDate,
  onCardDueDateChange
}: ListItemProps) {
  return (
    <Draggable
      key={list.id}
      draggableId={list.id.toString()}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex-shrink-0 w-80"
        >
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">{list.title}</h3>
              <button
                onClick={onDeleteClick}
                className="text-gray-400 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Kartlar */}
            <Droppable droppableId={list.id.toString()} type="card">
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2 mb-4"
                >
                  {cards
                    .filter(card => card.list_id === list.id)
                    .map((card, index) => (
                      <CardItem
                        key={card.id}
                        card={card}
                        index={index}
                        onClick={onCardClick}
                      />
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Kart Ekleme */}
            <AddCard
              isAdding={addingCardToList === list.id}
              onAddClick={onAddCardClick}
              onCreateCard={onCreateCard}
              onCancel={onCancelAddCard}
              cardTitle={newCardTitle}
              onCardTitleChange={onCardTitleChange}
              dueDate={newCardDueDate}
              onDueDateChange={onCardDueDateChange}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
} 