import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/integrations/tanstack-query/root-provider';
import { useSearch } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, Pin } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { extensions } from '@/lib/core/extensions';

export const Route = createFileRoute('/pin')({
    component: PinPage,
});

function PinPage() {
    const { pinId } = useSearch({ strict: false }) as { pinId?: string };

    const {
        data: pinnedItem,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['pinnedItem', pinId],
        queryFn: async () => {
            if (!pinId) throw new Error('No pinId provided');
            const items = await trpcClient.pinnedItems.list.query();
            const item = items.find((item) => item.id === pinId);
            if (!item) throw new Error('Pinned item not found');
            return item;
        },
        enabled: !!pinId,
    });

    if (!pinId) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center p-4 md:p-8">
                <AlertCircle className="text-muted-foreground mb-4 size-12" />
                <h2 className="mb-2 text-lg font-semibold">No Pinned Item Selected</h2>
                <p className="text-muted-foreground mb-4 text-center">
                    Select a pinned item from the sidebar to view it here.
                </p>
                <Link to="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Chat
                    </Button>
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-8" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Card className="p-6">
                    <Skeleton className="mb-4 h-4 w-full" />
                    <Skeleton className="h-32 w-full" />
                </Card>
            </div>
        );
    }

    if (error || !pinnedItem) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center p-4 md:p-8">
                <AlertCircle className="text-destructive mb-4 size-12" />
                <h2 className="mb-2 text-lg font-semibold">Pinned Item Not Found</h2>
                <p className="text-muted-foreground mb-4 text-center">
                    The pinned item you're looking for doesn't exist or has been deleted.
                </p>
                <Link to="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Chat
                    </Button>
                </Link>
            </div>
        );
    }

    const extension = extensions.find((ext) => ext.name === pinnedItem.extension);
    const Renderer = extension?.renderer;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Pin className="text-primary size-5" />
                        <h1 className="text-2xl font-bold">Pinned {pinnedItem.extension}</h1>
                    </div>
                    <Badge variant="secondary">{pinnedItem.extension}</Badge>
                </div>
                <Link to="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Chat
                    </Button>
                </Link>
            </div>

            {/* Content */}
            <div className="rounded-md border">
                {Renderer && pinnedItem.props ? (
                    <Renderer {...(pinnedItem.props as any)} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="text-muted-foreground mb-4 size-12" />
                        <h3 className="mb-2 text-lg font-semibold">Renderer Not Available</h3>
                        <p className="text-muted-foreground text-center">
                            The renderer for {pinnedItem.extension} extension is not available.
                        </p>
                        <details className="mt-4 text-sm">
                            <summary className="text-muted-foreground hover:text-foreground cursor-pointer">
                                View Raw Data
                            </summary>
                            <pre className="bg-muted mt-2 max-w-full overflow-auto rounded-md p-4 text-xs">
                                {JSON.stringify(pinnedItem.props, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>

            {/* Metadata */}
            <div>
                <div className="text-muted-foreground space-y-1 text-sm">
                    <div>Created: {new Date(pinnedItem.createdAt).toLocaleString()}</div>
                    <div>Updated: {new Date(pinnedItem.updatedAt).toLocaleString()}</div>
                    <div>Extension: {pinnedItem.extension}</div>
                </div>
            </div>
        </div>
    );
}
