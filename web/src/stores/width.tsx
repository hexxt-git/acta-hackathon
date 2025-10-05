import { Store } from '@tanstack/react-store';
import { sidebarStore } from './sidebar';

const STORAGE_KEY = 'width-preference';

// Load from localStorage if available
const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

const widthStore = new Store<'full' | 'narrow'>(saved === 'narrow' ? 'narrow' : 'full');

// Persist changes
if (typeof window !== 'undefined') {
    widthStore.subscribe((state) => {
        localStorage.setItem(STORAGE_KEY, state.currentVal);
        if (state.currentVal === 'narrow') {
            sidebarStore.setState('closed');
        }
    });
}

export { widthStore };
