import { z } from 'zod';
import { Extension } from '../types/extensions';
import { cn } from '@/lib/utils';
import { Markdown } from '@/components/ui/markdown';

// Color system for highlights
const HIGHLIGHT_COLORS = {
    primary: {
        badge: 'bg-primary/10 text-primary border-primary/20',
        text: 'text-primary',
    },
    secondary: {
        badge: 'bg-secondary/10 text-secondary-foreground border-secondary/20',
        text: 'text-secondary-foreground',
    },
    success: {
        badge: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        text: 'text-green-800 dark:text-green-400',
    },
    warning: {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
        text: 'text-yellow-800 dark:text-yellow-400',
    },
    danger: {
        badge: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        text: 'text-red-800 dark:text-red-400',
    },
    info: {
        badge: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        text: 'text-blue-800 dark:text-blue-400',
    },
} as const;

const getHighlightStyles = (color: keyof typeof HIGHLIGHT_COLORS) => {
    return HIGHLIGHT_COLORS[color] || HIGHLIGHT_COLORS.primary;
};

const keyValueSchema = z.object({
    title: z.string().optional().describe('Optional title for the key-value section'),
    groups: z
        .array(
            z.object({
                group: z.string().optional().describe('Optional group/category name'),
                properties: z
                    .array(
                        z.object({
                            key: z.string().describe('The property name or label'),
                            value: z.union([z.string(), z.array(z.string())]).describe('The property value'),
                            highlight: z
                                .object({
                                    label: z.string().describe('Custom label for the highlight badge'),
                                    color: z
                                        .enum(['primary', 'secondary', 'success', 'warning', 'danger', 'info'])
                                        .describe('Color theme for the badge'),
                                })
                                .optional()
                                .describe('Optional highlight configuration with custom label and color'),
                            description: z.string().optional().describe('Optional description for the property'),
                        }),
                    )
                    .describe('Array of key-value properties in this group'),
            }),
        )
        .describe('Array of property groups, each containing properties'),
});

const keyValueRenderer = ({ title, groups }: Partial<z.infer<typeof keyValueSchema>>) => {
    if (!groups || groups.length === 0) {
        return (
            <div className="text-muted-foreground p-4 text-center">
                <p className="text-sm">No properties to display</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {title && <h3 className="font-semibold">{title}</h3>}

            <div className="space-y-4">
                {groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-3">
                        {group.group && (
                            <h4 className="text-muted-foreground text-sm font-medium tracking-wide">{group.group}</h4>
                        )}

                        <div className="space-y-2">
                            {group.properties?.map((property, propertyIndex) => (
                                <div
                                    key={propertyIndex}
                                    className={cn(
                                        'bg-background dark:bg-input/30 dark:border-border rounded-md border border-transparent p-3',
                                    )}
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-foreground my-1 text-sm font-medium">
                                                    {property.key}
                                                </span>
                                                {property.highlight && (
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                                                            getHighlightStyles(property.highlight.color).badge,
                                                        )}
                                                    >
                                                        {property.highlight.label}
                                                    </span>
                                                )}
                                            </div>
                                            {property.description && (
                                                <div className="text-muted-foreground mt-1 text-xs">
                                                    <Markdown content={property.description} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="sm:text-right">
                                            <div
                                                className={`text-sm break-words ${
                                                    property.highlight ? 'font-semibold' : 'text-foreground'
                                                } ${property.highlight ? getHighlightStyles(property.highlight.color).text : ''}`}
                                            >
                                                {Array.isArray(property.value) ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {property.value.map((value) => (
                                                            <div
                                                                key={value}
                                                                className="bg-background dark:bg-muted rounded-md px-2 py-1"
                                                            >
                                                                <Markdown content={value} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Markdown content={property.value} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const keyValueExtension = {
    type: 'presentation' as const,
    name: 'key-value',
    prompt: 'use when you want to display key-value pairs or properties in a structured format. useful for specifications, attributes, settings, or any structured data that consists of labels and values. do not overuse',
    schema: keyValueSchema,
    renderer: keyValueRenderer,
} satisfies Extension<z.infer<typeof keyValueSchema>>;
