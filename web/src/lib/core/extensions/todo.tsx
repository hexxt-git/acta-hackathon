import { Checkbox } from '@/components/ui/checkbox';
import { Extension } from '../types/extensions';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useId } from 'react';

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
    return (
        <Card>
            <h2 className="text-lg font-bold">{name || 'Todo List'}</h2>
            <div className="space-y-2">
                {items?.map((item) => (
                    <div
                        key={`${id}-${item}`}
                        className="bg-muted dark:bg-input/30 dark:border-border flex w-full items-center gap-2 rounded-md border border-transparent p-2"
                    >
                        <Checkbox id={`${id}-${item}`} />
                        <Label htmlFor={`${id}-${item}`} className="text-sm/[1.2]">
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
