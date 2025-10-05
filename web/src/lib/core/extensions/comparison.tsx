import { z } from 'zod';
import { Extension } from '../types/extensions';
import { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const comparisonSchema = z.object({
    options: z.array(z.string()).describe('The list of items being compared, used for legends and filters.'),
    comparisons: z.array(
        z.object({
            annotation: z.string().optional().describe('Optional context about the comparison.'),
            type: z.enum(['barChart', 'radarChart', 'lineChart', 'pieChart']),
            comparison: z.object({
                label: z.string().describe("the field we are comparing, e.g. 'Department A', 'Version 2', etc."),
                data: z.array(
                    z.object({
                        category: z
                            .string()
                            .describe('The group or time bucket for the comparison, e.g. date or segment.'),
                        values: z
                            .array(
                                z.object({
                                    key: z
                                        .string()
                                        .describe(
                                            'The comparison option identifier (should match an entry in options).',
                                        ),
                                    value: z
                                        .number()
                                        .describe('The numeric value for this option in the given category.'),
                                }),
                            )
                            .describe('Each option/value pair that contributes to this comparison category.'),
                    }),
                ),
            }),
        }),
    ),
});

type ComparisonConfig = z.infer<typeof comparisonSchema>;
type ChartType = ComparisonConfig['comparisons'][number]['type'];

const COLOR_VARS = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'];

const comparisonRenderer = ({ options = [], comparisons = [] }: Partial<ComparisonConfig>) => {
    const optionColors = useMemo(() => {
        return options.reduce<Record<string, string>>((acc, option, index) => {
            const colorVar = COLOR_VARS[index % COLOR_VARS.length];
            acc[option] = `var(${colorVar})`;
            return acc;
        }, {});
    }, [options]);

    if (comparisons.length === 0) {
        return <Card className="text-muted-foreground text-sm">No comparison data available.</Card>;
    }

    return (
        <div className="mt-4 mb-8 space-y-4">
            {options.length > 0 && (
                <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
                    {options.map((option) => (
                        <span
                            key={option}
                            className={cn('rounded-full border px-3 py-1', 'bg-muted/40 text-foreground border-border')}
                            style={{
                                borderColor: optionColors[option] ?? 'var(--border)',
                                backgroundColor: optionColors[option] ?? 'var(--foreground)',
                            }}
                        >
                            {option}
                        </span>
                    ))}
                </div>
            )}

            {comparisons.length > 0 && (
                <ComparisonCard comparison={comparisons[0]} options={options} optionColors={optionColors} />
            )}
        </div>
    );
};

interface ComparisonCardProps {
    comparison: ComparisonConfig['comparisons'][number];
    options: string[];
    optionColors: Record<string, string>;
}

function ComparisonCard({ comparison, options, optionColors }: ComparisonCardProps) {
    const chartType = comparison.type;

    const chartData = useMemo(() => {
        return (
            comparison.comparison?.data?.map((row) => {
                const values = options.reduce<Record<string, number>>((acc, option) => {
                    const match = row.values?.find((entry) => entry.key === option);
                    acc[option] = match?.value ?? 0;
                    return acc;
                }, {});

                return {
                    category: row.category,
                    ...values,
                };
            }) ?? []
        );
    }, [comparison, options]);

    const pieData = useMemo(() => {
        const totals = options.reduce<Record<string, number>>((acc, option) => {
            acc[option] = 0;
            return acc;
        }, {});

        comparison.comparison?.data?.forEach((row) => {
            row.values?.forEach(({ key, value }) => {
                totals[key] = (totals[key] ?? 0) + value;
            });
        });

        return options.map((option) => ({
            name: option,
            value: totals[option] ?? 0,
        }));
    }, [comparison, options]);

    const hasData = chartData.length > 0;

    return (
        <Card className="space-y-4 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-xs">{comparison.comparison?.label}</p>
                {comparison.annotation ? (
                    <p className="text-muted-foreground text-sm">{comparison.annotation}</p>
                ) : null}
            </div>

            {!hasData ? (
                <div className="text-muted-foreground text-sm">No data available for this comparison.</div>
            ) : (
                <div className="h-[280px] w-full 2xl:h-[360px]">
                    {renderChart({
                        chartType,
                        chartData,
                        pieData,
                        options,
                        optionColors,
                    })}
                </div>
            )}
        </Card>
    );
}

interface RenderChartProps {
    chartType: ChartType;
    chartData: Array<Record<string, number | string>>;
    pieData: Array<{ name: string; value: number }>;
    options: string[];
    optionColors: Record<string, string>;
}

function renderChart({ chartType, chartData, pieData, options, optionColors }: RenderChartProps) {
    switch (chartType) {
        case 'barChart':
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="horizontal">
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="category" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={40} />
                        <Tooltip formatter={(value) => value?.toString()} />
                        <Legend />
                        {options.map((option) => (
                            <Bar
                                key={option}
                                name={option}
                                dataKey={option}
                                fill={optionColors[option]}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={64}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            );

        case 'lineChart':
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="category" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} width={40} />
                        <Tooltip formatter={(value) => value?.toString()} />
                        <Legend />
                        {options.map((option) => (
                            <Line
                                key={option}
                                type="monotone"
                                dataKey={option}
                                stroke={optionColors[option]}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            );

        case 'radarChart':
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis />
                        <Tooltip formatter={(value) => value?.toString()} />
                        <Legend />
                        {options.map((option) => (
                            <Radar
                                key={option}
                                name={option}
                                dataKey={option}
                                stroke={optionColors[option]}
                                fill={optionColors[option]}
                                fillOpacity={0.25}
                            />
                        ))}
                    </RadarChart>
                </ResponsiveContainer>
            );

        case 'pieChart':
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip formatter={(value) => value?.toString()} />
                        <Legend />
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                        >
                            {pieData.map((entry) => (
                                <Cell key={entry.name} fill={optionColors[entry.name]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            );
    }
}

export const comparisonExtension = {
    type: 'presentation' as const,
    name: 'comparison',
    prompt: 'use when you are comparing multiple options or choices. make sure to use a variation of charts and use the appropriate chart for the data.',
    schema: comparisonSchema,
    renderer: comparisonRenderer,
} satisfies Extension<z.infer<typeof comparisonSchema>>;
