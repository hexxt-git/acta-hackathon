import { z } from 'zod';
import { Extension } from '../types/extensions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useId } from 'react';
import { Pin, Check, Loader2, Plus, Trash2, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/integrations/tanstack-query/root-provider';
import { AnimatePresence, motion } from 'motion/react';

const formSchema = z.object({
    title: z.string().optional().describe('Form title'),
    description: z.string().optional().describe('Form description'),
    fields: z
        .array(
            z.object({
                id: z.string(),
                type: z.enum(['text', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date', 'time']),
                label: z.string(),
                placeholder: z.string().optional(),
                required: z.boolean().optional(),
                options: z.array(z.string()).optional().describe('Options for select, radio, checkbox fields'),
                validation: z
                    .object({
                        min: z.number().optional(),
                        max: z.number().optional(),
                        pattern: z.string().optional(),
                    })
                    .optional(),
            }),
        )
        .optional()
        .describe('Form fields'),
    settings: z
        .object({
            allowMultipleSubmissions: z.boolean().optional(),
            showProgress: z.boolean().optional(),
            theme: z.enum(['default', 'minimal', 'modern']).optional(),
        })
        .optional()
        .describe('Form settings'),
});

const formRenderer = (props: Partial<z.infer<typeof formSchema>>) => {
    const [formData, setFormData] = useState({
        title: props.title || 'Form',
        description: props.description || '',
        fields: props.fields || [
            { id: '1', type: 'text' as const, label: 'Name', placeholder: 'Enter your name', required: true },
            { id: '2', type: 'email' as const, label: 'Email', placeholder: 'Enter your email', required: true },
        ],
        settings: props.settings || {
            allowMultipleSubmissions: true,
            showProgress: true,
            theme: 'default' as const,
        },
    });

    const [isPinned, setIsPinned] = useState(false);
    const [open, setOpen] = useState(false);
    const [formResponses, setFormResponses] = useState<Record<string, any>>({});
    const queryClient = useQueryClient();
    const id = useId();

    const pinMutation = useMutation({
        mutationFn: async () => {
            try {
                await trpcClient.pinnedItems.create.mutate({
                    extension: 'form',
                    props: formData,
                });
            } catch (error) {
                // Handle case where TRPC client is not available (e.g., in Storybook)
                console.log('Mock: Pinning form');
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

    const addField = () => {
        const newId = (formData.fields.length + 1).toString();
        setFormData((prev) => ({
            ...prev,
            fields: [
                ...prev.fields,
                {
                    id: newId,
                    type: 'text',
                    label: 'New Field',
                    placeholder: 'Enter value',
                    required: false,
                },
            ],
        }));
    };

    const removeField = (id: string) => {
        if (formData.fields.length > 1) {
            setFormData((prev) => ({
                ...prev,
                fields: prev.fields.filter((field) => field.id !== id),
            }));
        }
    };

    const updateField = (id: string, field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            fields: prev.fields.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
        }));
    };

    const updateResponse = (fieldId: string, value: any) => {
        setFormResponses((prev) => ({ ...prev, [fieldId]: value }));
    };

    const handlePin = () => {
        pinMutation.mutate();
    };

    const renderFieldPreview = (field: any) => {
        const value = formResponses[field.id] || '';

        switch (field.type) {
            case 'textarea':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={`preview-${field.id}`}>
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Textarea
                            id={`preview-${field.id}`}
                            value={value}
                            onChange={(e) => updateResponse(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={3}
                        />
                    </div>
                );
            case 'select':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={`preview-${field.id}`}>
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Select value={value} onValueChange={(val) => updateResponse(field.id, val)}>
                            <SelectTrigger>
                                <SelectValue placeholder={field.placeholder || 'Select an option'} />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option: string, index: number) => (
                                    <SelectItem key={index} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label>{field.label}</Label>
                        <div className="space-y-2">
                            {field.options?.map((option: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`preview-${field.id}-${index}`}
                                        checked={Array.isArray(value) ? value.includes(option) : false}
                                        onCheckedChange={(checked) => {
                                            const currentValues = Array.isArray(value) ? value : [];
                                            if (checked) {
                                                updateResponse(field.id, [...currentValues, option]);
                                            } else {
                                                updateResponse(
                                                    field.id,
                                                    currentValues.filter((v) => v !== option),
                                                );
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`preview-${field.id}-${index}`}>{option}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'radio':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label>{field.label}</Label>
                        <div className="space-y-2">
                            {field.options?.map((option: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id={`preview-${field.id}-${index}`}
                                        name={`preview-${field.id}`}
                                        value={option}
                                        checked={value === option}
                                        onChange={(e) => updateResponse(field.id, e.target.value)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor={`preview-${field.id}-${index}`}>{option}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'date':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={`preview-${field.id}`}>
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Input
                            id={`preview-${field.id}`}
                            type="date"
                            value={value}
                            onChange={(e) => updateResponse(field.id, e.target.value)}
                        />
                    </div>
                );
            case 'time':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={`preview-${field.id}`}>
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Input
                            id={`preview-${field.id}`}
                            type="time"
                            value={value}
                            onChange={(e) => updateResponse(field.id, e.target.value)}
                        />
                    </div>
                );
            default:
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={`preview-${field.id}`}>
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Input
                            id={`preview-${field.id}`}
                            type={field.type}
                            value={value}
                            onChange={(e) => updateResponse(field.id, e.target.value)}
                            placeholder={field.placeholder}
                        />
                    </div>
                );
        }
    };

    return (
        <Card>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor={`${id}-title`}>Form</Label>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePin}
                            className="h-8 w-8 p-0"
                            title={isPinned ? 'Unpin form' : 'Pin form'}
                        >
                            {pinMutation.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : isPinned ? (
                                <Check className="size-4 text-green-600" />
                            ) : (
                                <Pin className="size-4" />
                            )}
                        </Button>
                        <Button variant="ghost" onClick={() => setOpen(!open)}>
                            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </Button>
                    </div>
                </div>
                <Input
                    id={`${id}-title`}
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Form title"
                />
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-4 pt-4">
                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="form-description">Description</Label>
                                <Textarea
                                    id="form-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Form description"
                                    rows={2}
                                />
                            </div>

                            {/* Fields */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Fields</Label>
                                    <Button onClick={addField} size="sm" variant="outline">
                                        <Plus className="mr-2 size-3" />
                                        Add Field
                                    </Button>
                                </div>
                                {formData.fields.map((field) => (
                                    <div key={field.id} className="grid grid-cols-3 gap-2">
                                        <Input
                                            value={field.label}
                                            onChange={(e) => updateField(field.id, 'label', e.target.value)}
                                            placeholder="Field label"
                                        />
                                        <Select
                                            value={field.type}
                                            onValueChange={(value) => updateField(field.id, 'type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">Text</SelectItem>
                                                <SelectItem value="email">Email</SelectItem>
                                                <SelectItem value="number">Number</SelectItem>
                                                <SelectItem value="textarea">Textarea</SelectItem>
                                                <SelectItem value="select">Select</SelectItem>
                                                <SelectItem value="checkbox">Checkbox</SelectItem>
                                                <SelectItem value="radio">Radio</SelectItem>
                                                <SelectItem value="date">Date</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex items-center gap-1">
                                            <Checkbox
                                                checked={field.required || false}
                                                onCheckedChange={(checked) =>
                                                    updateField(field.id, 'required', checked)
                                                }
                                            />
                                            <Label className="text-sm">Required</Label>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeField(field.id)}
                                                disabled={formData.fields.length === 1}
                                                className="text-destructive h-6 w-6 p-0"
                                            >
                                                <Trash2 className="size-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2">
                <Label htmlFor={`${id}-preview`}>Preview</Label>
                <div className="bg-muted/30 space-y-3 rounded-md border p-4">
                    {formData.fields.map(renderFieldPreview)}
                    <Button className="w-full">Submit Form</Button>
                </div>
            </div>
        </Card>
    );
};

export const formExtension = {
    type: 'tool' as const,
    name: 'form',
    prompt: 'use when you want to create a form or survey with various field types like text, email, select, checkbox, radio, date, etc. perfect for surveys, feedback forms, registration forms, or any data collection needs.',
    schema: formSchema,
    renderer: formRenderer,
} satisfies Extension<z.infer<typeof formSchema>>;
