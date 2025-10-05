import type { Meta, StoryObj } from '@storybook/react-vite';
import { optionsExtension } from '../options';

const meta: Meta<typeof optionsExtension.renderer> = {
    title: 'Extensions/Options',
    component: optionsExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Options: Story = {
    args: {
        options: ['Option 1', 'Option 2', 'Option 3'],
        onInteract: (interaction, props) => console.log(interaction, props),
    },
};
