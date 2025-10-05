import type { Meta, StoryObj } from '@storybook/react-vite';
import { specCardExtension } from '../spec-card';

const meta: Meta<typeof specCardExtension.renderer> = {
    title: 'Extensions/Spec Card',
    component: specCardExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SpecCard: Story = {
    args: {
        title: 'iPhone 15 Pro',
        category: 'Premium',
        specs: [
            { label: 'Display', value: '6.1"', icon: 'monitor', highlight: true },
            { label: 'Processor', value: 'A17 Pro', icon: 'cpu' },
            { label: 'Camera', value: '48MP', icon: 'camera' },
            { label: 'Battery', value: '3274', unit: 'mAh', icon: 'battery' },
        ],
    },
};
