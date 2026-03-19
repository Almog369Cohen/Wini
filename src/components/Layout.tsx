import { ReactNode } from 'react';
import {
  Home,
  ListChecks,
  AlertCircle,
  BookOpen,
  Trophy,
} from 'lucide-react';
import type { Page } from '../types';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: ReactNode;
}

const navItems: { page: Page; label: string; Icon: typeof Home }[] = [
  { page: 'dashboard', label: 'הגן שלי', Icon: Home },
  { page: 'habits', label: 'הרגלים', Icon: ListChecks },
  { page: 'sos', label: 'SOS', Icon: AlertCircle },
  { page: 'journal', label: 'יומן', Icon: BookOpen },
  { page: 'milestones', label: 'הישגים', Icon: Trophy },
];

export default function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}>{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-cream-dark z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-around items-center max-w-lg mx-auto h-16">
          {navItems.map(({ page, label, Icon }) => {
            const isActive = currentPage === page;
            const isSOS = page === 'sos';
            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${
                  isSOS
                    ? 'relative -mt-4'
                    : ''
                } ${
                  isActive
                    ? 'text-sage scale-105'
                    : 'text-text-light hover:text-sage-light'
                }`}
              >
                {isSOS ? (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-coral text-white shadow-lg'
                        : 'bg-coral-light/30 text-coral'
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                ) : (
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                )}
                <span
                  className={`text-[10px] ${
                    isActive ? 'font-semibold' : 'font-normal'
                  } ${isSOS ? 'mt-0.5' : ''}`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
