import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Markdown } from '@/components/ui/markdown';
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
            <div className="flex w-full max-w-md flex-col gap-2 max-md:grow-1">
                <div className="bg-card flex h-full flex-col gap-2 overflow-y-scroll rounded-md p-2 max-md:grow-1 md:h-86">
                    <div className="bg-primary text-primary-foreground w-fit self-end rounded-md px-2 py-1 text-sm">
                        Hello Can you help me with my project?
                    </div>
                    <div className="bg-background w-fit rounded-md p-2 dark:bg-transparent">
                        <Markdown
                            content={`Hello **world**
* List item 1
* List item 2
* List item 3
                            `}
                        />
                    </div>
                </div>
                <InputGroup>
                    <InputGroupInput placeholder="Ask me anything" />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton>Ask</InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </main>
    );
}
