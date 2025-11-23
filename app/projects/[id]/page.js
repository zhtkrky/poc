'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import { ErrorMessage } from '../../components/ErrorMessage';
import { CardSkeleton } from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { NotificationContainer } from '../../components/Notification';
import ProjectForm from '../../components/ProjectForm';
import { useDeleteProject, useUpdateProject } from '../../lib/hooks/useProjectMutations';
import { useProject } from '../../lib/hooks/useProjects';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;

  const { data: project, loading, error, refetch } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration: 3000 }]);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Handle edit project
  const handleEditProject = async (data) => {
    try {
      await updateProject.mutate({ id: projectId, data });
      setIsEditModalOpen(false);
      addNotification('Project updated successfully!', 'success');
      refetch();
    } catch (error) {
      addNotification(error.message || 'Failed to update project', 'error');
    }
  };

  // Handle delete project
  const handleDeleteProject = async () => {
    try {
      await deleteProject.mutate(projectId);
      addNotification('Project deleted successfully!', 'success');
      setTimeout(() => {
        router.push('/projects');
      }, 1000);
    } catch (error) {
      addNotification(error.message || 'Failed to delete project', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 ml-64">
          <div className="p-8">
            <CardSkeleton />
            <div className="mt-6">
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 ml-64">
          <div className="p-8">
            <ErrorMessage 
              error={error || 'Project not found'} 
              onRetry={refetch}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm">
            <Link href="/projects" className="text-muted hover:text-white transition-colors">
              Projects
            </Link>
            <span className="text-muted">/</span>
            <span className="text-white font-medium">{project.name}</span>
          </div>

          {/* Header */}
          <div className="bg-card p-6 rounded-xl border border-card-border mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center text-3xl">
                  📁
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${project.statusColor} flex items-center gap-1 w-fit`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {project.status}
                    </span>
                    <span className="text-muted text-sm">Due: {project.due}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-card-border hover:bg-card-border/70 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-card p-6 rounded-xl border border-card-border">
              <div className="text-muted text-sm mb-2">Progress</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl font-bold">{project.progress}%</div>
              </div>
              <div className="flex gap-0.5 h-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i < project.progress / 10 ? 'bg-accent' : 'bg-card-border'}`}></div>
                ))}
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-card-border">
              <div className="text-muted text-sm mb-2">Tasks</div>
              <div className="text-3xl font-bold mb-1">
                <span className="text-white">{project.done}</span>
                <span className="text-muted text-xl"> / {project.total}</span>
              </div>
              <div className="text-sm text-muted">
                {project.total - project.done} remaining
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-card-border">
              <div className="text-muted text-sm mb-2">Owner</div>
              <div className="flex items-center gap-3">
                <img src={project.ownerImg} alt={project.owner} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-bold text-white">{project.owner}</div>
                  <div className="text-sm text-muted">Project Manager</div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-card p-6 rounded-xl border border-card-border mb-6">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-muted text-sm mb-1">Description</div>
                <p className="text-white">{project.description || 'No description provided'}</p>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div>
                  <div className="text-muted text-sm mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-card-border">
                <div>
                  <div className="text-muted text-sm mb-1">Created</div>
                  <div className="text-white">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-muted text-sm mb-1">Last Updated</div>
                  <div className="text-white">
                    {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        size="md"
      >
        <ProjectForm
          initialData={project}
          onSubmit={handleEditProject}
          onCancel={() => setIsEditModalOpen(false)}
          loading={updateProject.loading}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteProject.loading}
        variant="danger"
      />

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  );
}
