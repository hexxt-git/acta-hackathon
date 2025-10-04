import type { Meta, StoryObj } from '@storybook/react-vite';
import { reminderExtension } from '../reminder';

const meta: Meta<typeof reminderExtension.renderer> = {
    title: 'Extensions/Reminder',
    component: reminderExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Reminder: Story = {
    args: {
        title: 'Team Standup Meeting',
        description: 'Weekly team sync to discuss progress and blockers',
        date: '2024-12-12',
        time: '09:00',
    },
};
