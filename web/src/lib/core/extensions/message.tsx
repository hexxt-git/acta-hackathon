import { z } from 'zod';
import { Extension } from '../types/extensions';
import { cn } from '@/lib/utils';
import { Markdown } from '@/components/ui/markdown';

const messageSchema = z.object({
    type: z.enum(['alert', 'warning', 'fun-fact', 'example', 'summary', 'tip', 'note', 'reminder', 'joke']),
    message: z.string().describe('The message to send to the user.'),
});

const messageConfig = {
    alert: {
        emoji: '🚨',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/10',
        borderColor: 'border-red-200 dark:border-red-800',
        title: 'Alert',
    },
    warning: {
        emoji: '⚠️',
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-950/10',
        borderColor: 'border-orange-200 dark:border-orange-800',
        title: 'Warning',
    },
    'fun-fact': {
        emoji: '🎯',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-950/10',
        borderColor: 'border-purple-200 dark:border-purple-800',
        title: 'Fun Fact',
    },
    example: {
        emoji: '💡',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/10',
        borderColor: 'border-green-200 dark:border-green-800',
        title: 'Example',
    },
    summary: {
        emoji: '📋',
        color: 'text-teal-600 dark:text-teal-400',
        bgColor: 'bg-teal-50 dark:bg-teal-950/10',
        borderColor: 'border-teal-200 dark:border-teal-800',
        title: 'Summary',
    },
    tip: {
        emoji: '💡',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/10',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        title: 'Tip',
    },
    note: {
        emoji: '📝',
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-950/10',
        borderColor: 'border-gray-200 dark:border-gray-800',
        title: 'Note',
    },
    reminder: {
        emoji: '🔔',
        color: 'text-pink-600 dark:text-pink-400',
        bgColor: 'bg-pink-50 dark:bg-pink-950/10',
        borderColor: 'border-pink-200 dark:border-pink-800',
        title: 'Reminder',
    },
    joke: {
        emoji: '🤣',
        color: 'text-pink-600 dark:text-pink-400',
        bgColor: 'bg-pink-50 dark:bg-pink-950/10',
        borderColor: 'border-pink-200 dark:border-pink-800',
        title: 'Joke',
    },
    default: {
        emoji: '💬',
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-950/10',
        borderColor: 'border-gray-200 dark:border-gray-800',
        title: 'Message',
    },
};

const messageRenderer = ({ message, type = 'alert' }: Partial<z.infer<typeof messageSchema>>) => {
    const config = messageConfig[type] || messageConfig.default;

    return (
        <div className={cn('w-fit rounded-l-xs rounded-r-lg border-l-2 p-2 pe-4', config.bgColor, config.borderColor)}>
            <div className="flex items-center gap-3">
                <div className={cn('text-base font-semibold', config.color)}>
                    {config.emoji} {config.title}
                </div>
            </div>

            <div className="text-foreground text-sm leading-relaxed">
                <Markdown content={message || ''} />
            </div>
        </div>
    );
};

export const messageExtension = {
    name: 'message',
    prompt: 'use when you want to convey something to the user. do NOT use too much or use when not actually conveying something but just chatting. do NOT use info type when just chatting.',
    schema: messageSchema,
    renderer: messageRenderer,
} satisfies Extension<z.infer<typeof messageSchema>>;
