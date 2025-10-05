import {
    getChatList,
    getChatMessages,
    deleteChat,
    createPinnedItem,
    getPinnedItems,
    deletePinnedItem,
} from '@/lib/database';
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

const pinnedItemsRouter = {
    create: publicProcedure.input(z.object({ extension: z.string(), props: z.any() })).mutation(async ({ input }) => {
        return await createPinnedItem(input.extension, input.props);
    }),
    list: publicProcedure.query(async () => {
        return await getPinnedItems();
    }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
        const deleted = await deletePinnedItem(input.id);
        if (deleted) {
            return { success: true };
        }
        return { success: false, error: 'Pinned item not found' };
    }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
    chats: chatsRouter,
    pinnedItems: pinnedItemsRouter,
});
export type TRPCRouter = typeof trpcRouter;
