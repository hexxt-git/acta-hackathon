import type { Meta, StoryObj } from '@storybook/react-vite';
import { messageExtension } from '../message';

const meta: Meta<typeof messageExtension.renderer> = {
    title: 'Extensions/Message',
    component: messageExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InfoMessage: Story = {
    args: {
        type: 'alert',
        message:
            'This is an informational message that provides helpful details. You can use **bold text**, *italic text*, and even `code snippets` with markdown support.',
    },
};
