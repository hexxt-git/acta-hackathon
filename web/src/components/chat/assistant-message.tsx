import { motion } from 'motion/react';
import { Markdown } from '@/components/ui/markdown';
import { extensions } from '@/lib/core/extensions';
import { Message } from '@/lib/core/types/message';

interface AssistantMessageProps {
    message: Message;
    index: number;
    onInteract: (interaction: string, props: unknown[]) => void;
}

export function AssistantMessage({ message, index, onInteract }: AssistantMessageProps) {
    if (
        message.role !== 'assistant' ||
        !message.content ||
        typeof message.content !== 'object' ||
        !('response' in message.content)
    ) {
        return null;
    }

    const response = message.content.response;
    if (!Array.isArray(response)) {
        return null;
    }

    return (
        <motion.div
            className="w-full max-w-[90%] space-y-2 rounded-md p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            key={index}
        >
            {response.map((part: any, partIndex: number) => {
                if (typeof part === 'string') {
                    return <Markdown content={part} key={`text-${partIndex}`} />;
                }
                const extension = extensions.find((ext) => ext.name === part.extension);
                if (!extension) return 'UNKNOWN EXTENSION';
                return (
                    <extension.renderer
                        key={`${part.extension}-${partIndex}`}
                        {...part.response}
                        onInteract={onInteract}
                    />
                );
            })}
        </motion.div>
    );
}
