'use client';

import { useGetTasksQuery } from '../lib/api/tasksApi';
import { EmptyState, ErrorMessage } from './ErrorMessage';
import { TableSkeleton } from './LoadingSpinner';

const TaskList = () => {
  const { data: tasks, isLoading: loading, error, refetch } = useGetTasksQuery();

  return (
    <div className="bg-card p-6 rounded-xl border border-card-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Today's Tasks</h3>
        <div className="flex gap-2">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">🔍</span>
                <input type="text" placeholder="Search here.." className="bg-background border border-card-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary w-40" />
            </div>
            <button className="px-3 py-1.5 border border-card-border rounded-lg text-sm text-muted hover:text-white flex items-center gap-2">
                <span>⚡</span> Filter
            </button>
        </div>
      </div>

      {error && <ErrorMessage error={error} onRetry={refetch} />}

      {loading && !error && <TableSkeleton rows={5} />}

      {!loading && !error && tasks && tasks.length === 0 && (
        <EmptyState message="No tasks for today" icon="✅" />
      )}

      {!loading && !error && tasks && tasks.length > 0 && (
        <div className="space-y-1">
          <div className="grid grid-cols-12 text-xs text-muted px-3 py-2">
              <div className="col-span-5">Task Name</div>
              <div className="col-span-4">Project</div>
              <div className="col-span-3 text-right">Due</div>
          </div>
          {tasks.map((task) => (
            <div key={task.id} className="grid grid-cols-12 items-center px-3 py-3 rounded-lg hover:bg-card-border/30 transition-colors group">
              <div className="col-span-5 flex items-center gap-3">
                  <div className="w-5 h-5 rounded border border-muted group-hover:border-primary flex items-center justify-center cursor-pointer"></div>
                  <span className="text-sm font-medium">{task.name}</span>
              </div>
              <div className="col-span-4 flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${task.projectColor}`}></div>
                  <span className="text-sm">{task.project}</span>
              </div>
              <div className="col-span-3 text-right text-sm text-white font-medium">
                  {task.due}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
