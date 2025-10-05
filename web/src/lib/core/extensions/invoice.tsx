import { z } from 'zod';
import { Extension } from '../types/extensions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useId, useState } from 'react';
import { Pin, Check, Loader2, Plus, Trash2, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/integrations/tanstack-query/root-provider';
import { AnimatePresence, motion } from 'motion/react';

const invoiceSchema = z.object({
    title: z.string().optional().describe('Invoice title'),
    invoiceNumber: z.string().optional().describe('Invoice number'),
    date: z.string().optional().describe('Invoice date'),
    dueDate: z.string().optional().describe('Due date'),
    from: z
        .object({
            name: z.string().optional(),
            address: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
        })
        .optional()
        .describe('Sender information'),
    to: z
        .object({
            name: z.string().optional(),
            address: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
        })
        .optional()
        .describe('Recipient information'),
    items: z
        .array(
            z.object({
                description: z.string(),
                quantity: z.number(),
                rate: z.number(),
                amount: z.number().optional(),
            }),
        )
        .optional()
        .describe('Invoice line items'),
    subtotal: z.number().optional().describe('Subtotal amount'),
    taxRate: z.number().optional().describe('Tax rate percentage'),
    taxAmount: z.number().optional().describe('Tax amount'),
    discount: z.number().optional().describe('Discount amount'),
    total: z.number().optional().describe('Total amount'),
    notes: z.string().optional().describe('Additional notes'),
});

const invoiceRenderer = (props: Partial<z.infer<typeof invoiceSchema>>) => {
    const [invoiceData, setInvoiceData] = useState({
        title: props.title || 'Invoice',
        invoiceNumber: props.invoiceNumber || '',
        date: props.date || new Date().toISOString().split('T')[0],
        dueDate: props.dueDate || '',
        from: props.from || { name: '', address: '', email: '', phone: '' },
        to: props.to || { name: '', address: '', email: '', phone: '' },
        items: props.items || [{ description: '', quantity: 1, rate: 0, amount: 0 }],
        subtotal: props.subtotal || 0,
        taxRate: props.taxRate || 0,
        taxAmount: props.taxAmount || 0,
        discount: props.discount || 0,
        total: props.total || 0,
        notes: props.notes || '',
    });

    const [isPinned, setIsPinned] = useState(false);
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const id = useId();

    const pinMutation = useMutation({
        mutationFn: async () => {
            try {
                await trpcClient.pinnedItems.create.mutate({
                    extension: 'invoice',
                    props: invoiceData,
                });
            } catch (error) {
                // Handle case where TRPC client is not available (e.g., in Storybook)
                console.log('Mock: Pinning invoice');
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

    const calculateTotals = () => {
        const subtotal = invoiceData.items.reduce((sum, item) => {
            const amount = item.quantity * item.rate;
            return sum + amount;
        }, 0);

        const taxAmount = subtotal * (invoiceData.taxRate / 100);
        const total = subtotal - taxAmount - invoiceData.discount;

        setInvoiceData((prev) => ({
            ...prev,
            subtotal,
            taxAmount,
            total,
        }));
    };

    useEffect(() => {
        calculateTotals();
    }, [invoiceData.items, invoiceData.taxRate, invoiceData.discount]);

    const addItem = () => {
        setInvoiceData((prev) => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }],
        }));
    };

    const removeItem = (index: number) => {
        if (invoiceData.items.length > 1) {
            setInvoiceData((prev) => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index),
            }));
        }
    };

    const updateItem = (index: number, field: string, value: string | number) => {
        setInvoiceData((prev) => ({
            ...prev,
            items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
        }));
    };

    const updateField = (field: string, value: string | number) => {
        setInvoiceData((prev) => ({ ...prev, [field]: value }));
    };

    const updateFromField = (field: string, value: string) => {
        setInvoiceData((prev) => ({
            ...prev,
            from: { ...prev.from, [field]: value },
        }));
    };

    const updateToField = (field: string, value: string) => {
        setInvoiceData((prev) => ({
            ...prev,
            to: { ...prev.to, [field]: value },
        }));
    };

    const handlePin = () => {
        pinMutation.mutate();
    };

    return (
        <Card>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor={`${id}-subject`}>Invoice</Label>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePin}
                            className="h-8 w-8 p-0"
                            title={isPinned ? 'Unpin invoice' : 'Pin invoice'}
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
                    id={`${id}-subject`}
                    value={invoiceData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Invoice title"
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
                            {/* Invoice Details */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="invoice-number">Invoice #</Label>
                                    <Input
                                        id="invoice-number"
                                        value={invoiceData.invoiceNumber}
                                        onChange={(e) => updateField('invoiceNumber', e.target.value)}
                                        placeholder="INV-001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="due-date">Due Date</Label>
                                    <Input
                                        id="due-date"
                                        type="date"
                                        value={invoiceData.dueDate}
                                        onChange={(e) => updateField('dueDate', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Client Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="from-name">From</Label>
                                    <Input
                                        id="from-name"
                                        value={invoiceData.from.name}
                                        onChange={(e) => updateFromField('name', e.target.value)}
                                        placeholder="Your Company"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="to-name">To</Label>
                                    <Input
                                        id="to-name"
                                        value={invoiceData.to.name}
                                        onChange={(e) => updateToField('name', e.target.value)}
                                        placeholder="Client Company"
                                    />
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Items</Label>
                                    <Button onClick={addItem} size="sm" variant="outline">
                                        <Plus className="mr-2 size-3" />
                                        Add
                                    </Button>
                                </div>
                                {invoiceData.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-4 gap-2">
                                        <Input
                                            value={item.description}
                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                            placeholder="Description"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Qty"
                                            value={item.quantity || ''}
                                            onChange={(e) =>
                                                updateItem(index, 'quantity', parseFloat(e.target.value) || 0)
                                            }
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Rate"
                                            value={item.rate || ''}
                                            onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                        />
                                        <div className="flex items-center gap-1">
                                            <Input
                                                value={`$${(item.quantity * item.rate).toFixed(2)}`}
                                                disabled
                                                className="bg-muted text-sm"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                                disabled={invoiceData.items.length === 1}
                                                className="text-destructive h-8 w-8 p-0"
                                            >
                                                <Trash2 className="size-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-2">
                                    <Label>Tax Rate (%)</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={invoiceData.taxRate || ''}
                                        onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Discount</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={invoiceData.discount || ''}
                                        onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Total</Label>
                                    <Input
                                        value={`$${invoiceData.total.toFixed(2)}`}
                                        disabled
                                        className="bg-primary/10 text-primary font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2">
                <Label htmlFor={`${id}-notes`}>Notes</Label>
                <Textarea
                    id={`${id}-notes`}
                    value={invoiceData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Additional notes..."
                    rows={3}
                />
            </div>
        </Card>
    );
};

export const invoiceExtension = {
    type: 'tool' as const,
    name: 'invoice',
    prompt: 'use when you want to create an invoice with line items, tax calculations, and client information. perfect for billing, freelancing, or business invoicing.',
    schema: invoiceSchema,
    renderer: invoiceRenderer,
} satisfies Extension<z.infer<typeof invoiceSchema>>;
