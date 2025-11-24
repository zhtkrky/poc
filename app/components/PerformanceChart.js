'use client';

import { useGetPerformanceQuery } from '../lib/api/statsApi';
import { ErrorMessage } from './ErrorMessage';
import { Skeleton } from './LoadingSpinner';

const PerformanceChart = () => {
  const { data: performanceData, isLoading: loading, error, refetch } = useGetPerformanceQuery();

  if (error) {
    return (
      <div className="bg-card p-6 rounded-xl border border-card-border h-full">
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-xl border border-card-border h-full">
        <Skeleton variant="text" className="w-24 mb-2" />
        <Skeleton variant="text" className="w-32 h-10 mb-6" />
        <div className="flex items-end justify-between h-40 gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="default" className="flex-1 h-full rounded-t-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!performanceData) return null;

  const { overall, change, period, data } = performanceData;

  return (
    <div className="bg-card p-6 rounded-xl border border-card-border h-full">
      <h3 className="text-muted text-sm font-medium mb-1">Performance</h3>
      <div className="flex items-end gap-2 mb-6">
        <span className="text-4xl font-bold">{overall}%</span>
        <span className="text-xs text-white font-bold mb-1">{change}</span>
        <span className="text-xs text-muted mb-1">{period}</span>
      </div>

      <div className="flex items-end justify-between h-40 gap-2">
        {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-pointer">
                <div className="relative w-full flex items-end justify-center h-full">
                    {/* Background bar */}
                    <div className="absolute bottom-0 w-full h-full bg-card-border/20 rounded-t-lg"></div>
                    {/* Active bar */}
                    <div 
                        className={`w-full mx-1 rounded-t-lg transition-all duration-300 relative group-hover:opacity-80 ${item.active ? 'bg-white' : 'bg-card-border'}`}
                        style={{ height: `${item.value}%` }}
                    >
                    </div>
                    {/* Label inside bar */}
                     <span className={`absolute bottom-2 text-[10px] font-bold z-10 ${item.active ? 'text-black' : 'text-white'}`}>
                        {item.label}
                    </span>
                </div>
                <span className="text-xs text-muted">{item.day}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;
