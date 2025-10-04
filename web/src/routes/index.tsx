import { Chat } from '@/components/chat/chat';
import { WidthToggle } from '@/components/ui/width-toggle';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { createFileRoute } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { useStore } from '@tanstack/react-store';
import { widthStore } from '@/stores/width';
export const Route = createFileRoute('/')({
    component: App,
    ssr: false,
});

function App() {
    const width = useStore(widthStore);
    return (
        <main
            className={cn(
                'flex w-full flex-col items-center justify-center gap-2 p-2',
                width === 'narrow' ? 'min-h-svh' : 'min-h-svh',
            )}
        >
            <h1 className="flex items-center gap-4 text-3xl font-bold">
                Ai Assistant
                <div className={cn('top-4 right-4 flex items-center gap-1', width === 'narrow' && 'md:fixed')}>
                    <WidthToggle />
                    <ThemeToggle />
                </div>
            </h1>
            <Chat />
        </main>
    );
}
