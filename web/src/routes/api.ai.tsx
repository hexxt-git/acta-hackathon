import { createFileRoute } from '@tanstack/react-router';
import { validateRequestBody } from '../lib/api';
import z from 'zod';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { prompt, responseSchema } from '../lib/core/prompt';
import { addUserMessage, addAssistantMessage, getChatMessages } from '../lib/database';

const inputSchema = z.object({
    chatId: z.string(),
    message: z.string(),
});

async function handler({ request }: { request: Request }) {
    const validationResult = await validateRequestBody(request, inputSchema);

    if ('error' in validationResult) {
        return new Response(JSON.stringify({ error: validationResult.error }), { status: validationResult.status });
    }

    const { chatId, message } = validationResult.data;

    // Add the user message to the database
    await addUserMessage(chatId, message);

    const messages = await getChatMessages(chatId);

    return new Response(
        new ReadableStream({
            async start(controller) {
                try {
                    const result = streamObject({
                        model: google('gemini-2.5-pro'),
                        providerOptions: {
                            google: {
                                thinkingConfig: {
                                    thinkingBudget: 8192,
                                },
                            },
                        },
                        system: prompt,
                        messages,
                        schema: responseSchema,
                    });

                    let receivedMessage = false;
                    let fullResponse: any = null;

                    for await (const partialObject of result.partialObjectStream) {
                        controller.enqueue(JSON.stringify(partialObject));
                        fullResponse = partialObject;
                        receivedMessage = true;
                    }

                    if (!receivedMessage) {
                        throw new Error('No message received');
                    }

                    // Store the assistant's response in the database
                    if (fullResponse) {
                        await addAssistantMessage(chatId, JSON.stringify(fullResponse));
                    }

                    controller.close();
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    controller.enqueue(JSON.stringify({ error: errorMessage }));
                    controller.close();
                }
            },
        }),
        {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        },
    );
}

export const Route = createFileRoute('/api/ai')({
    server: {
        handlers: {
            POST: handler,
        },
    },
});
