import type { Meta, StoryObj } from '@storybook/react-vite';
import { todoExtension } from '../todo';

const meta: Meta<typeof todoExtension.renderer> = {
    title: 'Extensions/Todo',
    component: todoExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Todo: Story = {
    args: {
        name: 'Weekly Grocery List',
        items: [
            'Milk (2 gallons)',
            'Bread (whole wheat)',
            'Eggs (dozen)',
            'Apples (6)',
            'Chicken breast (1 lb)',
            'Rice (5 lb bag)',
            'Tomatoes (4)',
            'Onions (3)',
            'Garlic (1 bulb)',
            'Pasta sauce',
        ],
    },
};
