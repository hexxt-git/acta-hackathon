import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useStore } from '@tanstack/react-store';
import { sidebarStore } from '@/stores/sidebar';
import { widthStore } from '@/stores/width';
import { Sidebar } from './sidebar.tsx';

export function SidebarPanel() {
    const width = useStore(widthStore);
    const sidebar = useStore(sidebarStore);

    return (
        <motion.aside
            animate={{
                opacity: sidebar === 'open' ? 1 : 0,
                width: sidebar === 'open' ? '280px' : '0px',
                padding: sidebar === 'open' ? '0.5rem' : '0px',
            }}
            className={cn(
                'bg-card overflow-hidden rounded-md max-md:hidden dark:border-r',
                width === 'narrow' && 'hidden',
            )}
            transition={{ duration: 0.15, ease: 'easeOut' }}
        >
            <Sidebar />
        </motion.aside>
    );
}
