import Link from 'next/link';

const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-card-border bg-background sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-muted text-sm">
          <span className="text-lg">⏱️</span>
          <span>Dashboard</span>
        </div>
        <Link 
          href="/projects"
          className="text-xs px-3 py-1.5 bg-card-border/50 hover:bg-card-border text-muted hover:text-white rounded-lg transition-colors"
        >
          Projects
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-muted">Last Updated 12 May 2025</span>
        <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-background"></div>
            <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-background"></div>
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-background"></div>
        </div>
        <button className="px-3 py-1.5 border border-card-border rounded-lg text-sm text-muted hover:text-white transition-colors flex items-center gap-2">
            <span>📄</span> Export
        </button>
        <button className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            +
        </button>
      </div>
    </header>
  );
};

export default Header;
