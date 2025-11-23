'use client';

import { useEffect } from 'react';
import { useStats } from '../lib/hooks/useStats';
import { useTasks } from '../lib/hooks/useTasks';

/**
 * Test Component for useQuery Hook
 * Add this to your page to verify the hook is working
 */
export default function QueryTester() {
  const { data: stats, loading: statsLoading, error: statsError, refetch, isStale } = useStats();
  const { data: tasks, loading: tasksLoading } = useTasks();

  // Log state changes
  useEffect(() => {
    console.log('📊 Stats Query State:', {
      data: stats,
      loading: statsLoading,
      error: statsError,
      isStale,
      timestamp: new Date().toISOString()
    });
  }, [stats, statsLoading, statsError, isStale]);

  useEffect(() => {
    console.log('📋 Tasks Query State:', {
      data: tasks,
      loading: tasksLoading,
      timestamp: new Date().toISOString()
    });
  }, [tasks, tasksLoading]);

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-card-border rounded-xl p-4 max-w-sm shadow-2xl z-50">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        🧪 Query Tester
      </h3>
      
      <div className="space-y-3 text-xs">
        {/* Stats Status */}
        <div className="bg-background rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Stats Query</span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${
              statsLoading ? 'bg-blue-500/20 text-blue-400' :
              statsError ? 'bg-red-500/20 text-red-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {statsLoading ? 'Loading' : statsError ? 'Error' : 'Success'}
            </span>
          </div>
          <div className="text-muted space-y-1">
            <div>Items: {stats?.length || 0}</div>
            <div>Stale: {isStale ? 'Yes' : 'No'}</div>
            {statsError && <div className="text-red-400">Error: {statsError}</div>}
          </div>
          <button
            onClick={() => refetch()}
            className="mt-2 w-full px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded text-[10px] font-medium transition-colors"
          >
            Refetch
          </button>
        </div>

        {/* Tasks Status */}
        <div className="bg-background rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Tasks Query</span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${
              tasksLoading ? 'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {tasksLoading ? 'Loading' : 'Success'}
            </span>
          </div>
          <div className="text-muted">
            Items: {tasks?.length || 0}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-background rounded-lg p-3 border border-primary/20">
          <div className="font-medium mb-1">Test Actions:</div>
          <ul className="text-muted space-y-1 text-[10px]">
            <li>• Switch tabs to test refetch</li>
            <li>• Check console for logs</li>
            <li>• Click refetch button</li>
            <li>• Open Network tab</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
