import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useId, useState } from 'react';
import { Pin, Check, Loader2, Copy, Clock2Icon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/integrations/tanstack-query/root-provider';
import type { Extension } from '../types/extensions';

const instructionsSchema = z.object({
    name: z.string().optional().describe('Instructions title'),
    instructions: z
        .array(
            z.object({
                text: z.string(),
                details: z.string().optional().describe('Details of the instruction'),
                completed: z.boolean().optional(),
                duration: z
                    .string()
                    .optional()
                    .describe('Duration in minutes or hours or days formatted to include the unit'),
            }),
        )
        .describe('List of instructions'),
    requirements: z.array(z.string()).optional().describe('Requirements for the instructions'),
    requirementsName: z.string().optional().describe('"Requirements" or "Props"'),
});

const instructionsRenderer = ({
    name,
    instructions,
    requirements,
    requirementsName = 'Requirements',
}: Partial<z.infer<typeof instructionsSchema>>) => {
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
    const [isPinned, setIsPinned] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const queryClient = useQueryClient();
    const id = useId();

    const pinMutation = useMutation({
        mutationFn: async () => {
            try {
                await trpcClient.pinnedItems.create.mutate({
                    extension: 'instructions',
                    props: { name, instructions },
                });
            } catch (error) {
                // Handle case where TRPC client is not available (e.g., in Storybook)
            }
        },
        onSuccess: () => {
            setIsPinned(true);
            setTimeout(() => setIsPinned(false), 2000);
        },
        onSettled: () => {
            try {
                queryClient.invalidateQueries({ queryKey: ['pinnedItems'] });
            } catch (error) {
                // Handle case where queryClient is not available
            }
        },
    });

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
            const formattedInstructions = (instructions || [])
                .map((instruction, index) => {
                    const isChecked = checkedItems.has(index);
                    const durationText = instruction.duration ? ` (${instruction.duration})` : '';
                    return `${isChecked ? '[x]' : '[ ]'} ${instruction.text}${durationText}`;
                })
                .join('\n');
            await navigator.clipboard.writeText(formattedInstructions);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy instructions:', err);
        }
    };

    const handlePin = () => {
        pinMutation.mutate();
    };

    return (
        <Card className="space-y-2">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">{name || 'Instructions'}</h2>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePin}
                        className="h-6 w-6 p-0"
                        title={isPinned ? 'Unpin instructions' : 'Pin instructions'}
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
                        title="Copy instructions"
                    >
                        {copySuccess ? <Check className="size-3 text-green-600" /> : <Copy className="size-3" />}
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                {instructions?.map((instruction, index) => (
                    <div
                        key={`${id}-${instruction.text}-${index}`}
                        className="bg-muted dark:bg-input/30 dark:border-border flex w-full items-center gap-2 rounded-md border border-transparent p-2"
                    >
                        <Checkbox
                            id={`${id}-${instruction.text}-${index}`}
                            checked={checkedItems.has(index)}
                            onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
                        />
                        <div className="flex-1">
                            <Label htmlFor={`${id}-${instruction.text}-${index}`} className="text-sm/[1.2]">
                                {instruction.text}
                            </Label>
                            {instruction.details && (
                                <p className="text-muted-foreground mt-1 text-xs">{instruction.details}</p>
                            )}
                        </div>
                        {instruction.duration && (
                            <p className="text-muted-foreground text-xs">
                                {instruction.duration}
                                <Clock2Icon className="ms-1 inline-block size-3" />
                            </p>
                        )}
                    </div>
                ))}
                {requirements && requirements.length > 0 && (
                    <div className="space-y-1">
                        <h3 className="text-base font-bold">{requirementsName || 'Requirements'}</h3>
                        <p className="text-muted-foreground text-xs">{requirements.join(', ')}</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export const instructionsExtension = {
    type: 'tool' as const,
    name: 'instructions',
    prompt: 'use when you want to create step-by-step instructions with optional duration, time, and cost information. perfect for recipes, procedures, tutorials, or any task that requires detailed guidance. include the duration for each instruction if applicable.',
    schema: instructionsSchema,
    renderer: instructionsRenderer,
} satisfies Extension<z.infer<typeof instructionsSchema>>;
