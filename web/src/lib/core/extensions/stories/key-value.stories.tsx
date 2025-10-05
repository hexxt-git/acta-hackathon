import type { Meta, StoryObj } from '@storybook/react';
import { keyValueExtension } from '../key-value';

const meta: Meta = {
    title: 'Extensions/KeyValue',
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const ProductSpecifications: Story = {
    render: (args) => keyValueExtension.renderer(args),
    args: {
        title: 'Product Specifications',
        groups: [
            {
                group: 'Basic Info',
                properties: [
                    {
                        key: 'Name',
                        value: 'Premium Wireless Headphones',
                        highlight: {
                            label: 'Bestseller',
                            color: 'success',
                        },
                    },
                    {
                        key: 'Brand',
                        value: 'AudioTech Pro',
                    },
                    {
                        key: 'Model',
                        value: 'AT-5000',
                    },
                ],
            },
            {
                group: 'Technical Details',
                properties: [
                    {
                        key: 'Battery Life',
                        value: '30 hours',
                        description: 'Continuous playback time',
                    },
                    {
                        key: 'Charging Time',
                        value: '2 hours',
                    },
                    {
                        key: 'Connectivity',
                        value: 'Bluetooth 5.0',
                        highlight: {
                            label: 'Latest',
                            color: 'info',
                        },
                    },
                    {
                        key: 'Weight',
                        value: '250g',
                    },
                ],
            },
        ],
    },
};

export const UserProfile: Story = {
    render: (args) => keyValueExtension.renderer(args),
    args: {
        title: 'User Profile',
        groups: [
            {
                properties: [
                    {
                        key: 'Full Name',
                        value: 'Sarah Johnson',
                        highlight: {
                            label: 'Premium User',
                            color: 'primary',
                        },
                    },
                    {
                        key: 'Email',
                        value: 'sarah.johnson@example.com',
                    },
                    {
                        key: 'Phone',
                        value: '+1 (555) 123-4567',
                    },
                    {
                        key: 'Location',
                        value: 'San Francisco, CA',
                        highlight: {
                            label: 'HQ',
                            color: 'secondary',
                        },
                    },
                    {
                        key: 'Member Since',
                        value: 'January 2023',
                    },
                ],
            },
        ],
    },
};

export const ApplicationSettings: Story = {
    render: (args) => keyValueExtension.renderer(args),
    args: {
        title: 'Application Settings',
        groups: [
            {
                group: 'Display',
                properties: [
                    {
                        key: 'Theme',
                        value: 'Dark Mode',
                    },
                    {
                        key: 'Language',
                        value: 'English (US)',
                    },
                    {
                        key: 'Font Size',
                        value: 'Medium',
                    },
                ],
            },
            {
                group: 'Notifications',
                properties: [
                    {
                        key: 'Email Notifications',
                        value: 'Enabled',
                        highlight: {
                            label: 'Important',
                            color: 'warning',
                        },
                    },
                    {
                        key: 'Push Notifications',
                        value: 'Disabled',
                    },
                    {
                        key: 'Weekly Digest',
                        value: 'Every Monday',
                    },
                ],
            },
        ],
    },
};

export const SystemStatus: Story = {
    render: (args) => keyValueExtension.renderer(args),
    args: {
        groups: [
            {
                properties: [
                    {
                        key: 'Status',
                        value: 'Active',
                        highlight: {
                            label: 'Live',
                            color: 'success',
                        },
                    },
                    {
                        key: 'Last Updated',
                        value: '2 minutes ago',
                    },
                    {
                        key: 'Version',
                        value: '2.1.4',
                        highlight: {
                            label: 'Latest',
                            color: 'info',
                        },
                    },
                    {
                        key: 'Uptime',
                        value: '99.9%',
                        highlight: {
                            label: 'Excellent',
                            color: 'success',
                        },
                    },
                ],
            },
        ],
    },
};

export const ColorShowcase: Story = {
    render: (args) => keyValueExtension.renderer(args),
    args: {
        title: 'Highlight Color Examples',
        groups: [
            {
                properties: [
                    {
                        key: 'Primary Highlight',
                        value: 'Default blue theme',
                        highlight: {
                            label: 'Primary',
                            color: 'primary',
                        },
                    },
                    {
                        key: 'Secondary Highlight',
                        value: 'Muted gray theme',
                        highlight: {
                            label: 'Secondary',
                            color: 'secondary',
                        },
                    },
                    {
                        key: 'Success Highlight',
                        value: 'Green theme for positive',
                        highlight: {
                            label: 'Success',
                            color: 'success',
                        },
                    },
                    {
                        key: 'Warning Highlight',
                        value: 'Yellow theme for caution',
                        highlight: {
                            label: 'Warning',
                            color: 'warning',
                        },
                    },
                    {
                        key: 'Danger Highlight',
                        value: 'Red theme for errors',
                        highlight: {
                            label: 'Danger',
                            color: 'danger',
                        },
                    },
                    {
                        key: 'Info Highlight',
                        value: 'Blue theme for information',
                        highlight: {
                            label: 'Info',
                            color: 'info',
                        },
                    },
                ],
            },
        ],
    },
};
