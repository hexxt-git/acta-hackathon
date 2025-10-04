import { Chat } from '@/components/chat/chat';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
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
    const navigate = useNavigate();
    const handleSidebarToggle = () => {
        sidebarStore.setState(sidebar === 'open' ? 'closed' : 'open');
    };
    // I'd use params but this is easier for now
    const chatId: string | undefined = (useSearch({ strict: false }) as any).chatId;

    useEffect(() => {
        if (!chatId) {
            const newChat = Math.random().toString(36).substring(2, 15);
            navigate({ to: '/', search: { chatId: newChat } });
        }
    }, [chatId]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                widthStore.setState('full');
                sidebarStore.setState('closed');
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
                <Chat chatId={chatId} />
            </main>
        </div>
    );
}
