import { Chat } from '@/components/chat/chat';
import { WidthToggle } from '@/components/ui/width-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { createFileRoute } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { useStore } from '@tanstack/react-store';
import { widthStore } from '@/stores/width';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Sidebar } from 'lucide-react';
import { sidebarStore } from '@/stores/sidebar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEffect } from 'react';
export const Route = createFileRoute('/')({
    component: App,
    ssr: false,
});

function App() {
    const width = useStore(widthStore);
    const sidebar = useStore(sidebarStore);
    const handleSidebarToggle = () => {
        sidebarStore.setState(sidebar === 'open' ? 'closed' : 'open');
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                widthStore.setState('full');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-svh w-full items-stretch justify-center gap-2 overflow-hidden p-2">
            <motion.aside
                animate={{
                    opacity: sidebar === 'open' ? 1 : 0,
                    width: sidebar === 'open' ? '256px' : '0px',
                    padding: sidebar === 'open' ? '0.5rem' : '0px',
                }}
                className={cn('bg-card overflow-hidden rounded-md max-md:hidden', width === 'narrow' && 'hidden')}
                transition={{ duration: 0.15, ease: 'easeOut' }}
            >
                sidebar
            </motion.aside>
            <main
                className={cn(
                    'w-full',
                    width === 'narrow' ? 'flex flex-col items-center justify-center md:max-w-xl' : 'md:max-w-7xl',
                )}
            >
                <motion.div
                    className={cn('flex w-full items-center justify-between gap-4')}
                    layout="position"
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                    <div className="flex w-full items-center gap-1">
                        <motion.div className={cn(width === 'narrow' && 'fixed top-4 left-4')}>
                            <Popover
                                open={sidebar === 'open'}
                                onOpenChange={(open) => !open && sidebarStore.setState('closed')}
                            >
                                <PopoverTrigger>
                                    <Button variant="ghost" size="icon" onClick={handleSidebarToggle}>
                                        <Sidebar className="size-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className={cn('shadow-none', width === 'full' && 'md:hidden')}
                                >
                                    <div>Sidebar</div>
                                </PopoverContent>
                            </Popover>
                        </motion.div>
                        <h1
                            className={cn(
                                'flex items-center gap-2 p-2 font-bold',
                                width === 'full'
                                    ? 'text-2xl/[1.1]'
                                    : 'w-full translate-y-1 rounded-t-md border-x border-t pb-3',
                            )}
                        >
                            <div className="bg-primary inline-block size-2 rounded-full" /> Your AI Assistant{' '}
                            {width === 'narrow' ? 'Embedded' : 'Application'}
                        </h1>
                    </div>
                    <motion.div
                        id="width-toggle"
                        key="width-toggle"
                        layout
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={cn('top-4 right-4 flex items-center gap-1', width === 'narrow' && 'md:fixed')}
                    >
                        <WidthToggle />
                        <ThemeToggle />
                    </motion.div>
                </motion.div>
                <Chat />
            </main>
        </div>
    );
}
