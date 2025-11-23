'use client';

import { ErrorMessage } from './components/ErrorMessage';
import Header from './components/Header';
import { CardSkeleton } from './components/LoadingSpinner';
import PerformanceChart from './components/PerformanceChart';
import ProjectList from './components/ProjectList';
import QueryTester from './components/QueryTester';
import StatsCard from './components/StatsCard';
import TaskList from './components/TaskList';
import { useStats } from './lib/hooks/useStats';
import { useSummary } from './lib/hooks/useSummary';




export default function Home() {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useStats();
  const { data: summary, loading: summaryLoading, error: summaryError } = useSummary();
  return (
    <div className="flex min-h-screen bg-background">
      <QueryTester />
      
      <div className="flex-1 ml-64">
        <Header />
        
        <main className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back, John Connor! 👋</h1>
            {summaryLoading ? (
              <div className="h-5 w-96 bg-card-border animate-pulse rounded"></div>
            ) : summary ? (
              <p className="text-muted text-sm">
                <span className="font-bold text-white">{summary.tasksDueToday}</span> Tasks Due Today, 
                <span className="font-bold text-white ml-2">{summary.overdueTasks}</span> Overdue Tasks, 
                <span className="font-bold text-white ml-2">{summary.upcomingDeadlines}</span> Upcoming Deadlines (This Week)
              </p>
            ) : null}
          </div>

          {/* Stats Cards */}
          {statsError && <ErrorMessage error={statsError} onRetry={refetchStats} className="mb-8" />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsLoading ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : stats ? (
              stats.map((stat) => (
                <StatsCard 
                  key={stat.id}
                  title={stat.title} 
                  value={stat.value} 
                  change={`${stat.change} vs last month`} 
                  icon={stat.icon} 
                />
              ))
            ) : null}
          </div>

          {/* Tasks and Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <TaskList />
            </div>
            <div>
              <PerformanceChart />
            </div>
          </div>

          {/* Project List */}
          <ProjectList />
        </main>
      </div>
    </div>
  );
}
