import { Chat } from '@/components/chat/chat';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/')({
    component: App,
});

function App() {
    return (
        <main className="flex min-h-svh w-full flex-col items-center justify-center gap-4 p-2">
            <div className="fixed top-4 right-4">
                <ThemeToggle />
            </div>
            <h1 className="text-3xl font-bold">Ai Assistant</h1>
            <Chat />
        </main>
    );
}
