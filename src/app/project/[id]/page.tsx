'use client';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { TopBar } from '@/components/project/TopBar';
import { AddList } from '@/components/project/AddList';
import { ListItem } from '@/components/project/ListItem';
import { DeleteConfirmModal } from '@/components/project/DeleteConfirmModal';
import { EditCardModal } from '@/components/project/EditCardModal';
import { useProject } from '@/hooks/useProject';

export default function ProjectPage() {
  const {
    project,
    lists,
    cards,
    isAddingList,
    setIsAddingList,
    newListTitle,
    setNewListTitle,
    addingCardToList,
    setAddingCardToList,
    newCardTitle,
    setNewCardTitle,
    newCardDueDate,
    setNewCardDueDate,
    showDeleteConfirm,
    setShowDeleteConfirm,
    editingCard,
    setEditingCard,
    createList,
    createCard,
    updateCardStatus,
    deleteList,
    deleteProject,
    onDragEnd
  } = useProject();

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        project={project} 
        onDeleteClick={() => setShowDeleteConfirm({ type: 'project', id: project.id })} 
      />

      {/* Liste Alanı */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          <Droppable droppableId="lists" direction="horizontal" type="list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-6 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]"
              >
                {lists.map((list, index) => (
                  <ListItem
                    key={list.id}
                    list={list}
                    index={index}
                    cards={cards}
                    onDeleteClick={() => setShowDeleteConfirm({ type: 'list', id: list.id })}
                    onCardClick={setEditingCard}
                    addingCardToList={addingCardToList}
                    onAddCardClick={() => setAddingCardToList(list.id)}
                    onCreateCard={() => createCard(list.id)}
                    onCancelAddCard={() => {
                      setAddingCardToList(null);
                      setNewCardTitle('');
                      setNewCardDueDate('');
                    }}
                    newCardTitle={newCardTitle}
                    onCardTitleChange={setNewCardTitle}
                    newCardDueDate={newCardDueDate}
                    onCardDueDateChange={setNewCardDueDate}
                  />
                ))}
                {provided.placeholder}

                {/* Yeni Liste Ekleme */}
                <AddList
                  isAdding={isAddingList}
                  onAddClick={() => setIsAddingList(true)}
                  onCreateList={createList}
                  onCancel={() => {
                    setIsAddingList(false);
                    setNewListTitle('');
                  }}
                  listTitle={newListTitle}
                  onListTitleChange={setNewListTitle}
                />
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {/* Silme Onay Modalı */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          type={showDeleteConfirm.type}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            if (showDeleteConfirm.type === 'project') {
              deleteProject();
            } else {
              deleteList(showDeleteConfirm.id);
            }
          }}
        />
      )}

      {/* Kart Düzenleme Modalı */}
      {editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onUpdateStatus={updateCardStatus}
        />
      )}
    </div>
  );
} 