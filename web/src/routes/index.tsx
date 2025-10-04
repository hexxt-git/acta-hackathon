import { Chat } from '@/components/chat/chat';
import { createFileRoute } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { useStore } from '@tanstack/react-store';
import { widthStore } from '@/stores/width';
import { sidebarStore } from '@/stores/sidebar';
import { useEffect } from 'react';
import { SidebarPanel } from '@/components/layout/sidebar-panel';
import { TopBar } from '@/components/layout/top-bar';
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
        <div className="flex h-svh w-full items-stretch justify-center gap-2 overflow-y-hidden p-2">
            <SidebarPanel />
            <main
                className={cn(
                    'w-full',
                    width === 'narrow' ? 'flex flex-col items-center justify-center md:max-w-xl' : 'md:max-w-7xl',
                )}
            >
                <TopBar onSidebarToggle={handleSidebarToggle} />
                <Chat />
            </main>
        </div>
    );
}
