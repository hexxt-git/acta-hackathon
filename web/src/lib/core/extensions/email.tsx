import { z } from 'zod';
import { Extension } from '../types/extensions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useEffect, useId, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon, Pin, Check, Loader2 } from 'lucide-react';
import { TagInput, TagItem } from '@/components/ui/tag-input';
import { AnimatePresence, motion } from 'motion/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/integrations/tanstack-query/root-provider';

const emailSchema = z.object({
    subject: z.string(),
    recipients: z.array(z.string().email()).optional(),
    cc: z.array(z.string().email()).optional(),
    bcc: z.array(z.string().email()).optional(),
    body: z.string(),
});

const emailRenderer = ({
    subject: initialSubject,
    body: initialBody,
    recipients: initialRecipients,
    cc: initialCc,
    bcc: initialBcc,
}: Partial<z.infer<typeof emailSchema>>) => {
    const [subject, setSubject] = useState(initialSubject);
    const [body, setBody] = useState(initialBody);

    const [recipients, setRecipients] = useState<TagItem[]>(
        initialRecipients?.map((recipient) => ({
            id: recipient,
            text: recipient,
        })) || [],
    );
    const [cc, setCc] = useState<TagItem[]>(initialCc?.map((cc) => ({ id: cc, text: cc })) || []);
    const [bcc, setBcc] = useState<TagItem[]>(initialBcc?.map((bcc) => ({ id: bcc, text: bcc })) || []);
    const [open, setOpen] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const id = useId();
    const queryClient = useQueryClient();

    const pinMutation = useMutation({
        mutationFn: async () => {
            await trpcClient.pinnedItems.create.mutate({
                extension: 'email',
                props: {
                    subject,
                    body,
                    recipients: recipients.map((r) => r.text),
                    cc: cc.map((c) => c.text),
                    bcc: bcc.map((b) => b.text),
                },
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
        setSubject(initialSubject);
    }, [initialSubject]);

    useEffect(() => {
        setBody(initialBody);
    }, [initialBody]);

    useEffect(() => {
        setRecipients(
            initialRecipients?.map((recipient) => ({
                id: recipient,
                text: recipient,
            })) || [],
        );
    }, [initialRecipients]);

    useEffect(() => {
        setCc(initialCc?.map((cc) => ({ id: cc, text: cc })) || []);
    }, [initialCc]);

    useEffect(() => {
        setBcc(initialBcc?.map((bcc) => ({ id: bcc, text: bcc })) || []);
    }, [initialBcc]);

    const href = useMemo(() => {
        // Properly encode each component for a valid mailto URL
        const to = recipients.map((recipient) => encodeURIComponent(recipient.text)).join(',');
        const encodedSubject = encodeURIComponent(subject || '');
        const encodedBody = encodeURIComponent(body || '');
        const encodedCc = cc.map((cc) => encodeURIComponent(cc.text)).join(',');
        const encodedBcc = bcc.map((bcc) => encodeURIComponent(bcc.text)).join(',');

        let mailtoUrl = `mailto:${to}`;
        const params = [];

        if (encodedSubject) params.push(`subject=${encodedSubject}`);
        if (encodedBody) params.push(`body=${encodedBody}`);
        if (encodedCc) params.push(`cc=${encodedCc}`);
        if (encodedBcc) params.push(`bcc=${encodedBcc}`);

        if (params.length > 0) {
            mailtoUrl += '?' + params.join('&');
        }

        return mailtoUrl;
    }, [recipients, subject, body, cc, bcc]);

    return (
        <Card>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor={`${id}-subject`}>Subject</Label>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePin}
                            className="h-6 w-6 p-0"
                            title={isPinned ? 'Unpin email' : 'Pin email'}
                        >
                            {pinMutation.isPending ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : isPinned ? (
                                <Check className="size-3 text-green-600" />
                            ) : (
                                <Pin className="size-3" />
                            )}
                        </Button>
                        <Button variant="ghost" onClick={() => setOpen(!open)}>
                            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </Button>
                    </div>
                </div>
                <Input id={`${id}-subject`} value={subject} onChange={(e) => setSubject(e.target.value)} />
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
                        <div className="space-y-2 pt-4">
                            <Label htmlFor={`${id}-recipients`}>Recipients</Label>
                            <TagInput
                                id={`${id}-recipients`}
                                tags={recipients}
                                onChange={setRecipients}
                                placeholder="Add recipients"
                            />
                        </div>
                        <div className="grid gap-2 pt-2 sm:grid-cols-2 sm:gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`${id}-cc`}>CC</Label>
                                <TagInput id={`${id}-cc`} tags={cc} onChange={setCc} placeholder="Add CC recipients" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`${id}-bcc`}>BCC</Label>
                                <TagInput
                                    id={`${id}-bcc`}
                                    tags={bcc}
                                    onChange={setBcc}
                                    placeholder="Add BCC recipients"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="space-y-2">
                <Label htmlFor={`${id}-body`}>Body</Label>
                <Textarea id={`${id}-body`} value={body} onChange={(e) => setBody(e.target.value)} rows={15} />
            </div>
            <div className="mt-4 flex justify-end">
                <Button asChild>
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        Finalize
                    </a>
                </Button>
            </div>
        </Card>
    );
};

export const emailExtension = {
    name: 'email',
    prompt: "use when you want to draft an email. if you don't have some of the information just fill it out with a placeholder.",
    schema: emailSchema,
    renderer: emailRenderer,
} satisfies Extension<z.infer<typeof emailSchema>>;
