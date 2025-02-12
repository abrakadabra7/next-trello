'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export function useProject() {
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

  return {
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
  };
} 