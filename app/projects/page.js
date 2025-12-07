'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import { ErrorMessage } from '../components/ErrorMessage';
import { TableSkeleton } from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { NotificationContainer } from '../components/Notification';
import ProjectForm from '../components/ProjectForm';
import { useCreateProjectMutation, useDeleteProjectMutation, useGetProjectsQuery, useUpdateProjectMutation } from '../lib/api/projectsApi';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: projects, isLoading: loading, error, refetch } = useGetProjectsQuery(debouncedSearch);
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
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

  // Handle create project
  const handleCreateProject = async (data) => {
    try {
      await createProject(data).unwrap();
      setIsCreateModalOpen(false);
      addNotification('Project created successfully!', 'success');
      refetch();
    } catch (error) {
      addNotification(error.message || 'Failed to create project', 'error');
    }
  };

  // Handle edit project
  const handleEditProject = async (data) => {
    try {
      await updateProject({ id: selectedProject.id, ...data }).unwrap();
      setIsEditModalOpen(false);
      setSelectedProject(null);
      addNotification('Project updated successfully!', 'success');
      refetch();
    } catch (error) {
      addNotification(error.message || 'Failed to update project', 'error');
    }
  };

  // Handle delete project
  const handleDeleteProject = async () => {
    try {
      await deleteProject(selectedProject.id).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
      addNotification('Project deleted successfully!', 'success');
      refetch();
    } catch (error) {
      addNotification(error.message || 'Failed to delete project', 'error');
    }
  };

  // Use projects directly as they are filtered on the backend
  const filteredProjects = projects || [];

  return (
    <>
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-muted">Manage all your projects in one place</p>
          </div>

          {/* Actions Bar */}
          <div className="bg-card p-6 rounded-xl border border-card-border mb-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1 max-w-md">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">🔍</span>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background border border-card-border rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary w-full"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>+</span> Create Project
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <ErrorMessage error={error} onRetry={refetch} className="mb-6" />}

          {/* Loading State */}
          {loading && !error && <TableSkeleton rows={5} />}

          {/* Empty State */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="bg-card p-12 rounded-xl border border-card-border text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-bold mb-2">No projects found</h3>
              <p className="text-muted mb-6">
                {searchQuery ? 'Try adjusting your search query' : 'Get started by creating your first project'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors"
                >
                  Create Project
                </button>
              )}
            </div>
          )}

          {/* Projects Table */}
          {!loading && !error && filteredProjects.length > 0 && (
            <div className="bg-card rounded-xl border border-card-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs text-muted border-b border-card-border/50 bg-card-border/20">
                      <th className="py-3 px-4 font-medium">Project Name</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">Progress</th>
                      <th className="py-3 px-4 font-medium">Tasks</th>
                      <th className="py-3 px-4 font-medium">Due Date</th>
                      <th className="py-3 px-4 font-medium">Owner</th>
                      <th className="py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="border-b border-card-border/30 hover:bg-card-border/10 transition-colors">
                        <td className="py-4 px-4">
                          <Link href={`/projects/${project.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                            <div className="w-8 h-8 bg-blue-500/20 text-blue-500 rounded flex items-center justify-center">📁</div>
                            <span className="font-medium text-sm">{project.name}</span>
                          </Link>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs border ${project.statusColor} flex items-center gap-1 w-fit`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-0.5 h-3 w-24">
                              {[...Array(10)].map((_, i) => (
                                <div key={i} className={`flex-1 rounded-sm ${i < project.progress / 10 ? 'bg-accent' : 'bg-card-border'}`}></div>
                              ))}
                            </div>
                            <span className="text-xs font-bold">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span className="font-bold text-white">{project.done}</span> <span className="text-muted">/ {project.total}</span>
                        </td>
                        <td className="py-4 px-4 text-sm text-white">{project.due}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <img src={project.ownerImg} alt={project.owner} className="w-6 h-6 rounded-full" />
                            <span className="text-sm text-white">{project.owner}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProject(project);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1.5 hover:bg-card-border rounded text-muted hover:text-white transition-colors"
                              title="Edit project"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProject(project);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="p-1.5 hover:bg-card-border rounded text-muted hover:text-red-400 transition-colors"
                              title="Delete project"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        size="md"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={isCreating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        title="Edit Project"
        size="md"
      >
        <ProjectForm
          initialData={selectedProject}
          onSubmit={handleEditProject}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedProject(null);
          }}
          loading={isUpdating}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
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
