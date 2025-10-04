import { z } from 'zod';
import { Extension } from '../types/extensions';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useEffect, useId, useState } from 'react';
import { FileText } from 'lucide-react';

const draftSchema = z.object({
    title: z.string(),
    body: z.string(),
});

const draftRenderer = ({ title: initialTitle, body: initialBody }: Partial<z.infer<typeof draftSchema>>) => {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    useEffect(() => {
        setBody(initialBody);
    }, [initialBody]);

    const id = useId();
    return (
        <Card>
            <div className="space-y-2">
                <Label htmlFor={`${id}-body`}>
                    <FileText className="size-3.5" /> {title}
                </Label>
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
