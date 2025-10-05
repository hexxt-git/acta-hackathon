import { motion } from 'motion/react';
import { Message } from '@/lib/core/types/message';

interface UserMessageProps {
    message: Message;
    index: number;
}

export function UserMessage({ message, index }: UserMessageProps) {
    return (
        <motion.div
            className="bg-primary text-primary-foreground w-fit max-w-[90%] self-end rounded-md px-2 py-1 text-sm shadow-sm dark:border-r dark:border-white/70"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1, ease: 'easeOut' }}
            key={index}
        >
            {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
        </motion.div>
    );
}
