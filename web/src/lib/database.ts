import { PinnedItem, PrismaClient } from '@prisma/client';

export interface ChatData {
    messages: { role: 'assistant' | 'user'; content: string }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatListItem {
    id: string;
    messages: number;
    preview: string;
    createdAt: Date;
    updatedAt: Date;
}

const prisma = new PrismaClient();

export async function initializeChat(chatId: string): Promise<ChatData> {
    // Check if chat exists
    let chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: true },
    });

    if (!chat) {
        // Create new chat
        chat = await prisma.chat.create({
            data: {
                id: chatId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            include: { messages: true },
        });
    }

    const messages = chat.messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'assistant' | 'user',
        content: msg.content,
    }));

    return {
        messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
    };
}

export async function addUserMessage(chatId: string, content: string): Promise<void> {
    // Ensure chat exists
    await initializeChat(chatId);

    // Add message to database
    await prisma.message.create({
        data: {
            role: 'user',
            content,
            chatId,
        },
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
    });
}

export async function addAssistantMessage(chatId: string, content: string): Promise<void> {
    // Ensure chat exists
    await initializeChat(chatId);

    // Add message to database
    await prisma.message.create({
        data: {
            role: 'assistant',
            content,
            chatId,
        },
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
    });
}

export async function deleteChat(chatId: string): Promise<boolean> {
    try {
        await prisma.chat.delete({
            where: { id: chatId },
        });
        return true;
    } catch (error) {
        return false;
    }
}

export async function getChatMessages(chatId: string): Promise<{ role: 'assistant' | 'user'; content: string }[]> {
    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    return (
        chat?.messages.map((msg) => ({
            role: msg.role as 'assistant' | 'user',
            content: msg.content,
        })) || []
    );
}

export async function getChatList(): Promise<ChatListItem[]> {
    const chats = await prisma.chat.findMany({
        include: {
            messages: {
                orderBy: { createdAt: 'asc' },
                take: 1, // Only get the first message
            },
            _count: {
                select: { messages: true },
            },
        },
        orderBy: { updatedAt: 'desc' },
    });

    return chats.map((chat) => {
        const firstMessage = chat.messages.find((msg) => msg.role === 'user');
        const preview = firstMessage
            ? firstMessage.content.length > 30
                ? firstMessage.content.substring(0, 30) + '...'
                : firstMessage.content
            : '';

        return {
            id: chat.id,
            messages: chat._count.messages,
            preview,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        };
    });
}

export async function createPinnedItem(extension: string, props: any): Promise<void> {
    await prisma.pinnedItem.create({
        data: { extension, props },
    });
}

export async function getPinnedItems(): Promise<PinnedItem[]> {
    return await prisma.pinnedItem.findMany({
        orderBy: { updatedAt: 'desc' },
    });
}

export async function deletePinnedItem(id: string): Promise<boolean> {
    try {
        await prisma.pinnedItem.delete({
            where: { id },
        });
        return true;
    } catch (error) {
        return false;
    }
}
