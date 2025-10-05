import type { Meta, StoryObj } from '@storybook/react-vite';
import { listExtension } from '../list';

const meta: Meta<typeof listExtension.renderer> = {
    title: 'Extensions/List',
    component: listExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleBulletList: Story = {
    args: {
        type: 'simple',
        style: 'bullet',
        items: ['**First item** with markdown', '*Second item* with italic', 'Third item with `code` formatting'],
    } as any,
};

export const SimpleNumberedList: Story = {
    args: {
        type: 'simple',
        style: 'numbered',
        items: ['First item', 'Second item', 'Third item'],
    } as any,
};

export const DetailedList: Story = {
    args: {
        type: 'detailed',
        style: 'numbered',
        items: [
            { title: 'Task 1', description: 'Description for task 1' },
            { title: 'Task 2', description: 'Description for task 2' },
            { title: 'Task 3', description: 'Description for task 3' },
        ],
    } as any,
};
