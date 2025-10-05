import type { Meta, StoryObj } from '@storybook/react';
import { statsExtension } from '../stats';

const meta: Meta<typeof statsExtension.renderer> = {
    title: 'Extensions/Stats',
    component: statsExtension.renderer,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GridLayout: Story = {
    args: {
        title: 'Dashboard Metrics',
        layout: 'grid',
        stats: [
            {
                label: 'Total Users',
                value: '12,543',
                unit: '',
                description: 'Active users this month',
                trend: {
                    direction: 'up',
                    value: '+12%',
                    period: 'vs last month',
                },
                color: 'primary',
                icon: 'users',
            },
            {
                label: 'Revenue',
                value: '$45,231',
                unit: '',
                description: 'Monthly recurring revenue',
                trend: {
                    direction: 'up',
                    value: '+8%',
                    period: 'vs last month',
                },
                color: 'success',
                icon: 'dollar-sign',
            },
            {
                label: 'Conversion Rate',
                value: '3.2',
                unit: '%',
                description: 'Overall conversion rate',
                trend: {
                    direction: 'down',
                    value: '-2%',
                    period: 'vs last month',
                },
                color: 'warning',
                icon: 'percent',
            },
            {
                label: 'Page Views',
                value: '2.1M',
                unit: '',
                description: 'Total page views',
                trend: {
                    direction: 'up',
                    value: '+15%',
                    period: 'vs last month',
                },
                color: 'info',
                icon: 'eye',
            },
        ],
    },
};

export const HorizontalLayout: Story = {
    args: {
        title: 'Performance Overview',
        layout: 'horizontal',
        stats: [
            {
                label: 'CPU Usage',
                value: '67',
                unit: '%',
                description: 'Average CPU utilization',
                trend: {
                    direction: 'neutral',
                    value: '0%',
                    period: 'vs last hour',
                },
                color: 'info',
                icon: 'cpu',
            },
            {
                label: 'Memory Usage',
                value: '4.2',
                unit: 'GB',
                description: 'RAM consumption',
                trend: {
                    direction: 'up',
                    value: '+5%',
                    period: 'vs last hour',
                },
                color: 'warning',
                icon: 'database',
            },
            {
                label: 'Disk Space',
                value: '78',
                unit: '%',
                description: 'Storage utilization',
                trend: {
                    direction: 'up',
                    value: '+2%',
                    period: 'vs last week',
                },
                color: 'danger',
                icon: 'database',
            },
        ],
    },
};

export const VerticalLayout: Story = {
    args: {
        title: 'Team Performance',
        layout: 'vertical',
        stats: [
            {
                label: 'Tasks Completed',
                value: '127',
                unit: '',
                description: 'Tasks completed this sprint',
                trend: {
                    direction: 'up',
                    value: '+23%',
                    period: 'vs last sprint',
                },
                color: 'success',
                icon: 'check-circle',
            },
            {
                label: 'Code Reviews',
                value: '89',
                unit: '',
                description: 'Pull requests reviewed',
                trend: {
                    direction: 'up',
                    value: '+15%',
                    period: 'vs last sprint',
                },
                color: 'primary',
                icon: 'eye',
            },
            {
                label: 'Bug Reports',
                value: '12',
                unit: '',
                description: 'Issues reported this week',
                trend: {
                    direction: 'down',
                    value: '-30%',
                    period: 'vs last week',
                },
                color: 'danger',
                icon: 'alert-circle',
            },
        ],
    },
};

export const HighlightLayout: Story = {
    args: {
        title: 'Key Metrics',
        layout: 'highlight',
        stats: [
            {
                label: 'Customer Satisfaction',
                value: '4.8',
                unit: '/5',
                description: 'Average customer rating',
                trend: {
                    direction: 'up',
                    value: '+0.2',
                    period: 'vs last quarter',
                },
                color: 'success',
                icon: 'star',
                highlight: true,
            },
            {
                label: 'Response Time',
                value: '1.2',
                unit: 's',
                description: 'Average API response time',
                trend: {
                    direction: 'down',
                    value: '-0.3s',
                    period: 'vs last month',
                },
                color: 'info',
                icon: 'clock',
                highlight: true,
            },
            {
                label: 'Uptime',
                value: '99.9',
                unit: '%',
                description: 'Service availability',
                trend: {
                    direction: 'neutral',
                    value: '0%',
                    period: 'vs last month',
                },
                color: 'success',
                icon: 'shield',
                highlight: true,
            },
        ],
    },
};

export const ComparisonLayout: Story = {
    args: {
        title: 'Regional Performance',
        layout: 'comparison',
        stats: [
            {
                label: 'North America',
                value: '45,231',
                unit: '',
                description: 'Monthly active users',
                trend: {
                    direction: 'up',
                    value: '+12%',
                    period: 'vs last month',
                },
                color: 'primary',
                icon: 'globe',
            },
            {
                label: 'Europe',
                value: '32,156',
                unit: '',
                description: 'Monthly active users',
                trend: {
                    direction: 'up',
                    value: '+8%',
                    period: 'vs last month',
                },
                color: 'info',
                icon: 'globe',
            },
            {
                label: 'Asia Pacific',
                value: '28,943',
                unit: '',
                description: 'Monthly active users',
                trend: {
                    direction: 'up',
                    value: '+18%',
                    period: 'vs last month',
                },
                color: 'success',
                icon: 'globe',
            },
            {
                label: 'Latin America',
                value: '15,678',
                unit: '',
                description: 'Monthly active users',
                trend: {
                    direction: 'up',
                    value: '+25%',
                    period: 'vs last month',
                },
                color: 'warning',
                icon: 'globe',
            },
        ],
    },
};

export const SingleStat: Story = {
    args: {
        title: 'Main KPI',
        layout: 'highlight',
        stats: [
            {
                label: 'Monthly Recurring Revenue',
                value: '$125,430',
                unit: '',
                description: 'Total MRR across all subscriptions',
                trend: {
                    direction: 'up',
                    value: '+15%',
                    period: 'vs last month',
                },
                color: 'success',
                icon: 'dollar-sign',
                highlight: true,
            },
        ],
    },
};

export const NoTrends: Story = {
    args: {
        title: 'Basic Metrics',
        layout: 'grid',
        stats: [
            {
                label: 'Total Projects',
                value: '24',
                unit: '',
                description: 'Active projects in progress',
                color: 'primary',
                icon: 'folder',
            },
            {
                label: 'Team Members',
                value: '12',
                unit: '',
                description: 'Active team members',
                color: 'info',
                icon: 'users',
            },
            {
                label: 'Client Satisfaction',
                value: '4.6',
                unit: '/5',
                description: 'Average client rating',
                color: 'success',
                icon: 'star',
            },
            {
                label: 'Hours Logged',
                value: '1,247',
                unit: '',
                description: 'Total hours this month',
                color: 'neutral',
                icon: 'clock',
            },
        ],
    },
};

export const MixedTypes: Story = {
    args: {
        title: 'Mixed Data Types',
        layout: 'grid',
        stats: [
            {
                label: 'Temperature',
                value: '72',
                unit: '°F',
                description: 'Current room temperature',
                color: 'info',
                icon: 'thermometer',
            },
            {
                label: 'Wind Speed',
                value: '15',
                unit: 'mph',
                description: 'Current wind speed',
                color: 'neutral',
                icon: 'wind',
            },
            {
                label: 'Humidity',
                value: '45',
                unit: '%',
                description: 'Current humidity level',
                color: 'info',
                icon: 'wind',
            },
            {
                label: 'Pressure',
                value: '29.92',
                unit: 'inHg',
                description: 'Barometric pressure',
                color: 'primary',
                icon: 'zap',
            },
        ],
    },
};
