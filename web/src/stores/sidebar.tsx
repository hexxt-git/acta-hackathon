import { Store } from '@tanstack/store';
import { widthStore } from './width';

const sidebarStore = new Store<'open' | 'closed'>(widthStore.state === 'narrow' ? 'closed' : 'open');

export { sidebarStore };
