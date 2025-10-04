import { Store } from '@tanstack/store';

const widthStore = new Store<'full' | 'narrow'>('full');

export { widthStore };
