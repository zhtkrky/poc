const StatsCard = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');

  return (
    <div className="bg-card p-5 rounded-xl border border-card-border flex-1 min-w-[200px]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-muted text-sm font-medium mb-1">{title}</h3>
          <div className="text-3xl font-bold">{value}</div>
        </div>
        <div className="w-10 h-10 bg-card-border rounded-lg flex items-center justify-center text-muted">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className={`font-bold ${isPositive ? 'text-white' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="text-muted">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;
