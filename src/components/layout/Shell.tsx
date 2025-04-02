
import { ReactNode } from 'react';
import { Header } from './Header';
import { FloatingToolbar } from '../toolbar/FloatingToolbar';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-14 sm:pt-16 pb-4 sm:pb-6 md:pb-8">
        {children}
      </main>
      <FloatingToolbar />
    </div>
  );
}
