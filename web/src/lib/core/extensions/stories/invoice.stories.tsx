import type { Meta, StoryObj } from '@storybook/react';
import { invoiceExtension } from '../invoice';

const meta: Meta<typeof invoiceExtension.renderer> = {
    title: 'Extensions/Invoice',
    component: invoiceExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Invoice: Story = {
    args: {
        title: 'Invoice',
        invoiceNumber: 'INV-001',
        date: '2024-01-15',
        dueDate: '2024-02-15',
        from: {
            name: 'Your Company',
            address: '123 Business St\nCity, State 12345',
            email: 'billing@yourcompany.com',
            phone: '(555) 123-4567',
        },
        to: {
            name: 'Client Company',
            address: '456 Client Ave\nCity, State 67890',
            email: 'billing@clientcompany.com',
            phone: '(555) 987-6543',
        },
        items: [
            {
                description: 'Web Development Services',
                quantity: 40,
                rate: 75.0,
                amount: 3000.0,
            },
            {
                description: 'UI/UX Design',
                quantity: 20,
                rate: 100.0,
                amount: 2000.0,
            },
        ],
        subtotal: 5000.0,
        taxRate: 8.5,
        taxAmount: 425.0,
        discount: 0,
        total: 5425.0,
        notes: 'Payment due within 30 days. Thank you for your business!',
    },
};
