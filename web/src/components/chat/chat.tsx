import { widthStore } from '@/stores/width';
import { ChatBody } from './body';
import { ChatInput } from './input';
import { useStore } from '@tanstack/react-store';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Message } from '@/lib/core/types/message';

export function Chat() {
    const width = useStore(widthStore);
    const [messages, setMessages] = useState<Message[]>([]);
    const mutation = useMutation({
        mutationFn: async (chatMessages: Message[]) => {
            const response = await fetch('/api/ai', {
                method: 'POST',
                body: JSON.stringify({
                    messages: chatMessages.map((msg) => ({
                        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
                        role: msg.role,
                    })),
                }),
            });

            // Check if response is not ok (status outside 200-299 range)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            if (!response.body) throw new Error('Response body not found');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Create a placeholder for the assistant's response
            const assistantMessageId = (Date.now() + 1).toString();
            let assistantMessage: Message = {
                id: assistantMessageId,
                content: { response: [] },
                role: 'assistant',
            };

            setMessages((prev) => [...prev, assistantMessage]);

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const parsedChunk = JSON.parse(chunk);

                    // Check if the chunk contains an error
                    if (parsedChunk.error) {
                        throw new Error(parsedChunk.error);
                    }

                    // Update the assistant's message with the new chunk
                    assistantMessage = {
                        ...assistantMessage,
                        content: parsedChunk,
                    };

                    setMessages((prev) => prev.map((msg) => (msg.id === assistantMessageId ? assistantMessage : msg)));
                }
            } catch (error) {
                // Clean up the placeholder message on error
                setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
                throw error; // Re-throw to be caught by React Query
            }

            return assistantMessage;
        },
    });

    const handleSubmit = (message: string) => {
        // Add user message to the conversation
        const userMessage: Message = {
            id: Date.now().toString(),
            content: message,
            role: 'user',
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        // Trigger the mutation with the updated messages
        mutation.mutate(updatedMessages);
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

    return (
        <div className={cn('flex w-full flex-col gap-2', width === 'full' && 'h-full')}>
            <ChatBody messages={messages} onInteract={handleInteract} />
            <ChatInput onSubmit={handleSubmit} />
        </div>
    );
}
