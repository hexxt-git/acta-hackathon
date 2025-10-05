import type { Meta, StoryObj } from '@storybook/react-vite';
import { multiSpecCardExtension } from '../multi-spec-card';

const meta: Meta<typeof multiSpecCardExtension.renderer> = {
    title: 'Extensions/Multi Spec Card',
    component: multiSpecCardExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiSpecCard: Story = {
    args: {
        title: 'Product Comparison',
        cards: [
            {
                title: 'iPhone 15 Pro',
                category: 'Premium',
                specs: [
                    { label: 'Display', value: '6.1"', icon: 'monitor', highlight: true },
                    { label: 'Processor', value: 'A17 Pro', icon: 'cpu' },
                ],
            },
            {
                title: 'Samsung Galaxy S24',
                category: 'Premium',
                specs: [
                    { label: 'Display', value: '6.2"', icon: 'monitor', highlight: true },
                    { label: 'Processor', value: 'Snapdragon 8', icon: 'cpu' },
                ],
            },
        ],
    },
};
