import type { Meta, StoryObj } from '@storybook/react';
import { columnExtension } from '../column';

const meta: Meta<typeof columnExtension.renderer> = {
    title: 'Extensions/Column',
    component: columnExtension.renderer,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoColumns: Story = {
    args: {
        title: 'Project Comparison',
        columns: [
            {
                title: 'Frontend',
                body: 'React with TypeScript\n\n- Component-based architecture\n- State management with Zustand\n- Responsive design with Tailwind CSS\n- Real-time updates with WebSockets',
            },
            {
                title: 'Backend',
                body: [
                    'Node.js with Express',
                    'PostgreSQL database',
                    'RESTful API design',
                    'Authentication with JWT',
                    'File upload handling',
                ],
            },
        ],
    },
};

export const ThreeColumns: Story = {
    args: {
        title: 'Technology Stack',
        columns: [
            {
                title: 'Frontend',
                body: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite'],
            },
            {
                title: 'Backend',
                body: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'],
            },
            {
                title: 'DevOps',
                body: ['Docker', 'GitHub Actions', 'AWS S3', 'CloudFront'],
            },
        ],
    },
};

export const FourColumns: Story = {
    args: {
        title: 'Quarterly Goals',
        columns: [
            {
                title: 'Q1',
                body: 'Foundation and planning phase',
            },
            {
                title: 'Q2',
                body: 'Core feature development',
            },
            {
                title: 'Q3',
                body: 'Testing and optimization',
            },
            {
                title: 'Q4',
                body: 'Launch and scaling',
            },
        ],
    },
};

export const SingleColumn: Story = {
    args: {
        title: 'Important Notes',
        columns: [
            {
                title: 'Key Points',
                body: [
                    'This is a single column layout',
                    'Perfect for highlighting important information',
                    'Supports both text and list formats',
                    'Responsive design adapts to screen size',
                ],
            },
        ],
    },
};

export const MixedContent: Story = {
    args: {
        title: 'Mixed Content Example',
        columns: [
            {
                title: 'Text Content',
                body: 'This column contains **markdown text** with formatting.\n\nIt can include:\n- Multiple paragraphs\n- **Bold** and *italic* text\n- Code snippets like `console.log()`',
            },
            {
                title: 'List Content',
                body: [
                    'First item in the list',
                    'Second item with **markdown** support',
                    'Third item with `code` formatting',
                    'Fourth and final item',
                ],
            },
        ],
    },
};
