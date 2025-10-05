import { z } from 'zod';
import { Extension } from '../types/extensions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useId, useState } from 'react';
import { Bell, Calendar, Clock, Pin, Check, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/integrations/tanstack-query/root-provider';

const reminderSchema = z.object({
    title: z.string().describe('The title of the reminder'),
    description: z.string().optional().describe('Optional description of the reminder'),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .describe('The date for the reminder in YYYY-MM-DD format'),
    time: z
        .string()
        .regex(/^\d{2}:\d{2}$/)
        .optional()
        .describe('Optional time for the reminder in HH:MM format'),
});

const reminderRenderer = ({
    title: initialTitle,
    description: initialDescription,
    date: initialDate,
    time: initialTime,
}: Partial<z.infer<typeof reminderSchema>>) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription || '');
    const [date, setDate] = useState(initialDate);
    const [time, setTime] = useState(initialTime || '');
    const [isPinned, setIsPinned] = useState(false);

    const id = useId();
    const queryClient = useQueryClient();

    const pinMutation = useMutation({
        mutationFn: async () => {
            await trpcClient.pinnedItems.create.mutate({
                extension: 'reminder',
                props: { title, description, date, time },
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

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    useEffect(() => {
        setDescription(initialDescription || '');
    }, [initialDescription]);

    useEffect(() => {
        setDate(initialDate);
    }, [initialDate]);

    useEffect(() => {
        setTime(initialTime || '');
    }, [initialTime]);

    return (
        <Card>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="size-4" />
                        <h2 className="text-lg font-semibold">Reminder</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePin}
                        className="h-6 w-6 p-0"
                        title={isPinned ? 'Unpin reminder' : 'Pin reminder'}
                    >
                        {pinMutation.isPending ? (
                            <Loader2 className="size-3 animate-spin" />
                        ) : isPinned ? (
                            <Check className="size-3 text-green-600" />
                        ) : (
                            <Pin className="size-3" />
                        )}
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`${id}-title`}>Title</Label>
                    <Input
                        id={`${id}-title`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What should I remind you about?"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-date`} className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            Date
                        </Label>
                        <Input id={`${id}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`${id}-time`} className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            Time (Optional)
                        </Label>
                        <Input id={`${id}-time`} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`${id}-description`}>Description (Optional)</Label>
                    <Textarea
                        id={`${id}-description`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Additional details..."
                        rows={3}
                    />
                </div>
            </div>
        </Card>
    );
};

export const reminderExtension = {
    name: 'reminder',
    prompt: 'use when you want to create a reminder or schedule something.',
    schema: reminderSchema,
    renderer: reminderRenderer,
} satisfies Extension<z.infer<typeof reminderSchema>>;
