'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';

const PartDetailsModal = ({ isOpen, onClose, part, onSave }) => {
  const [status, setStatus] = useState('not_checked');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (part) {
      setStatus(part.status || 'not_checked');
      setComment(part.comment || '');
    }
  }, [part]);

  const handleSave = () => {
    onSave({
      ...part,
      status,
      comment,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleCancel = () => {
    // Reset to original values
    if (part) {
      setStatus(part.status || 'not_checked');
      setComment(part.comment || '');
    }
    onClose();
  };

  const statusOptions = [
    { value: 'original', label: 'Original', color: '#10b981', icon: '⚪' },
    { value: 'painted', label: 'Painted', color: '#fbbf24', icon: '🟡' },
    { value: 'replaced', label: 'Replaced', color: '#3b82f6', icon: '🔵' },
    { value: 'damaged', label: 'Damaged', color: '#ef4444', icon: '🔴' },
    { value: 'not_checked', label: 'Not Checked', color: '#3f3f46', icon: '⚫' },
  ];

  if (!part) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={`Inspect: ${part.name}`}>
      <div className="space-y-6">
        {/* Part Info */}
        <div className="bg-card-border/30 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-muted mb-1">Part Name</h3>
          <p className="text-lg font-bold">{part.name}</p>
        </div>

        {/* Status Selection */}
        <div>
          <h3 className="text-sm font-semibold text-muted mb-3">Part Status</h3>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  status === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-card-border hover:border-card-border/50 bg-card'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={status === option.value}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: option.color }}
                >
                  {status === option.value && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="flex-1 font-medium">{option.label}</span>
                {status === option.value && (
                  <span className="text-primary text-sm font-semibold">Selected</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-muted mb-2">
            Notes / Comments
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add details about damage, replacement, or any observations..."
            rows={4}
            className="w-full px-4 py-3 bg-card border border-card-border rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
          />
          <p className="text-xs text-muted mt-1">{comment.length} characters</p>
        </div>

        {/* Last Updated */}
        {part.updatedAt && (
          <div className="text-xs text-muted">
            Last updated: {new Date(part.updatedAt).toLocaleString()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-card-border">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-card border border-card-border rounded-lg text-white font-medium hover:bg-card-border/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-primary rounded-lg text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PartDetailsModal;
