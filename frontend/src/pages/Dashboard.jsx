import React, { useState, useEffect, useContext } from 'react';
import { Plus, ListTodo, Loader2, CheckCircle2, Clock, BarChart3, Search, Filter } from 'lucide-react';
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
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async (pageNum = 1, append = false) => {
    setIsLoadingTasks(pageNum === 1);
    try {
      const params = { page: pageNum, limit: 9 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (sortBy) {
        const [field, order] = sortBy.split(':');
        params.sortBy = field;
        params.sortOrder = order;
      }
      if (searchQuery) params.search = searchQuery;
      
      const response = await api.get('/tasks', { params });
      const newTasks = response.data.data.tasks || [];
      const total = response.data.meta?.total || 0;
      
      if (append) {
        setTasks(prev => [...prev, ...newTasks]);
      } else {
        setTasks(newTasks);
      }
      
      setHasMore(append ? tasks.length + newTasks.length < total : newTasks.length < total);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTasks(nextPage, true);
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/tasks/stats');
      setStats(response.data.data.stats || { total: 0, pending: 0, in_progress: 0, completed: 0 });
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  useEffect(() => {
    if (user) {
      setPage(1);
      fetchTasks(1, false);
      fetchStats();
    }
  }, [user, statusFilter, priorityFilter, sortBy, searchQuery]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (editingTask) {
        await api.patch(`/tasks/${editingTask._id}`, taskData);
      } else {
        // Check for duplicate title
        const existingTask = tasks.find(t => t.title.toLowerCase() === taskData.title.toLowerCase());
        if (existingTask) {
          await api.patch(`/tasks/${existingTask._id}`, taskData);
          alert('Task already exist! Task update');
        } else {
          await api.post('/tasks', taskData);
        }
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center space-x-4">
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Total Tasks</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.total}</p>
            </div>
          </div>
          <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center space-x-4">
            <div className="bg-amber-500/10 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.pending + stats.in_progress}</p>
            </div>
          </div>
          <div className="bg-[var(--color-card)] p-5 rounded-2xl border border-[var(--color-border)] shadow-sm flex items-center space-x-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl focus-ring text-[var(--color-text-primary)] transition-all-custom"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl focus-ring text-[var(--color-text-primary)] transition-all-custom appearance-none min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl focus-ring text-[var(--color-text-primary)] transition-all-custom appearance-none min-w-[140px]"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-8 py-2.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl focus-ring text-[var(--color-text-primary)] transition-all-custom appearance-none min-w-[160px]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394A3B8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                <option value="createdAt:desc">Newest First</option>
                <option value="createdAt:asc">Oldest First</option>
                <option value="priority:desc">Priority: High to Low</option>
                <option value="dueDate:asc">Deadline: Soonest</option>
              </select>
            </div>
          </div>
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

        {hasMore && !isLoadingTasks && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] rounded-xl font-semibold transition-all-custom shadow-sm hover:shadow-md active:scale-95"
            >
              Load More Tasks
            </button>
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
