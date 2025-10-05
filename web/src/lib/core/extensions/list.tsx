import { z } from 'zod';
import { Extension } from '../types/extensions';
import { Markdown } from '@/components/ui/markdown';

const listSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    list: z.union([
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
        z.object({
            type: z.literal('items'),
            items: z.array(
                z.object({
                    title: z.string(),
                    description: z.string(),
                }),
            ),
        }),
    ]),
});

const listRenderer = (props: Partial<z.infer<typeof listSchema>>) => {
    const { list, title = '', description = '' } = props;
    if (list?.type === 'simple') {
        const style = (props as any).style || 'bullet';
        return (
            <div className="space-y-2">
                {title && (
                    <h3 className="text-foreground border-border border-b pb-2 text-lg font-semibold">{title}</h3>
                )}
                {description && (
                    <div className="text-muted-foreground text-xs">
                        <Markdown content={description || ''} />
                    </div>
                )}
                {list.items?.map((item, index) => (
                    <div
                        key={index}
                        className="bg-background dark:bg-input/30 dark:border-border flex w-full items-center gap-2 rounded-md border border-transparent p-2"
                    >
                        <span className="text-muted-foreground text-xs">
                            {style === 'bullet' ? '•' : `${index + 1}.`}
                        </span>
                        <div className="flex-1 text-sm/[1.2]">
                            <Markdown content={item} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (list?.type === 'detailed') {
        return (
            <div className="space-y-2">
                {title && (
                    <h3 className="text-foreground border-border border-b pb-2 text-lg font-semibold">{title}</h3>
                )}
                {description && (
                    <div className="text-muted-foreground text-xs">
                        <Markdown content={description || ''} />
                    </div>
                )}
                {list.items?.map((item, index) => (
                    <div
                        key={index}
                        className="bg-background dark:bg-input/30 dark:border-border rounded-md border border-transparent p-2"
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-muted-foreground mt-1.5 text-xs">{index + 1}.</span>
                            <div className="flex-1">
                                <div className="mb-1 text-sm font-medium">
                                    <Markdown content={item.title} />
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    <Markdown content={item.description} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (list?.type === 'items') {
        return (
            <div className="space-y-2">
                {title && (
                    <h3 className="text-foreground border-border border-b pb-2 text-lg font-semibold">{title}</h3>
                )}
                {description && (
                    <div className="text-muted-foreground text-xs">
                        <Markdown content={description || ''} />
                    </div>
                )}
                <div className="flex flex-wrap gap-4">
                    {list.items?.map((item, index) => (
                        <div
                            key={index}
                            className="bg-background dark:bg-input/30 dark:border-border min-w-64 flex-1 space-y-2 rounded-lg border border-transparent p-4"
                        >
                            <h4 className="text-foreground text-sm font-medium">
                                <Markdown content={item.title} />
                            </h4>
                            <div className="text-muted-foreground text-xs leading-relaxed">
                                <Markdown content={item.description} />
                            </div>
                        </div>
                    ))}
                </div>
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
    type: 'presentation' as const,
    name: 'list',
    prompt: 'use when you want to give the user a list of items. you can choose to use a simple list, detailed list, or items layout. the items type displays items in a flexible wrapping layout with title and description.',
    schema: listSchema,
    renderer: listRenderer,
} satisfies Extension<z.infer<typeof listSchema>>;
