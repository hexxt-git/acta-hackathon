import { Store } from '@tanstack/store';

const sidebarStore = new Store<'open' | 'closed'>('closed');

export { sidebarStore };
