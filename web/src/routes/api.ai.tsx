import { createFileRoute } from '@tanstack/react-router';
import { validateRequestBody } from '../lib/api';
import z from 'zod';
import { streamObject, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { prompt, responseSchema } from '../lib/core/prompt';
import { addUserMessage, addAssistantMessage, getChatMessages } from '../lib/database';

const inputSchema = z.object({
    chatId: z.string(),
    message: z.string(),
});

// const imageSearch = tool({
//     description: 'Search for images on the web',
//     inputSchema: z.object({
//         query: z.string().describe('Search query for images, be detailed and specific'),
//     }),
//     execute: async ({ query }: { query: string }): Promise<{ images: { url: string; title: string }[] }> => {
//         console.log('\n\nquery', query);
//         const response = await fetch(
//             `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=65873b6afbab74bd8&searchType=image&key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}&num=5`,
//         );
//         const data = await response.json();

//         console.log('\n\ndata', data.items);

//         return {
//             images:
//                 data.items?.map((item: { link: string; title: string }) => ({
//                     url: item.link,
//                     title: item.title,
//                 })) || [],
//         };
//     },
// });

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
                    const preResearch = await generateText({
                        model: google('gemini-2.5-flash'),
                        system: "given the following conversation, your purpose is to do the required research to answer the user's questions. you are not supposed to give the answer but do research for the context instead to give the chatbot the best possible information, keep within 500 characters. be strictly objective. your response will be used as a reference you may not communicate with the user or the chatbot in any way",
                        messages: [
                            {
                                role: 'user',
                                content: JSON.stringify({
                                    history: messages.map((msg) => ({
                                        role: msg.role,
                                        content: msg.content,
                                    })),
                                    query: message,
                                }),
                            },
                        ],
                        tools: {
                            google_search: google.tools.googleSearch({}),
                            // image_search: imageSearch, // can't use both tools at the same time and this wasn't working with the ai sdk
                        },
                        toolChoice: 'required',
                    });
                    console.log('\n\npreResearch', preResearch.text);
                    const result = streamObject({
                        model: google('gemini-2.5-pro'),
                        providerOptions: {
                            google: {
                                thinkingConfig: {
                                    thinkingBudget: 8192,
                                },
                            },
                        },
                        system:
                            prompt +
                            "\n\nHere is extra context to help you answer the user's question. you can use to provide realtime accurate information from the internet only use it as a reference and not as the answer: " +
                            preResearch.text,
                        messages,
                        schema: responseSchema,
                        mode: 'tool',
                        temperature: 1.1,
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
