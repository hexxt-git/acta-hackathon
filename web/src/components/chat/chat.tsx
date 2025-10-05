import { widthStore } from '@/stores/width';
import { ChatBody } from './body';
import { ChatInput } from './input';
import { useStore } from '@tanstack/react-store';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Message } from '@/lib/core/types/message';
import { trpcClient } from '@/integrations/tanstack-query/root-provider';

export function Chat({ chatId }: { chatId?: string }) {
    const width = useStore(widthStore);
    const queryClient = useQueryClient();
    const [incomingMessage, setIncomingMessage] = useState<Message | null>(null);

    const {
        data: rawMessages,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['chats', 'get', chatId],
        queryFn: () => (chatId ? trpcClient.chats.get.query({ id: chatId }) : null),
        enabled: !!chatId,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    const messages: Message[] = rawMessages
        ? rawMessages.map((message) => ({
              content: message.role === 'user' ? message.content : JSON.parse(message.content),
              role: message.role as 'user' | 'assistant',
          }))
        : [];

    const mutation = useMutation({
        mutationFn: async (message: string) => {
            if (!chatId) {
                throw new Error('Chat ID is required');
            }

            const response = await fetch('/api/ai', {
                method: 'POST',
                body: JSON.stringify({
                    chatId,
                    message,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            if (!response.body) throw new Error('Response body not found');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const assistantMessage: Message = {
                content: { response: [] },
                role: 'assistant',
            };

            setIncomingMessage(assistantMessage);

            try {
                let finalMessage = assistantMessage;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const parsedChunk = JSON.parse(chunk);

                    if (parsedChunk.error) {
                        throw new Error(parsedChunk.error);
                    }

                    finalMessage = {
                        ...finalMessage,
                        content: parsedChunk,
                    };

                    setIncomingMessage(finalMessage);
                }

                setIncomingMessage(null);
                return finalMessage;
            } catch (error) {
                setIncomingMessage(null);
                throw error;
            }
        },
        onMutate: async (message: string) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ['chats', 'get', chatId] });

            // Snapshot the previous value
            const previousMessages = queryClient.getQueryData(['chats', 'get', chatId]);

            // Optimistically update the cache with the user message
            const optimisticUserMessage = {
                role: 'user' as const,
                content: message,
            };

            queryClient.setQueryData(['chats', 'get', chatId], (old: any) => {
                if (!old) return [optimisticUserMessage];
                return [...old, optimisticUserMessage];
            });

            // Return context for rollback
            return { previousMessages };
        },
        onError: (_err, _message, context) => {
            // Rollback on error
            if (context?.previousMessages) {
                queryClient.setQueryData(['chats', 'get', chatId], context.previousMessages);
            }
        },
        onSuccess: () => {
            // Invalidate chat data and chat list after successful mutation
            queryClient.invalidateQueries({
                queryKey: ['chats', 'get', chatId],
            });
            queryClient.invalidateQueries({
                queryKey: ['chats'],
            });
        },
    });

    const handleSubmit = (message: string) => {
        // Trigger the mutation with the user message content
        // The server will handle storing both user and assistant messages
        // Cache invalidation will update the UI
        if (message.trim() === '') return;
        if (mutation.isPending || incomingMessage !== null) return;
        mutation.mutate(message);
    };

    const handleInteract = (interaction: string, props: unknown[]) => {
        switch (interaction) {
            case 'select': {
                const [option] = props as [string?];
                if (typeof option === 'string') {
                    handleSubmit(option);
                }
                break;
            }
            default:
                break;
        }
    };

    const displayMessages = incomingMessage ? [...messages, incomingMessage] : messages;

    if (error) {
        return (
            <div className={cn('flex w-full flex-col gap-2', width === 'full' && 'h-full')}>
                <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <p className="mb-2 text-red-500">Failed to load chat messages</p>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['chats', 'get', chatId] })}
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex w-full flex-col gap-2', width === 'full' && 'h-full')}>
            <ChatBody
                messages={displayMessages}
                onInteract={handleInteract}
                pending={mutation.isPending || isLoading}
                key={chatId}
            />
            <ChatInput onSubmit={handleSubmit} pending={mutation.isPending || isLoading || incomingMessage !== null} />
        </div>
    );
}
