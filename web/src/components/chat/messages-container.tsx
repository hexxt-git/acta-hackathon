import { Message } from '@/lib/core/types/message';
import { UserMessage } from './user-message';
import { AssistantMessage } from './assistant-message';
import { ChatBodyErrorBoundary } from './error-boundaries';
import { PendingMessage } from './pending-message';
import { motion } from 'motion/react';

interface MessagesContainerProps {
    messages: Message[];
    onInteract: (interaction: string, props: unknown[]) => void;
    pending: boolean;
}

export function MessagesContainer({ messages, onInteract, pending }: MessagesContainerProps) {
    return (
        <ChatBodyErrorBoundary>
            <div className="flex h-fit min-h-full grow-1 flex-col gap-2 p-2 ps-1 pt-3">
                {messages.length === 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="text-muted-foreground flex h-full grow-1 items-center justify-center text-center text-sm"
                    >
                        No messages yet
                    </motion.p>
                )}
                {messages.map((message, index) =>
                    message.role === 'user' ? (
                        <UserMessage key={index} message={message} index={index} />
                    ) : (
                        <AssistantMessage key={index} message={message} index={index} onInteract={onInteract} />
                    ),
                )}
                {pending && <PendingMessage />}
            </div>
        </ChatBodyErrorBoundary>
    );
}
