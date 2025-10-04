import { Store } from '@tanstack/store';

const widthStore = new Store<'full' | 'narrow'>('narrow');

export { widthStore };
