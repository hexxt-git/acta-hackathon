import type { Meta, StoryObj } from '@storybook/react-vite';
import { exampleExtension } from '../example';

const meta: Meta<typeof exampleExtension.renderer> = {
    title: 'Extensions/Example',
    component: exampleExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
    args: {
        example: 'This is an example extension',
    },
};
