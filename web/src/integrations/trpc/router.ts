import { getChatList, getChatMessages, deleteChat } from '@/lib/database';
import { createTRPCRouter, publicProcedure } from './init';
import { z } from 'zod';

import type { TRPCRouterRecord } from '@trpc/server';

const chatsRouter = {
    list: publicProcedure.query(async () => {
        return await getChatList();
    }),
    get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        return await getChatMessages(input.id);
    }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
        const deleted = await deleteChat(input.id);
        if (deleted) {
            return { success: true };
        }
        return { success: false, error: 'Chat not found' };
    }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
    chats: chatsRouter,
});
export type TRPCRouter = typeof trpcRouter;
