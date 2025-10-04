import type { Meta, StoryObj } from '@storybook/react-vite';
import { draftExtension } from '../draft';

const meta: Meta<typeof draftExtension.renderer> = {
    title: 'Extensions/Draft',
    component: draftExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Draft: Story = {
    args: {
        title: 'Getting Started with React',
        body: `# Getting Started with React

React is a popular JavaScript library for building user interfaces. In this post, we'll explore the fundamentals of React and how to get started with your first application.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".

## Key Concepts

### Components
Components are the building blocks of any React application. They are like JavaScript functions that accept inputs (called "props") and return React elements describing what should appear on the screen.

### JSX
JSX is a syntax extension for JavaScript that looks similar to HTML. It's not required for React, but it makes the code more readable and easier to write.

### State
State is a way to store and manage data that can change over time in your component.

## Getting Started

To create a new React application, you can use Create React App:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

This will set up a new React project with all the necessary dependencies and configuration.

Happy coding! 🚀`,
    },
};
