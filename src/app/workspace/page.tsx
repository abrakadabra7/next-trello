'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { ProjectGrid } from '@/components/workspace/ProjectGrid';
import { CreateProjectModal } from '@/components/workspace/CreateProjectModal';
import { DeleteProjectModal } from '@/components/workspace/DeleteProjectModal';

interface Project {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export default function WorkspacePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Projeler yüklenirken hata:', error);
      return;
    }

    setProjects(data || []);
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: newProject.title,
          description: newProject.description
        }])
        .select()
        .single();

      if (error) throw error;

      setProjects([data, ...projects]);
      setIsModalOpen(false);
      setNewProject({ title: '', description: '' });
      router.push(`/project/${data.id}`);
    } catch (error) {
      console.error('Proje oluşturulurken hata:', error);
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== projectId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Proje silinirken hata:', error);
    }
  };

  const handleModalOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 mt-16">
      <WorkspaceHeader onCreateClick={handleModalOpen} />
      
      <ProjectGrid
        projects={projects}
        onDeleteClick={(projectId) => setShowDeleteConfirm(projectId)}
        onCreateClick={handleModalOpen}
      />

      {/* Yeni Proje Modalı */}
      {isModalOpen && (
        <CreateProjectModal
          onClose={() => {
            setIsModalOpen(false);
            setNewProject({ title: '', description: '' });
          }}
          onSubmit={createProject}
          projectTitle={newProject.title}
          onProjectTitleChange={(value) => setNewProject({ ...newProject, title: value })}
          projectDescription={newProject.description}
          onProjectDescriptionChange={(value) => setNewProject({ ...newProject, description: value })}
        />
      )}

      {/* Silme Onay Modalı */}
      {showDeleteConfirm && (
        <DeleteProjectModal
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => deleteProject(showDeleteConfirm)}
        />
      )}
    </div>
  );
} 