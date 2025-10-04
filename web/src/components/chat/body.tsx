import { Markdown } from '@/components/ui/markdown';
import { useStore } from '@tanstack/react-store';
import { widthStore } from '@/stores/width';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

type Message = {
    sender: 'user' | 'assistant';
    message: string;
    files: File[];
};

export function ChatBody({ messages }: { messages: Message[] }) {
    const width = useStore(widthStore);
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <motion.div
            className={cn(
                'bg-card h-full max-h-[calc(100vh-7rem)] grow-1 overflow-y-scroll rounded-md p-1',
                width === 'narrow' && 'md:h-120',
            )}
            layout
            transition={{
                duration: 0.15,
                ease: 'easeOut',
            }}
            ref={chatBodyRef}
        >
            <div className="flex h-fit flex-col gap-2 p-2 ps-1 pt-3">
                {messages.map((message) =>
                    message.sender === 'user' ? (
                        <motion.div
                            className="bg-primary text-primary-foreground w-fit self-end rounded-md px-2 py-1 text-sm"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                        >
                            {message.message}
                        </motion.div>
                    ) : (
                        <div className="w-full max-w-[90%] rounded-md p-2">
                            <Markdown content={message.message} />
                        </div>
                    ),
                )}
                <div ref={bottomRef} />
            </div>
        </motion.div>
    );
}
