import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  requiresAuth?: boolean;
}

export const NAV_ITEMS: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Treks', href: '/treks' },
  { label: 'Upcoming Batches', href: '/batches' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
