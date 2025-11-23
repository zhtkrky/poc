'use client';

import { useProjects } from '../lib/hooks/useProjects';
import { TableSkeleton } from './LoadingSpinner';

const ProjectList = () => {
  const { data: projects, loading, error, refetch } = useProjects();

  return (
    <div className="bg-card p-6 rounded-xl border border-card-border mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">List Projects</h3>
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

      {loading && !error && <TableSkeleton rows={3} />}

      {!loading && !error && projects && projects.length === 0 && (
        <EmptyState message="No projects found" icon="📁" />
      )}

      {!loading && !error && projects && projects.length > 0 && (
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="text-xs text-muted border-b border-card-border/50">
                    <th className="py-3 px-4 font-medium">Project Name</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Progress</th>
                    <th className="py-3 px-4 font-medium">Total Tasks</th>
                    <th className="py-3 px-4 font-medium">Due Date</th>
                    <th className="py-3 px-4 font-medium">Owner</th>
                </tr>
            </thead>
            <tbody>
                {projects.map((project) => (
                    <tr key={project.id} className="border-b border-card-border/30 hover:bg-card-border/10 transition-colors">
                        <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500/20 text-blue-500 rounded flex items-center justify-center">📁</div>
                                <span className="font-medium text-sm">{project.name}</span>
                            </div>
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
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default ProjectList;
