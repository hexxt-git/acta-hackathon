import { Markdown } from '@/components/ui/markdown';
import { useStore } from '@tanstack/react-store';
import { widthStore } from '@/stores/width';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { Message } from '@/lib/core/types/message';
import { extensions } from '@/lib/core/extensions';

export function ChatBody({
    messages,
    onInteract,
}: {
    messages: Message[];
    onInteract: (interaction: string, props: unknown[]) => void;
}) {
    const width = useStore(widthStore);
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        console.log('scrolled to bottom');
    }, [messages]);

    return (
        <motion.div
            className={cn(
                'bg-card h-full max-h-[calc(100vh-9rem)] grow-1 overflow-y-scroll rounded-md p-1',
                width === 'narrow' && 'h-120 max-h-120',
            )}
            layout
            transition={{
                duration: 0.15,
                ease: 'easeOut',
            }}
            ref={chatBodyRef}
        >
            <div className="flex h-fit min-h-full grow-1 flex-col gap-2 p-2 ps-1 pt-3">
                {messages.length === 0 && (
                    <p className="text-muted-foreground flex h-full grow-1 items-center justify-center text-center text-sm">
                        No messages yet
                    </p>
                )}
                {messages.map((message, index) =>
                    message.role === 'user' ? (
                        <motion.div
                            className="bg-primary text-primary-foreground w-fit self-end rounded-md px-2 py-1 text-sm shadow-sm"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.1, ease: 'easeOut' }}
                            key={index}
                        >
                            {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="w-full max-w-[90%] rounded-md p-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            key={index}
                        >
                            {Array.isArray(message.content.response) &&
                                message.content.response.map((part, index) => {
                                    if (typeof part === 'string') {
                                        return <Markdown content={part} key={`text-${index}`} />;
                                    }
                                    const extension = extensions.find((ext) => ext.name === part.extension);
                                    if (!extension) return 'UNKNOWN EXTENSION';
                                    return (
                                        <extension.renderer
                                            key={`${part.extension}-${index}`}
                                            {...part.response}
                                            onInteract={onInteract}
                                        />
                                    );
                                })}
                        </motion.div>
                    ),
                )}
                <div ref={bottomRef} />
            </div>
        </motion.div>
    );
}
