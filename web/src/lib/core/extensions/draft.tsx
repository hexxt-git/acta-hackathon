import { z } from 'zod';
import { Extension } from '../types/extensions';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useId, useState } from 'react';
import { FileText, Copy, Download, Check, Pin, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/integrations/tanstack-query/root-provider';

const draftSchema = z.object({
    title: z.string(),
    body: z.string(),
});

const draftRenderer = ({ title: initialTitle, body: initialBody }: Partial<z.infer<typeof draftSchema>>) => {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const queryClient = useQueryClient();

    const pinMutation = useMutation({
        mutationFn: async () => {
            await trpcClient.pinnedItems.create.mutate({
                extension: 'draft',
                props: { title, body },
            });
        },
        onSuccess: () => {
            setIsPinned(true);
            setTimeout(() => setIsPinned(false), 2000);
        },
        onSettled: () => {
            // invalidate pinned items list
            queryClient.invalidateQueries({ queryKey: ['pinnedItems'] });
        },
    });

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    useEffect(() => {
        setBody(initialBody);
    }, [initialBody]);

    const id = useId();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(body || '');
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([body || ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'draft'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handlePin = () => {
        pinMutation.mutate();
    };

    return (
        <Card>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor={`${id}-body`}>
                        <FileText className="size-3.5" /> {title}
                    </Label>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePin}
                            className="h-6 w-6 p-0"
                            title={isPinned ? 'Unpin draft' : 'Pin draft'}
                        >
                            {pinMutation.isPending ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : isPinned ? (
                                <Check className="size-3 text-green-600" />
                            ) : (
                                <Pin className="size-3" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="h-6 w-6 p-0"
                            title="Copy text"
                        >
                            {copySuccess ? <Check className="size-3 text-green-600" /> : <Copy className="size-3" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="h-6 w-6 p-0"
                            title="Download text"
                        >
                            <Download className="size-3" />
                        </Button>
                    </div>
                </div>
                <Textarea id={`${id}-body`} value={body} rows={15} onChange={(e) => setBody(e.target.value)} />
            </div>
        </Card>
    );
};

export const draftExtension = {
    name: 'draft',
    prompt: 'use when you want to draft a story, document, blog post, etc. this feature is not for avoiding writing long text responses. only use it for creative works or writing that should be isolated from the rest of the conversation.',
    schema: draftSchema,
    renderer: draftRenderer,
} satisfies Extension<z.infer<typeof draftSchema>>;
