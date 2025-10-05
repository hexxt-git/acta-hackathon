import type { Meta, StoryObj } from '@storybook/react-vite';
import { codeExtension } from '../code';

const meta: Meta<typeof codeExtension.renderer> = {
    title: 'Extensions/Code',
    component: codeExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const JavaScriptCode: Story = {
    args: {
        filename: 'example.js',
        language: 'javascript',
        code: `function greetUser(name) {
    console.log(\`Hello, \${name}!\`);
    return \`Welcome to our application, \${name}!\`;
}

// Usage
const user = "Alice";
const message = greetUser(user);
console.log(message);`,
    },
};
