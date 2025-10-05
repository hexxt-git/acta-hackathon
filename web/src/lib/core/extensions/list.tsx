import { z } from 'zod';
import { Extension } from '../types/extensions';

const listSchema = z.union([
    z.object({
        type: z.literal('simple'),
        style: z.enum(['bullet', 'numbered']),
        items: z.array(z.string()),
    }),
    z.object({
        type: z.literal('detailed'),
        style: z.enum(['bullet', 'numbered']),
        items: z.array(
            z.object({
                title: z.string(),
                description: z.string(),
            }),
        ),
    }),
]);

const listRenderer = ({ type, style, items }: Partial<z.infer<typeof listSchema>>) => {
    if (type === 'simple') {
        return (
            <div className="space-y-2">
                {items?.map((item, index) => (
                    <div
                        key={index}
                        className="bg-background dark:bg-input/30 dark:border-border flex w-full items-center gap-2 rounded-md border border-transparent p-2"
                    >
                        <span className="text-muted-foreground text-xs">
                            {style === 'bullet' ? '•' : `${index + 1}.`}
                        </span>
                        <span className="flex-1 text-sm/[1.2]">{item}</span>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'detailed') {
        return (
            <div className="space-y-2">
                {items?.map((item, index) => (
                    <div
                        key={index}
                        className="bg-background dark:bg-input/30 dark:border-border rounded-md border border-transparent p-2"
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-muted-foreground mt-0.5 text-xs">{index + 1}.</span>
                            <div className="flex-1">
                                <h4 className="mb-1 text-sm font-medium">{item.title}</h4>
                                <p className="text-muted-foreground text-xs">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="text-muted-foreground p-4 text-center">
            <p className="text-sm">Invalid list type</p>
        </div>
    );
};

export const listExtension = {
    name: 'list',
    prompt: 'use when you want to give the user a list of items. you can choose to use a simple list or a detailed list.',
    schema: listSchema,
    renderer: listRenderer,
} satisfies Extension<z.infer<typeof listSchema>>;
