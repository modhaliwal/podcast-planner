
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
      <main className="flex-1 pt-16 sm:pt-20 pb-6 sm:pb-8 md:pb-12">
        {children}
      </main>
      <FloatingToolbar />
    </div>
  );
}
