import React, { useState, useEffect, useContext } from 'react';
import { Plus, ListTodo, Loader2 } from 'lucide-react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    setIsLoadingTasks(true);
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">My Tasks</h1>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-1">Manage your day, stay productive.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 rounded-lg font-medium transition-all-custom focus-ring shadow-sm active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] rounded-lg text-sm font-medium flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-[var(--color-error)] hover:text-red-400 focus-ring rounded-md px-2 py-1">
              Dismiss
            </button>
          </div>
        )}

        {isLoadingTasks ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-sm">
            <div className="bg-[var(--color-background)] w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border border-[var(--color-border)] shadow-sm">
              <ListTodo className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">No tasks found</h3>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-sm text-center mb-6">
              You're all caught up! Create a new task to keep track of what you need to do next.
            </p>
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] px-4 py-2 rounded-lg font-medium transition-all-custom focus-ring"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                onEdit={openEditModal}
              />
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
      />
    </div>
  );
};

export default Dashboard;
