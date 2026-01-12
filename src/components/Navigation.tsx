'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Today', icon: '📅' },
  { href: '/habits', label: 'Habits', icon: '✏️' },
  { href: '/streaks', label: 'Streaks', icon: '🔥' },
  { href: '/recap', label: 'Recap', icon: '📊' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-lg font-semibold text-gray-900">
            New Parent Micro-Habits
          </h1>
        </div>
        <div className="flex gap-1 -mb-px">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  isActive
                    ? 'bg-gray-50 text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
