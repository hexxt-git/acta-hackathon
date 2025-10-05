import { z } from 'zod';
import { Extension } from '../types/extensions';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useId, useState } from 'react';
import { FileText, Copy, Download, Check } from 'lucide-react';
import { Markdown } from '@/components/ui/markdown';

const codeSchema = z.object({
    filename: z.string(),
    language: z.string(),
    code: z.string(),
});

const codeRenderer = ({
    filename: initialFilename,
    language: initialLanguage,
    code: initialCode,
}: Partial<z.infer<typeof codeSchema>>) => {
    const [filename, setFilename] = useState(initialFilename);
    const [language, setLanguage] = useState(initialLanguage || 'javascript');
    const [code, setCode] = useState(initialCode);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        setFilename(initialFilename);
    }, [initialFilename]);

    useEffect(() => {
        setLanguage(initialLanguage || 'javascript');
    }, [initialLanguage]);

    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    const id = useId();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code || '');
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([code || ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'code.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor={`${id}-code`}>
                        <FileText className="size-3.5" /> {filename}
                    </Label>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="h-8 w-8 p-0"
                            title="Copy code"
                        >
                            {copySuccess ? <Check className="size-3 text-green-600" /> : <Copy className="size-3" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="h-8 w-8 p-0"
                            title="Download code"
                        >
                            <Download className="size-3" />
                        </Button>
                    </div>
                </div>
                <Markdown content={`\`\`\`${language}\n${code || ''}\n\`\`\``} />
            </div>
        </Card>
    );
};

export const codeExtension = {
    type: 'presentation' as const,
    name: 'code',
    prompt: 'use when you want to display code with syntax highlighting.',
    schema: codeSchema,
    renderer: codeRenderer,
} satisfies Extension<z.infer<typeof codeSchema>>;
