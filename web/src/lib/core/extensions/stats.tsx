import { z } from 'zod';
import { Extension } from '../types/extensions';
import { cn } from '@/lib/utils';
import { Markdown } from '@/components/ui/markdown';

const statsSchema = z.object({
    title: z.string().optional().describe('Optional title for the stats section'),
    layout: z
        .enum(['grid', 'horizontal', 'vertical', 'highlight', 'comparison'])
        .default('grid')
        .describe('Layout style for the stats'),
    stats: z
        .array(
            z.object({
                label: z.string().describe('The stat label or name'),
                value: z.union([z.string(), z.number()]).describe('The stat value'),
                unit: z.string().optional().describe('Optional unit (%, $, etc.)'),
                description: z.string().optional().describe('Optional description or context'),
                trend: z
                    .object({
                        direction: z.enum(['up', 'down', 'neutral']).describe('Trend direction'),
                        value: z.string().describe('Trend value (e.g., "+12%", "-5%")'),
                        period: z.string().optional().describe('Period for trend (e.g., "vs last month")'),
                    })
                    .optional()
                    .describe('Optional trend information'),
                highlight: z.boolean().optional().describe('Whether to highlight this stat'),
                icon: z
                    .enum([
                        'users',
                        'trending-up',
                        'trending-down',
                        'dollar-sign',
                        'percent',
                        'activity',
                        'target',
                        'award',
                        'clock',
                        'calendar',
                        'star',
                        'heart',
                        'thumbs-up',
                        'eye',
                        'download',
                        'upload',
                        'zap',
                        'shield',
                        'check-circle',
                        'alert-circle',
                        'info',
                        'cpu',
                        'database',
                        'server',
                        'globe',
                        'smartphone',
                        'monitor',
                        'headphones',
                        'camera',
                        'battery',
                        'wifi',
                        'bluetooth',
                        'settings',
                        'package',
                        'layers',
                        'power',
                        'plug',
                        'archive',
                        'folder',
                        'lock',
                        'gamepad',
                        'trophy',
                        'car',
                        'fuel',
                        'map-pin',
                        'thermometer',
                        'wind',
                        'sun',
                    ])
                    .optional()
                    .describe('Optional icon for the stat'),
                color: z
                    .enum(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'])
                    .optional()
                    .default('neutral')
                    .describe('Color theme for the stat'),
            }),
        )
        .min(1)
        .max(12)
        .describe('Array of stats to display (1-12 stats)'),
});

const getColorStyles = (color: string) => {
    const colors = {
        primary: {
            bg: 'bg-primary/10',
            text: 'text-primary',
            border: 'border-primary/20',
            accent: 'text-primary',
        },
        secondary: {
            bg: 'bg-secondary/10',
            text: 'text-secondary-foreground',
            border: 'border-secondary/20',
            accent: 'text-secondary-foreground',
        },
        success: {
            bg: 'bg-green-100 dark:bg-green-900/20',
            text: 'text-green-800 dark:text-green-400',
            border: 'border-green-200 dark:border-green-800',
            accent: 'text-green-600 dark:text-green-400',
        },
        warning: {
            bg: 'bg-yellow-100 dark:bg-yellow-900/20',
            text: 'text-yellow-800 dark:text-yellow-400',
            border: 'border-yellow-200 dark:border-yellow-800',
            accent: 'text-yellow-600 dark:text-yellow-400',
        },
        danger: {
            bg: 'bg-red-100 dark:bg-red-900/20',
            text: 'text-red-800 dark:text-red-400',
            border: 'border-red-200 dark:border-red-800',
            accent: 'text-red-600 dark:text-red-400',
        },
        info: {
            bg: 'bg-blue-100 dark:bg-blue-900/20',
            text: 'text-blue-800 dark:text-blue-400',
            border: 'border-blue-200 dark:border-blue-800',
            accent: 'text-blue-600 dark:text-blue-400',
        },
        neutral: {
            bg: 'bg-gray-100 dark:bg-gray-900/20',
            text: 'text-gray-800 dark:text-gray-400',
            border: 'border-gray-200 dark:border-gray-800',
            accent: 'text-gray-600 dark:text-gray-400',
        },
    };
    return colors[color as keyof typeof colors] || colors.neutral;
};

const getTrendIcon = (direction: string) => {
    switch (direction) {
        case 'up':
            return '↗';
        case 'down':
            return '↘';
        case 'neutral':
            return '→';
        default:
            return '→';
    }
};

const getTrendColor = (direction: string) => {
    switch (direction) {
        case 'up':
            return 'text-green-600 dark:text-green-400';
        case 'down':
            return 'text-red-600 dark:text-red-400';
        case 'neutral':
            return 'text-gray-600 dark:text-gray-400';
        default:
            return 'text-gray-600 dark:text-gray-400';
    }
};

const getLayoutClasses = (layout: string, statsCount: number) => {
    switch (layout) {
        case 'horizontal':
            return 'flex flex-wrap gap-4';
        case 'vertical':
            return 'space-y-4';
        case 'highlight':
            return statsCount === 1
                ? 'grid grid-cols-1'
                : statsCount === 2
                  ? 'grid grid-cols-1 md:grid-cols-2'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        case 'comparison':
            return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        case 'grid':
        default:
            return statsCount <= 2
                ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                : statsCount <= 4
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
    }
};

const statsRenderer = ({ title, layout = 'grid', stats }: Partial<z.infer<typeof statsSchema>>) => {
    if (!stats || stats.length === 0) {
        return (
            <div className="text-muted-foreground p-4 text-center">
                <p className="text-sm">No stats to display</p>
            </div>
        );
    }

    const layoutClasses = getLayoutClasses(layout, stats.length);

    const renderStat = (stat: z.infer<typeof statsSchema>['stats'][0], index: number) => {
        const colorStyles = getColorStyles(stat.color || 'neutral');
        const isHighlight = layout === 'highlight' || stat.highlight;

        if (layout === 'horizontal') {
            return (
                <div
                    key={index}
                    className={cn(
                        'flex max-w-86 items-center gap-3 rounded-lg border p-3',
                        isHighlight ? colorStyles.bg : 'bg-background/50',
                        isHighlight ? colorStyles.border : 'border-border',
                    )}
                >
                    {stat.icon && (
                        <div className={cn('text-lg', colorStyles.accent)}>
                            {/* Icon placeholder - you could use lucide-react icons here */}
                            <span className="px-4 text-2xl">📊</span>
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                            <span className={cn('text-lg font-semibold', colorStyles.text)}>
                                {stat.value}
                                {stat.unit && <span className="text-sm">{stat.unit}</span>}
                            </span>
                            {stat.trend && (
                                <span className={cn('text-xs font-medium', getTrendColor(stat.trend.direction))}>
                                    {getTrendIcon(stat.trend.direction)} {stat.trend.value}
                                </span>
                            )}
                        </div>
                        <div className="text-muted-foreground text-sm">{stat.label}</div>
                        {stat.description && (
                            <div className="text-muted-foreground mt-1 text-xs">
                                <Markdown content={stat.description} />
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (layout === 'vertical') {
            return (
                <div
                    key={index}
                    className={cn(
                        'flex items-center justify-between rounded-lg border p-4',
                        isHighlight ? colorStyles.bg : 'bg-background/50',
                        isHighlight ? colorStyles.border : 'border-border',
                    )}
                >
                    <div className="flex items-center gap-3">
                        {stat.icon && (
                            <div className={cn('text-lg', colorStyles.accent)}>
                                <span className="text-2xl">📊</span>
                            </div>
                        )}
                        <div>
                            <div className="text-muted-foreground text-sm">{stat.label}</div>
                            {stat.description && (
                                <div className="text-muted-foreground mt-1 text-xs">
                                    <Markdown content={stat.description} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline gap-2">
                            <span className={cn('text-xl font-bold', colorStyles.text)}>
                                {stat.value}
                                {stat.unit && <span className="text-sm">{stat.unit}</span>}
                            </span>
                            {stat.trend && (
                                <span className={cn('text-xs font-medium', getTrendColor(stat.trend.direction))}>
                                    {getTrendIcon(stat.trend.direction)} {stat.trend.value}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // Default card layout (grid, highlight, comparison)
        return (
            <div
                key={index}
                className={cn(
                    'rounded-lg border p-4 text-center',
                    isHighlight ? colorStyles.bg : 'bg-background/50',
                    isHighlight ? colorStyles.border : 'border-border',
                    layout === 'highlight' && 'shadow-sm',
                )}
            >
                {stat.icon && (
                    <div className={cn('mb-2 text-2xl', colorStyles.accent)}>
                        <span className="text-3xl">📊</span>
                    </div>
                )}
                <div className={cn('mb-1 text-2xl font-bold', colorStyles.text)}>
                    {stat.value}
                    {stat.unit && <span className="text-lg">{stat.unit}</span>}
                </div>
                <div className="text-muted-foreground mb-2 text-sm">{stat.label}</div>
                {stat.trend && (
                    <div className={cn('mb-2 text-xs font-medium', getTrendColor(stat.trend.direction))}>
                        {getTrendIcon(stat.trend.direction)} {stat.trend.value}
                        {stat.trend.period && <span className="text-muted-foreground"> {stat.trend.period}</span>}
                    </div>
                )}
                {stat.description && (
                    <div className="text-muted-foreground text-xs">
                        <Markdown content={stat.description} />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {title && <h3 className="text-foreground border-border border-b pb-2 text-lg font-semibold">{title}</h3>}

            <div className={layoutClasses}>{stats.map((stat, index) => renderStat(stat, index))}</div>
        </div>
    );
};

export const statsExtension = {
    name: 'stats',
    type: 'presentation',
    prompt: 'use when displaying statistics, metrics, KPIs, or numerical data. supports multiple layouts (grid, horizontal, vertical, highlight, comparison) and can show trends, icons, colors, and descriptions. perfect for dashboards, reports, performance metrics, or any data visualization needs.',
    schema: statsSchema,
    renderer: statsRenderer,
} satisfies Extension<z.infer<typeof statsSchema>>;
