import type { Meta, StoryObj } from '@storybook/react';
import { formExtension } from '../form';

const meta: Meta<typeof formExtension.renderer> = {
    title: 'Extensions/Form',
    component: formExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {
    args: {
        title: 'Contact Form',
        description: 'Please fill out this form to get in touch with us.',
        fields: [
            {
                id: '1',
                type: 'text',
                label: 'Full Name',
                placeholder: 'Enter your full name',
                required: true,
            },
            {
                id: '2',
                type: 'email',
                label: 'Email Address',
                placeholder: 'Enter your email',
                required: true,
            },
            {
                id: '3',
                type: 'select',
                label: 'How did you hear about us?',
                placeholder: 'Select an option',
                required: true,
                options: ['Social Media', 'Search Engine', 'Friend/Family', 'Advertisement', 'Other'],
            },
            {
                id: '4',
                type: 'textarea',
                label: 'Message',
                placeholder: 'Tell us about your inquiry...',
                required: true,
            },
        ],
        settings: {
            allowMultipleSubmissions: true,
            showProgress: true,
            theme: 'default',
        },
    },
};
