import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';
import { iconMap } from './icons';
import { Badge } from '@/components/ui/badge';

// Single spec card schema (reused from spec-card.tsx)
export const singleSpecCardSchema = z.object({
    title: z.string().describe('The main title for the specifications'),
    category: z.string().optional().describe('Optional category/group name'),
    image: z.string().optional().describe('Optional image URL for the product'),
    imageAlt: z.string().optional().describe('Alt text for the image'),
    specs: z
        .array(
            z.object({
                label: z.string().describe('The specification name'),
                value: z.union([z.string(), z.array(z.string())]).describe('The specification value or values'),
                unit: z.string().optional().describe('The unit of measurement'),
                icon: z
                    .enum([
                        'smartphone',
                        'monitor',
                        'cpu',
                        'camera',
                        'battery',
                        'zap',
                        'weight',
                        'ruler',
                        'palette',
                        'volume',
                        'wifi',
                        'bluetooth',
                        'usb',
                        'settings',
                        'star',
                        'trending-up',
                        'hard-drive',
                        'database',
                        'eye',
                        'maximize',
                        'headphones',
                        'mic',
                        'signal',
                        'radio',
                        'gauge',
                        'activity',
                        'package',
                        'layers',
                        'power',
                        'plug',
                        'archive',
                        'folder',
                        'shield',
                        'lock',
                        'gamepad',
                        'trophy',
                        'car',
                        'fuel',
                        'clock',
                        'calendar',
                        'map-pin',
                        'thermometer',
                        'wind',
                        'sun',
                    ])
                    .describe('Icon to display for this spec'),
                highlight: z.boolean().optional().describe('Whether to highlight this spec'),
            }),
        )
        .describe('Array of specifications to display'),
});

export interface SpecCardProps {
    title?: string;
    category?: string;
    image?: string;
    imageAlt?: string;
    specs?: z.infer<typeof singleSpecCardSchema>['specs'];
}

// Single card renderer (reused from spec-card.tsx with minor adjustments)
export const SpecCard = ({
    title,
    category,
    image = 'https://placehold.co/600x400',
    imageAlt,
    specs,
}: SpecCardProps) => {
    if (!specs || specs.length === 0) {
        return (
            <div className="border-muted-foreground/25 rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground text-sm">No specifications to display</p>
            </div>
        );
    }

    return (
        <Card className="max-w-md space-y-0 p-0">
            {/* Image Section */}
            {image && (
                <div className="bg-muted relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                        src={image}
                        alt={imageAlt || title || 'Product image'}
                        className="h-full w-full rounded-t-lg object-cover"
                    />
                    {category && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-background/80 text-foreground rounded px-2 py-1 text-xs font-medium backdrop-blur-sm">
                                {category}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content Section */}
            <div className="p-2">
                {/* Title */}
                {title && <h3 className="text-foreground mb-2 font-semibold">{title}</h3>}

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-1">
                    {specs.map((spec, index) => {
                        const IconComponent = iconMap[spec.icon] || Settings; // Fallback to Settings icon
                        return (
                            <div
                                key={index}
                                className={cn('rounded border p-3 transition-colors', {
                                    'bg-primary/5 border-primary/20': spec.highlight,
                                    'bg-muted/30': !spec.highlight,
                                })}
                                title={`${spec.label}: ${spec.value} ${spec.unit || ''}`}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    {/* Icon and label on the left */}
                                    <div className="flex items-center gap-2">
                                        <IconComponent
                                            className={cn(
                                                'size-4 shrink-0',
                                                spec.highlight ? 'text-primary' : 'text-muted-foreground',
                                            )}
                                        />
                                        <div className="text-foreground text-sm leading-tight font-medium">
                                            {spec.label}
                                        </div>
                                    </div>
                                    {/* Value on the right */}
                                    <div className="ms-auto flex items-center gap-1">
                                        <div
                                            className={cn(
                                                'text-sm font-semibold tabular-nums',
                                                spec.highlight ? 'text-primary' : 'text-foreground',
                                            )}
                                        >
                                            {Array.isArray(spec.value) ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {spec.value.map((v) => (
                                                        <div
                                                            key={v}
                                                            className="bg-background dark:bg-muted rounded-md px-1.5 py-0.5 text-xs"
                                                        >
                                                            {v}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                spec.value
                                            )}
                                        </div>
                                        {spec.unit && (
                                            <span className="text-muted-foreground text-xs leading-none">
                                                {spec.unit}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};
