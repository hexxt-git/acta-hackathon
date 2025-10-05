import { Checkbox } from '@/components/ui/checkbox';
import { Extension } from '../types/extensions';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useId, useState } from 'react';
import { Pin, Check, Loader2, Copy } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/integrations/tanstack-query/root-provider';

const todoSchema = z.object({
    name: z
        .string()
        .describe(
            'The name of the todo list formatted as "Lemon cake recipe", "Tomorrow\'s tasks", "Car repair checklist", etc.',
        ),
    items: z.array(z.string()),
});

const todoRenderer = ({ name, items }: Partial<z.infer<typeof todoSchema>>) => {
    const id = useId();
    const queryClient = useQueryClient();
    const [isPinned, setIsPinned] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

    const pinMutation = useMutation({
        mutationFn: async () => {
            await trpcClient.pinnedItems.create.mutate({
                extension: 'todo',
                props: { name, items },
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

    const handlePin = () => {
        pinMutation.mutate();
    };

    const handleCheckboxChange = (index: number, checked: boolean) => {
        setCheckedItems((prev) => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(index);
            } else {
                newSet.delete(index);
            }
            return newSet;
        });
    };

    const handleCopy = async () => {
        try {
            const formattedTodos = (items || [])
                .map((item, index) => {
                    const isChecked = checkedItems.has(index);
                    return `${isChecked ? '[x]' : '[ ]'} ${item}`;
                })
                .join('\n');
            await navigator.clipboard.writeText(formattedTodos);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy todos:', err);
        }
    };

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{name || 'Todo List'}</h2>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePin}
                        className="h-6 w-6 p-0"
                        title={isPinned ? 'Unpin todo list' : 'Pin todo list'}
                    >
                        {pinMutation.isPending ? (
                            <Loader2 className="size-3 animate-spin" />
                        ) : isPinned ? (
                            <Check className="size-3 text-green-600" />
                        ) : (
                            <Pin className="size-3" />
                        )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0" title="Copy todos">
                        {copySuccess ? <Check className="size-3 text-green-600" /> : <Copy className="size-3" />}
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                {items?.map((item, index) => (
                    <div
                        key={`${id}-${item}-${index}`}
                        className="bg-muted dark:bg-input/30 dark:border-border flex w-full items-center gap-2 rounded-md border border-transparent p-2"
                    >
                        <Checkbox
                            id={`${id}-${item}-${index}`}
                            checked={checkedItems.has(index)}
                            onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
                        />
                        <Label htmlFor={`${id}-${item}-${index}`} className="text-sm/[1.2]">
                            {item}
                        </Label>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export const todoExtension = {
    name: 'todo',
    prompt: 'use when you want to create a todo list',
    schema: todoSchema,
    renderer: todoRenderer,
} satisfies Extension<z.infer<typeof todoSchema>>;
