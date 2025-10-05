import { Store } from '@tanstack/react-store';

const sidebarStore = new Store<'open' | 'closed'>('open');

export { sidebarStore };
