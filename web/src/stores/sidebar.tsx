import { Store } from '@tanstack/store';

const sidebarStore = new Store<'open' | 'closed'>('open');

export { sidebarStore };
