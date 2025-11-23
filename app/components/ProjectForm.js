'use client';

import { useState } from 'react';

/**
 * ProjectForm Component
 * Reusable form for creating and editing projects
 * Follows DRY principle
 */
export default function ProjectForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    status: initialData?.status || 'In Progress',
    owner: initialData?.owner || '',
    due: initialData?.due || '',
    description: initialData?.description || '',
    tags: initialData?.tags?.join(', ') || '',
    total: initialData?.total || 0,
    done: initialData?.done || 0,
    progress: initialData?.progress || 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.owner.trim()) {
      newErrors.owner = 'Project owner is required';
    }

    if (!formData.due) {
      newErrors.due = 'Due date is required';
    }

    const total = parseInt(formData.total);
    if (isNaN(total) || total < 0) {
      newErrors.total = 'Total tasks must be a non-negative number';
    }

    const done = parseInt(formData.done);
    if (isNaN(done) || done < 0) {
      newErrors.done = 'Done tasks must be a non-negative number';
    }

    if (done > total) {
      newErrors.done = 'Done tasks cannot exceed total tasks';
    }

    const progress = parseInt(formData.progress);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Convert tags string to array
    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const submitData = {
      ...formData,
      tags,
      total: parseInt(formData.total),
      done: parseInt(formData.done),
      progress: parseInt(formData.progress),
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Project Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
          Project Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
          placeholder="Enter project name"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-white mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Owner */}
      <div>
        <label htmlFor="owner" className="block text-sm font-medium text-white mb-1">
          Project Owner <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="owner"
          name="owner"
          value={formData.owner}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
          placeholder="Enter owner name"
        />
        {errors.owner && <p className="text-red-400 text-xs mt-1">{errors.owner}</p>}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="due" className="block text-sm font-medium text-white mb-1">
          Due Date <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="due"
          name="due"
          value={formData.due}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
          placeholder="e.g., 12 Mar 2024"
        />
        {errors.due && <p className="text-red-400 text-xs mt-1">{errors.due}</p>}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="total" className="block text-sm font-medium text-white mb-1">
            Total Tasks
          </label>
          <input
            type="number"
            id="total"
            name="total"
            value={formData.total}
            onChange={handleChange}
            disabled={loading}
            min="0"
            className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
          />
          {errors.total && <p className="text-red-400 text-xs mt-1">{errors.total}</p>}
        </div>

        <div>
          <label htmlFor="done" className="block text-sm font-medium text-white mb-1">
            Done Tasks
          </label>
          <input
            type="number"
            id="done"
            name="done"
            value={formData.done}
            onChange={handleChange}
            disabled={loading}
            min="0"
            className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
          />
          {errors.done && <p className="text-red-400 text-xs mt-1">{errors.done}</p>}
        </div>

        <div>
          <label htmlFor="progress" className="block text-sm font-medium text-white mb-1">
            Progress (%)
          </label>
          <input
            type="number"
            id="progress"
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            disabled={loading}
            min="0"
            max="100"
            className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
          />
          {errors.progress && <p className="text-red-400 text-xs mt-1">{errors.progress}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          rows="3"
          className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50 resize-none"
          placeholder="Enter project description"
        />
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-white mb-1">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          disabled={loading}
          className="w-full bg-background border border-card-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
          placeholder="Comma-separated tags (e.g., Finance, Analytics)"
        />
        <p className="text-muted text-xs mt-1">Separate tags with commas</p>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-card-border hover:bg-card-border/70 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {initialData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
