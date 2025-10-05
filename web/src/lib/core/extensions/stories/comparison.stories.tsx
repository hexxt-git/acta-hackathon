import type { Meta, StoryObj } from '@storybook/react-vite';
import { comparisonExtension } from '../comparison';

const meta: Meta<typeof comparisonExtension.renderer> = {
    title: 'Extensions/Comparison',
    component: comparisonExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Comparison: Story = {
    args: {
        options: ['Option A', 'Option B', 'Option C'],
        comparisons: [
            {
                type: 'barChart',
                comparison: {
                    label: 'Monthly Revenue',
                    data: [
                        {
                            category: 'Q1',
                            values: [
                                { key: 'Option A', value: 100 },
                                { key: 'Option B', value: 150 },
                                { key: 'Option C', value: 200 },
                            ],
                        },
                    ],
                },
            },
        ],
    },
};
