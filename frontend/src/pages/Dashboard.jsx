import React, { useState, useEffect, useContext } from 'react';
import { Plus, ListTodo } from 'lucide-react';
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
    } catch (err) {
      setError('Failed to load tasks');
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
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">My Tasks</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Manage your day, stay productive.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-4 py-2.5 rounded-lg font-medium transition-all-custom focus-ring shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 text-[var(--color-error)] rounded-xl">
            {error}
          </div>
        )}

        {isLoadingTasks ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)]">
            <div className="bg-[var(--color-background)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-border)]">
              <ListTodo className="w-8 h-8 text-[var(--color-text-secondary)]" />
            </div>
            <h3 className="text-xl font-medium text-[var(--color-text-primary)] mb-2">No tasks yet</h3>
            <p className="text-[var(--color-text-secondary)] max-w-sm mx-auto mb-6">
              You haven't created any tasks. Click the button above to add your first task.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
