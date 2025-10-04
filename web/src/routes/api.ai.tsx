import { createFileRoute } from '@tanstack/react-router';
import { validateRequestBody } from '../lib/api';
import z from 'zod';
import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { prompt, responseSchema } from '../lib/core/prompt';

const inputSchema = z.object({
    messages: z.array(
        z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string(),
        }),
    ),
});

async function handler({ request }: { request: Request }) {
    const validationResult = await validateRequestBody(request, inputSchema);

    if ('error' in validationResult) {
        return new Response(JSON.stringify({ error: validationResult.error }), { status: validationResult.status });
    }

    const { messages } = validationResult.data;

    return new Response(
        new ReadableStream({
            async start(controller) {
                try {
                    const result = streamObject({
                        model: google('gemini-2.5-flash'),
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

                    for await (const partialObject of result.partialObjectStream) {
                        controller.enqueue(JSON.stringify(partialObject));
                        receivedMessage = true;
                    }

                    if (!receivedMessage) {
                        throw new Error('No message received');
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
