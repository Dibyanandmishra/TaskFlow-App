import React from 'react';
import { Trash2, CheckCircle, Circle, Edit } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className={`bg-[var(--color-card)] rounded-xl border p-5 transition-all-custom ${isCompleted ? 'border-[var(--color-success)]/30 opacity-75' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'}`}>
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={() => onStatusChange(task._id, isCompleted ? 'pending' : 'completed')}
          className={`mt-1 flex-shrink-0 focus-ring rounded-full ${isCompleted ? 'text-[var(--color-success)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'} transition-all-custom`}
          aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
        >
          {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium text-[var(--color-text-primary)] mb-1 truncate ${isCompleted ? 'line-through text-[var(--color-text-secondary)]' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              task.priority === 'high' ? 'bg-[var(--color-error)]/10 text-[var(--color-error)]' :
              task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
              'bg-[var(--color-success)]/10 text-[var(--color-success)]'
            }`}>
              {task.priority || 'Medium'}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-all-custom focus-ring"
            aria-label="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-lg transition-all-custom focus-ring"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
