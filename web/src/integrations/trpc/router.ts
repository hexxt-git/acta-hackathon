import { database } from '@/routes/api.ai';
import { createTRPCRouter, publicProcedure } from './init';
import { z } from 'zod';

import type { TRPCRouterRecord } from '@trpc/server';

const chatsRouter = {
    list: publicProcedure.query(() => {
        return Object.keys(database).map((chatId) => {
            const chatData = database[chatId];
            const firstMessage = chatData.messages.find((msg) => msg.role === 'user');
            const preview = firstMessage
                ? firstMessage.content.length > 30
                    ? firstMessage.content.substring(0, 30) + '...'
                    : firstMessage.content
                : '';

            return {
                id: chatId,
                messages: chatData.messages.length,
                preview,
                createdAt: chatData.createdAt,
                updatedAt: chatData.updatedAt,
            };
        });
    }),
    get: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
        return database[input.id]?.messages || [];
    }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
        if (database[input.id]) {
            delete database[input.id];
            return { success: true };
        }
        return { success: false, error: 'Chat not found' };
    }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
    chats: chatsRouter,
});
export type TRPCRouter = typeof trpcRouter;
