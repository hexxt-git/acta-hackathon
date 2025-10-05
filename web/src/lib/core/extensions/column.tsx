import { z } from 'zod';
import { Extension } from '../types/extensions';
import { cn } from '@/lib/utils';
import { Markdown } from '@/components/ui/markdown';

const columnSchema = z.object({
    title: z.string().optional().describe('Optional title for the entire column layout'),
    columns: z
        .array(
            z.object({
                title: z.string().optional().describe('Optional title for this column'),
                body: z
                    .union([
                        z.string().describe('Text content for the column body'),
                        z.array(z.string()).describe('List of items for the column body'),
                    ])
                    .describe('The body content - can be text or a list of items'),
            }),
        )
        .min(1)
        .max(4)
        .describe('Array of columns (1-4 columns supported)'),
});

const columnRenderer = ({ title, columns }: Partial<z.infer<typeof columnSchema>>) => {
    if (!columns || columns.length === 0) {
        return (
            <div className="text-muted-foreground p-4 text-center">
                <p className="text-sm">No columns to display</p>
            </div>
        );
    }

    const getGridCols = (columnCount: number) => {
        switch (columnCount) {
            case 1:
                return 'grid-cols-1';
            case 2:
                return 'grid-cols-1 md:grid-cols-2';
            case 3:
                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
            case 4:
                return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
            default:
                return 'grid-cols-1';
        }
    };

    return (
        <div className="space-y-4">
            {title && <h3 className="text-foreground border-border border-b pb-2 text-lg font-semibold">{title}</h3>}

            <div className={cn('divide-border grid divide-x', getGridCols(columns.length))}>
                {columns.map((column, index) => (
                    <div key={index} className="space-y-3 px-6">
                        {column.title && <h4 className="text-foreground text-base font-medium">{column.title}</h4>}

                        <div className="space-y-2">
                            {Array.isArray(column.body) ? (
                                <ul className="space-y-2">
                                    {column.body.map((item, itemIndex) => (
                                        <li key={itemIndex} className="text-foreground flex items-start gap-2 text-sm">
                                            <span className="text-muted-foreground mt-1 flex-shrink-0">•</span>
                                            <span className="flex-1">
                                                <Markdown content={item} />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-foreground text-sm">
                                    <Markdown content={column.body} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const columnExtension = {
    type: 'presentation' as const,
    name: 'column',
    prompt: 'use when you want to display content in multiple columns side by side. each column can have a title and body content (text or list). useful for comparing information, organizing related content, or creating multi-column layouts. supports 1-4 columns.',
    schema: columnSchema,
    renderer: columnRenderer,
} satisfies Extension<z.infer<typeof columnSchema>>;
