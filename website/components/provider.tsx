'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { DialogHost } from 'react-confirm-alert';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }}>
      {children}
      {/* Every dialog on this site renders here, inside the providers, and closes on navigation. */}
      <DialogHost dismissKey={usePathname()} />
    </RootProvider>
  );
}
