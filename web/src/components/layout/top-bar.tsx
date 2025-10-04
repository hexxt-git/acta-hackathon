import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useStore } from '@tanstack/react-store';
import { widthStore } from '@/stores/width';
import { sidebarStore } from '@/stores/sidebar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Plus, Sidebar } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { WidthToggle } from '@/components/ui/width-toggle';
import { Sidebar as SidebarContent } from './sidebar.tsx';
import { useNavigate } from '@tanstack/react-router';

type TopBarProps = {
    onSidebarToggle: () => void;
};

export function TopBar({ onSidebarToggle }: TopBarProps) {
    const width = useStore(widthStore);
    const sidebar = useStore(sidebarStore);
    const navigate = useNavigate();

    return (
        <motion.div
            className={cn('flex w-full items-center justify-between gap-4')}
            layout="position"
            transition={{ duration: 0.15, ease: 'easeOut' }}
        >
            <div className="flex w-full items-center gap-1">
                <motion.div className={cn(width === 'narrow' && 'fixed top-4 left-4')}>
                    <Popover
                        open={sidebar === 'open'}
                        onOpenChange={(open) => !open && width === 'narrow' && sidebarStore.setState('closed')}
                    >
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
                                <Sidebar className="size-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="start"
                            className={cn('bg-card shadow-none', width === 'full' && 'md:hidden')}
                        >
                            <SidebarContent />
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
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        navigate({ to: '/', search: { chatId: Math.random().toString(36).substring(2, 15) } })
                    }
                >
                    <Plus />
                </Button>
                <WidthToggle />
                <ThemeToggle />
            </motion.div>
        </motion.div>
    );
}
