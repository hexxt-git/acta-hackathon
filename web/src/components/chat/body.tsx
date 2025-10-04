import { useStore } from '@tanstack/react-store';
import { widthStore } from '@/stores/width';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { Message } from '@/lib/core/types/message';
import { MessagesContainer } from './messages-container';

export function ChatBody({
    messages,
    onInteract,
}: {
    messages: Message[];
    onInteract: (interaction: string, props: unknown[]) => void;
}) {
    const width = useStore(widthStore);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
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
            <MessagesContainer messages={messages} onInteract={onInteract} />
        </motion.div>
    );
}
