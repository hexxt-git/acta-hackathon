import type { Meta, StoryObj } from '@storybook/react-vite';
import { keyValueExtension } from '../key-value';

const meta: Meta<typeof keyValueExtension.renderer> = {
    title: 'Extensions/KeyValue',
    component: keyValueExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const KeyValue: Story = {
    args: {
        title: 'Product Info',
        groups: [
            {
                group: 'Basic Info',
                properties: [
                    { key: 'Name', value: '**Wireless Headphones**' },
                    { key: 'Brand', value: 'AudioTech' },
                    {
                        key: 'Features',
                        value: 'Supports `Bluetooth 5.0`, *noise cancellation*, and **30-hour battery**',
                    },
                ],
            },
        ],
    },
};
