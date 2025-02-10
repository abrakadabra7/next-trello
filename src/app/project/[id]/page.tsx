'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '@/lib/supabase';

interface List {
  id: number;
  title: string;
  position: number;
  project_id: number;
}

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

interface Project {
  id: number;
  title: string;
  description: string;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [addingCardToList, setAddingCardToList] = useState<number | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDueDate, setNewCardDueDate] = useState('');
  const [newCardStatus, setNewCardStatus] = useState<Card['status']>('todo');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'project' | 'list', id: number} | null>(null);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    fetchProject();
    fetchLists();
  }, []);

  useEffect(() => {
    if (lists.length > 0) {
      fetchCards();
    }
  }, [lists]);

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Proje yüklenirken hata:', error);
      return;
    }

    setProject(data);
  };

  const fetchLists = async () => {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('project_id', params.id)
      .order('position');

    if (error) {
      console.error('Listeler yüklenirken hata:', error);
      return;
    }

    setLists(data || []);
  };

  const fetchCards = async () => {
    if (lists.length === 0) return;

    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .in('list_id', lists.map(list => list.id))
      .order('position');

    if (error) {
      console.error('Kartlar yüklenirken hata:', error);
      return;
    }

    setCards(data || []);
  };

  const createList = async () => {
    if (!newListTitle.trim()) return;

    const newPosition = lists.length;
    const { data, error } = await supabase
      .from('lists')
      .insert([{
        title: newListTitle,
        position: newPosition,
        project_id: params.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Liste oluşturulurken hata:', error);
      return;
    }

    setLists([...lists, data]);
    setNewListTitle('');
    setIsAddingList(false);
  };

  const createCard = async (listId: number) => {
    if (!newCardTitle.trim()) return;

    const listCards = cards.filter(card => card.list_id === listId);
    const newPosition = listCards.length;

    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([{
          title: newCardTitle,
          list_id: listId,
          position: newPosition,
          is_completed: false,
          due_date: newCardDueDate || null,
          status: 'todo',
          description: ''
        }])
        .select()
        .single();

      if (error) {
        console.error('Kart oluşturulurken hata:', error);
        alert('Kart oluşturulurken bir hata oluştu: ' + error.message);
        return;
      }

      if (data) {
        setCards(prevCards => [...prevCards, data]);
        setNewCardTitle('');
        setNewCardDueDate('');
        setAddingCardToList(null);
      }
    } catch (error) {
      console.error('Beklenmeyen hata:', error);
      alert('Beklenmeyen bir hata oluştu');
    }
  };

  const updateCardStatus = async (cardId: number, newStatus: Card['status']) => {
    const { error } = await supabase
      .from('cards')
      .update({ status: newStatus })
      .eq('id', cardId);

    if (error) {
      console.error('Kart durumu güncellenirken hata:', error);
      return;
    }

    setCards(cards.map(card => 
      card.id === cardId ? { ...card, status: newStatus } : card
    ));
    setEditingCard(null);
  };

  const deleteList = async (listId: number) => {
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId);

    if (error) {
      console.error('Liste silinirken hata:', error);
      return;
    }

    setLists(lists.filter(list => list.id !== listId));
    setCards(cards.filter(card => card.list_id !== listId));
    setShowDeleteConfirm(null);
  };

  const deleteProject = async () => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Proje silinirken hata:', error);
      return;
    }

    router.push('/workspace');
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    // Liste sıralaması değiştiğinde
    if (type === 'list') {
      const newLists = Array.from(lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);

      setLists(newLists);

      // Veritabanını güncelle
      await supabase
        .from('lists')
        .update({ position: destination.index })
        .eq('id', removed.id);
      return;
    }

    // Kart sıralaması değiştiğinde
    const sourceList = lists.find(list => list.id.toString() === source.droppableId);
    const destList = lists.find(list => list.id.toString() === destination.droppableId);

    if (!sourceList || !destList) return;

    const newCards = Array.from(cards);
    const [movedCard] = newCards.splice(
      newCards.findIndex(card => card.id.toString() === result.draggableId),
      1
    );

    // Kartın yeni list_id'sini güncelle
    movedCard.list_id = parseInt(destination.droppableId);

    // Kartı yeni konumuna ekle
    newCards.splice(
      cards.filter(card => card.list_id === destList.id).length,
      0,
      movedCard
    );

    setCards(newCards);

    // Veritabanını güncelle
    await supabase
      .from('cards')
      .update({ 
        list_id: parseInt(destination.droppableId),
        position: destination.index 
      })
      .eq('id', movedCard.id);
  };

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Bar */}
      <div className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-16">
          <div className="flex items-center justify-between">
            <div>
              <button 

                onClick={() => router.push('/workspace')}
                className="text-gray-600 hover:text-gray-800 mb-2 flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Çalışma Alanına Dön
              </button>
              <h1 className="text-2xl font-semibold text-gray-800">{project.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{project.description}</p>
            </div>
            <button 
              onClick={() => setShowDeleteConfirm({ type: 'project', id: project.id })}
              className="text-red-600 hover:text-red-700 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300"
            >
              Projeyi Sil
            </button>
          </div>
        </div>
      </div>

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
                        <div className="bg-gray-100 rounded-lg p-4 ">
                          <div className="flex items-center justify-between mb-4     ">
                            <h3 className="font-medium text-gray-800">{list.title}</h3>
                            <button



                              onClick={() => setShowDeleteConfirm({ type: 'list', id: list.id })}
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
                                          onClick={() => setEditingCard(card)}
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
                                  ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>

                          {/* Kart Ekleme */}
                          {addingCardToList === list.id ? (
                            <div className="bg-white p-3 rounded shadow-sm">
                              <input
                                type="text"
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                placeholder="Kart başlığı girin"
                                className=" text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                autoFocus
                              />
                              <input

                                type="date"
                                value={newCardDueDate}
                                onChange={(e) => setNewCardDueDate(e.target.value)}
                                className="text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                              />
                              <div className="flex gap-2">
                                <button

                                  onClick={() => createCard(list.id)}
                                  className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                >
                                  Kart Ekle
                                </button>
                                <button
                                  onClick={() => {
                                    setAddingCardToList(null);
                                    setNewCardTitle('');
                                    setNewCardDueDate('');
                                  }}
                                  className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm"
                                >
                                  İptal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setAddingCardToList(list.id)}
                              className="w-full py-2 px-3 bg-white rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm text-left"
                            >
                              + Kart Ekle
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {/* Yeni Liste Ekleme */}
                {isAddingList ? (
                  <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4">
                    <input
                      type="text"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      placeholder="Liste başlığı girin"
                      className=" text-black w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      autoFocus
                    />
                    <div className="flex gap-2">

                      <button
                        onClick={createList}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm "
                      >
                        Liste Ekle
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingList(false);
                          setNewListTitle('');
                        }}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm "
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingList(true)}
                    className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors text-gray-600"
                  >
                    + Yeni Liste Ekle
                  </button>
                )}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {/* Silme Onay Modalı */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {showDeleteConfirm.type === 'project' ? 'Projeyi Sil' : 'Listeyi Sil'}
            </h2>
            <p className="text-gray-600 mb-6">
              {showDeleteConfirm.type === 'project' 
                ? 'Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
                : 'Bu listeyi ve içindeki tüm kartları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'project') {
                    deleteProject();
                  } else {
                    deleteList(showDeleteConfirm.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kart Düzenleme Modalı */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Kartı Düzenle</h2>
              <button 
                onClick={() => setEditingCard(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-2">{editingCard.title}</h3>
              {editingCard.due_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(editingCard.due_date).toLocaleDateString('tr-TR')}</span>
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
                    onClick={() => updateCardStatus(editingCard.id, 'todo')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      editingCard.status === 'todo'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Yapılacak
                  </button>
                  <button
                    onClick={() => updateCardStatus(editingCard.id, 'in_progress')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      editingCard.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Devam Ediyor
                  </button>
                  <button
                    onClick={() => updateCardStatus(editingCard.id, 'review')}

                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      editingCard.status === 'review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}

                  >
                    İncelemede
                  </button>
                  <button
                    onClick={() => updateCardStatus(editingCard.id, 'done')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      editingCard.status === 'done'
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
      )}
    </div>
  );
} 