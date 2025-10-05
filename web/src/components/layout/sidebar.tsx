import { trpcClient } from '@/integrations/tanstack-query/root-provider';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { Plus, MessageCircle, Trash2, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { widthStore } from '@/stores/width';
import { useStore } from '@tanstack/react-store';

function formatTimestamp(timestamp: Date | string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    // For older dates, show the actual date
    return date.toLocaleDateString();
}

function ChatItemSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-2 rounded-md p-1.5">
            <div className="bg-muted size-6 rounded-full" />
            <div className="flex-1 space-y-1">
                <div className="bg-muted h-3 w-16 rounded" />
                <div className="bg-muted/60 h-2 w-20 rounded" />
                <div className="bg-muted/60 h-2 w-10 rounded" />
            </div>
        </div>
    );
}

function PinnedItemSkeleton() {
    return (
        <div className="flex animate-pulse items-center gap-2 rounded-md p-1.5">
            <div className="bg-muted size-6 rounded-full" />
            <div className="flex-1 space-y-1">
                <div className="bg-muted h-3 w-16 rounded" />
                <div className="bg-muted/60 h-2 w-20 rounded" />
            </div>
        </div>
    );
}

export function Sidebar() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentChatId = (useSearch({ strict: false }) as any)?.chatId;
    const [chatsOpen, setChatsOpen] = useState(false);
    const [pinnedItemsOpen, setPinnedItemsOpen] = useState(false);
    const width = useStore(widthStore);
    const collapsed_items = width === 'narrow' ? 3 : 5;

    const {
        data: chats,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['chats'],
        queryFn: () => trpcClient.chats.list.query(),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 30 * 1000, // 30 seconds
    });

    const { data: pinnedItems } = useQuery({
        queryKey: ['pinnedItems'],
        queryFn: () => trpcClient.pinnedItems.list.query(),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 30 * 1000, // 30 seconds
    });

    const deleteMutation = useMutation({
        mutationFn: (chatId: string) => trpcClient.chats.delete.mutate({ id: chatId }),
        onSuccess: (_result, chatId) => {
            // Invalidate and refetch chats list
            queryClient.invalidateQueries({ queryKey: ['chats'] });

            // If the deleted chat was the current one, navigate to a new chat
            if (currentChatId === chatId) {
                const newChatId = Math.random().toString(36).substring(2, 15);
                navigate({ to: '/', search: { chatId: newChatId } });
            }
        },
    });

    const deletePinnedMutation = useMutation({
        mutationFn: (pinnedId: string) => trpcClient.pinnedItems.delete.mutate({ id: pinnedId }),
        onSuccess: () => {
            // Invalidate and refetch pinned items list
            queryClient.invalidateQueries({ queryKey: ['pinnedItems'] });
        },
    });

    const handleNewChat = () => {
        const newChatId = Math.random().toString(36).substring(2, 15);
        navigate({ to: '/', search: { chatId: newChatId } });
    };

    const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deleteMutation.mutate(chatId);
    };

    const handleDeletePinnedItem = (pinnedId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deletePinnedMutation.mutate(pinnedId);
    };

    if (error) {
        return (
            <div className="flex flex-col gap-2 p-4">
                <div className="text-muted-foreground text-center">
                    <p className="text-sm">Failed to load chats</p>
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['chats'] })}
                        className="mt-2 text-xs text-blue-500 hover:text-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col gap-2 overflow-y-auto p-2">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
                <h2 className="text-foreground text-sm font-semibold">Chat History</h2>
                <button
                    onClick={handleNewChat}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors"
                >
                    <Plus className="size-3" />
                    New
                </button>
            </div>

            {/* Chat List */}
            <div className="space-y-2">
                {/* Chat Loading */}
                {isLoading && (
                    <div className="space-y-0.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <ChatItemSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Chat List */}
                {!isLoading && chats && chats.length > 0 && (
                    <div className="space-y-0.5">
                        {chats.slice(0, chatsOpen ? chats.length : collapsed_items).map((chat) => (
                            <Link
                                to="/"
                                key={chat.id}
                                search={{ chatId: chat.id }}
                                className={cn(
                                    'group hover:bg-accent relative flex items-center gap-2 rounded-md p-1.5 text-sm transition-colors',
                                    currentChatId === chat.id && 'bg-accent',
                                )}
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="text-muted-foreground mb-0.5 truncate font-mono text-xs">
                                        #{chat.id} • {formatTimestamp(chat.updatedAt)}
                                    </div>
                                    <div className="text-muted-foreground/80 mb-0.5 truncate text-xs">
                                        {chat.preview || 'Empty chat'}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteChat(chat.id, e)}
                                    disabled={deleteMutation.isPending}
                                    className="hover:bg-destructive/10 hover:text-destructive rounded-sm p-0.5 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                                    title="Delete chat"
                                >
                                    {deleteMutation.isPending ? (
                                        <div className="border-destructive size-3 animate-spin rounded-full border border-t-transparent" />
                                    ) : (
                                        <Trash2 className="size-3" />
                                    )}
                                </button>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Empty Chats */}
                {!isLoading && chats && chats.length === 0 && (
                    <div className="flex flex-col items-center justify-center px-2 py-6 text-center">
                        <MessageCircle className="text-muted-foreground/50 mb-1 size-6" />
                        <p className="text-muted-foreground text-sm">No chats yet</p>
                        <p className="text-muted-foreground/70 text-xs">Start a new conversation</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t px-2 pt-2">
                <button
                    className="text-muted-foreground/70 hover:text-foreground w-full cursor-pointer space-y-1 text-center text-xs"
                    onClick={() => setChatsOpen(!chatsOpen)}
                >
                    {chats?.length || 0} chat{chats && chats.length !== 1 ? 's' : ''}{' '}
                    {!chatsOpen &&
                        chats?.length &&
                        chats.length > collapsed_items &&
                        `(${chats.length - collapsed_items} more)`}
                </button>
            </div>

            {/* Pinned Items Section */}
            <h3 className="text-muted-foreground text-xs font-medium">Pinned Items</h3>

            {/* Pinned Items Loading */}
            {!pinnedItems && (
                <div className="space-y-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <PinnedItemSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Pinned Items List */}
            {pinnedItems && pinnedItems.length > 0 && (
                <div className="space-y-0.5">
                    {pinnedItems.slice(0, pinnedItemsOpen ? pinnedItems.length : collapsed_items).map((item) => (
                        <Link
                            to="/pin"
                            key={item.id}
                            search={{ pinId: item.id }}
                            className="group hover:bg-accent relative flex items-center gap-2 rounded-md p-1.5 text-sm transition-colors"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="text-muted-foreground mb-0.5 truncate font-mono text-xs">
                                    {item.extension} • {formatTimestamp(item.updatedAt)}
                                </div>
                                <div className="text-muted-foreground/80 mb-0.5 truncate text-xs">
                                    {typeof item.props === 'object' && item.props && 'title' in item.props
                                        ? (item.props as any).title
                                        : item.extension}
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDeletePinnedItem(item.id, e)}
                                disabled={deletePinnedMutation.isPending}
                                className="hover:bg-destructive/10 hover:text-destructive rounded-sm p-0.5 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                                title="Delete pinned item"
                            >
                                {deletePinnedMutation.isPending ? (
                                    <div className="border-destructive size-3 animate-spin rounded-full border border-t-transparent" />
                                ) : (
                                    <Trash2 className="size-3" />
                                )}
                            </button>
                        </Link>
                    ))}
                </div>
            )}

            {/* Empty Pinned Items */}
            {pinnedItems && pinnedItems.length === 0 && (
                <div className="flex flex-col items-center justify-center px-2 py-4 text-center">
                    <Pin className="text-muted-foreground/50 mb-1 size-4" />
                    <p className="text-muted-foreground text-xs">No pinned items</p>
                    <p className="text-muted-foreground/70 text-xs">Pin content from conversations</p>
                </div>
            )}

            {/* Footer */}
            <div className="border-t px-2 pt-2">
                <button
                    className="text-muted-foreground/70 hover:text-foreground w-full cursor-pointer space-y-1 text-center text-xs"
                    onClick={() => setPinnedItemsOpen(!pinnedItemsOpen)}
                >
                    {pinnedItems?.length || 0} pinned item{pinnedItems && pinnedItems.length !== 1 ? 's' : ''}{' '}
                    {!pinnedItemsOpen &&
                        pinnedItems?.length &&
                        pinnedItems.length > collapsed_items &&
                        `(${pinnedItems.length - collapsed_items} more)`}
                </button>
            </div>
        </div>
    );
}
