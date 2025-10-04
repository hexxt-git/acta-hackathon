import { widthStore } from '@/stores/width';
import { ChatBody } from './body';
import { ChatInput } from './input';
import { useStore } from '@tanstack/react-store';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type Message = {
    sender: 'user' | 'assistant';
    message: string;
    files: File[];
};

export function Chat() {
    const width = useStore(widthStore);

    const [messages, setMessages] = useState<Message[]>([
        { sender: 'user', message: 'I need help with my project', files: [] },
        { sender: 'assistant', message: 'I can help you with that. What is your project?', files: [] },
        { sender: 'user', message: 'It is a web application', files: [] },
        {
            sender: 'assistant',
            message:
                'What is the purpose of your web application?\n- To help people learn about the internet\n- To help people learn about the internet\n- To help people learn about the internet',
            files: [],
        },
        { sender: 'user', message: 'I need help with my project', files: [] },
        {
            sender: 'assistant',
            message: 'Here is the code for my web application\n```javascript\nconsole.log("Hello, world!");\n```',
            files: [],
        },
    ]);

    const handleSubmit = (message: string, files: File[]) => {
        setMessages((prevMessages) => [...prevMessages, { sender: 'user', message, files }]);
    };

    return (
        <div
            className={cn(
                'flex w-full flex-col gap-2',
                width === 'narrow' ? 'max-md:grow-1 md:max-w-xl' : 'max-w-7xl grow-1',
            )}
        >
            <ChatBody messages={messages} />
            <ChatInput onSubmit={handleSubmit} />
        </div>
    );
}
