import type { Meta, StoryObj } from '@storybook/react-vite';
import { emailExtension } from '../email';

const meta: Meta<typeof emailExtension.renderer> = {
    title: 'Extensions/Email',
    component: emailExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Email: Story = {
    args: {
        subject: 'Meeting Follow-up',
        body: "Hi team,\n\nThank you for attending today's meeting. Here are the key points we discussed:\n\n1. Project timeline updates\n2. Budget considerations\n3. Next steps\n\nPlease review the attached documents and let me know if you have any questions.\n\nBest regards,\nJohn Doe",
    },
};
