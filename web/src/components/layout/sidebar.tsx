import { trpcClient } from '@/integrations/tanstack-query/root-provider';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { Plus, MessageCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function Sidebar() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentChatId = (useSearch({ strict: false }) as any)?.chatId;

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

    const handleNewChat = () => {
        const newChatId = Math.random().toString(36).substring(2, 15);
        navigate({ to: '/', search: { chatId: newChatId } });
    };

    const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deleteMutation.mutate(chatId);
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
        <div className="flex flex-col gap-2 p-1">
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
            <div className="flex-1 space-y-0.5">
                {isLoading && (
                    <>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <ChatItemSkeleton key={i} />
                        ))}
                    </>
                )}

                {!isLoading && chats?.length === 0 && (
                    <div className="flex flex-col items-center justify-center px-2 py-6 text-center">
                        <MessageCircle className="text-muted-foreground/50 mb-1 size-6" />
                        <p className="text-muted-foreground text-sm">No chats yet</p>
                        <p className="text-muted-foreground/70 text-xs">Start a new conversation</p>
                    </div>
                )}

                {!isLoading &&
                    chats?.map((chat) => (
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

            {/* Footer */}
            <div className="border-t px-2 pt-2">
                <div className="text-muted-foreground/70 text-center text-xs">
                    {chats?.length || 0} chat{chats && chats.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
}
