import { Trash2, CheckCircle, Circle, Edit, CircleDashed, Calendar, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date().setHours(0,0,0,0) && !isCompleted;

  const getNextStatus = () => {
    if (task.status === 'pending') return 'in_progress';
    if (task.status === 'in_progress') return 'completed';
    return 'pending';
  };

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />;
    if (isInProgress) return <CircleDashed className="w-5 h-5 text-amber-500 animate-spin-slow" />;
    return <Circle className="w-5 h-5" />;
  };

  return (
    <div className={`bg-[var(--color-card)] rounded-xl border p-5 shadow-sm hover:shadow-md transition-all-custom flex flex-col h-full ${isCompleted ? 'border-[var(--color-success)]/30 opacity-75' : isInProgress ? 'border-amber-500/30' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onStatusChange(task._id, getNextStatus())}
          className={`mt-0.5 flex-shrink-0 focus-ring rounded-full ${isCompleted ? 'text-[var(--color-success)]' : isInProgress ? 'text-amber-500' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'} transition-all-custom`}
          aria-label="Change status"
        >
          {getStatusIcon()}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-bold text-[var(--color-text-primary)] mb-1.5 leading-tight ${isCompleted ? 'line-through text-[var(--color-text-secondary)]' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex flex-row gap-1 -mt-1 -mr-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-md transition-all-custom focus-ring"
            aria-label="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-md transition-all-custom focus-ring"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)]/50">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
            isCompleted ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 
            isInProgress ? 'bg-amber-500/10 text-amber-500' :
            'bg-yellow-500/10 text-yellow-500'
          }`}>
            {task.status === 'completed' ? 'Completed' : task.status === 'in_progress' ? 'In Progress' : 'Pending'}
          </span>
          <span className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
            task.priority === 'high' ? 'bg-[var(--color-error)]/10 text-[var(--color-error)]' :
            task.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' :
            'bg-blue-500/10 text-blue-500'
          }`}>
            {task.priority || 'Medium'}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          {task.dueDate && (
            <div className={`flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider ${isOverdue ? 'text-[var(--color-error)]' : 'text-[var(--color-text-secondary)]'}`}>
              {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider opacity-60">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
