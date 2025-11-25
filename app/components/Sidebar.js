'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Search', icon: '🔍', href: '#' },
    { name: 'Taskplus AI', icon: '✨', href: '#' },
    { name: 'Templates', icon: '📋', href: '#' },
    { name: 'Notification', icon: '🔔', href: '#' },
    { name: 'Dashboard', icon: '⏱️', href: '/', active: pathname === '/' },
    { name: 'Car Diagnosis', icon: '🚗', href: '/car-diagnosis', active: pathname === '/car-diagnosis' },
    { name: 'Projects', icon: '📁', href: '/projects', active: pathname?.startsWith('/projects') },
    { name: 'Inbox', icon: '📥', href: '#' },
    { name: 'Calendar', icon: '📅', href: '#' },
    { name: 'Reports', icon: '📊', href: '#' },
    { name: 'Help & Center', icon: 'ℹ️', href: '#' },
    { name: 'Settings', icon: '⚙️', href: '#' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-card-border h-screen flex flex-col p-4 fixed left-0 top-0 overflow-y-auto">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">T</div>
        <span className="font-bold text-lg">Taskplus</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              item.active
                ? 'bg-card-border text-white'
                : 'text-muted hover:text-white hover:bg-card-border/50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4">
        <div className="bg-gradient-to-br from-card-border to-black p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-50">✖</div>
            <div className="w-10 h-10 bg-gray-600 rounded-lg mb-3 flex items-center justify-center">💎</div>
            <h3 className="font-bold text-white mb-1">Upgrade to Pro!</h3>
            <p className="text-xs text-muted mb-3">Unlock Premium Features and Manage Unlimited projects</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors">
                Upgrade Now
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
