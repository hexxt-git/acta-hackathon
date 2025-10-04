import { Markdown } from '@/components/ui/markdown';
import { useStore } from '@tanstack/react-store';
import { widthStore } from '@/stores/width';
import { cn } from '@/lib/utils';

export function ChatBody() {
    const width = useStore(widthStore);
    return (
        <div
            className={cn(
                'bg-card flex h-full max-h-[calc(100vh-7rem)] flex-col gap-2 overflow-y-scroll rounded-md p-2 max-md:grow-1',
                width === 'narrow' && 'md:h-120',
            )}
        >
            <div className="bg-primary text-primary-foreground w-fit self-end rounded-md px-2 py-1 text-sm">
                Hello Can you help me with my project?
            </div>
            <div className="bg-background w-full max-w-[90%] rounded-md p-2 dark:bg-transparent">
                <Markdown
                    content={`# Welcome to the AI Assistant

Hello! I'm here to help you with your project. Here's what I can do:

## Features

- **Code Analysis**: I can help you understand and improve your code
- **Bug Fixing**: I'll identify and suggest fixes for issues
- **Documentation**: I can help write clear documentation
- **Best Practices**: I'll suggest modern development practices

## Code Example

Here's a simple React component:

\`\`\`tsx
import React from 'react';

interface Props {
    title: string;
    children: React.ReactNode;
}

export function Card({ title, children }: Props) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <div>{children}</div>
        </div>
    );
}
\`\`\`

## Current Status

- ✅ Project setup complete
- ✅ Components organized
- 🔄 Adding more features
- ⏳ Testing and optimization

## Project Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.0.0 | UI Framework |
| TanStack Router | 1.132.0 | Routing |
| Tailwind CSS | 4.0.6 | Styling |
| TypeScript | 5.7.2 | Type Safety |
| Vite | 7.1.7 | Build Tool |

## API Endpoints

### Authentication

\`\`\`typescript
// POST /api/auth/login
interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: User;
}
\`\`\`

### Messages

\`\`\`python
# GET /api/messages
def get_messages(user_id: str, limit: int = 50):
    """Retrieve user messages with pagination"""
    return Message.objects.filter(user_id=user_id)[:limit]
\`\`\`

## Quick Links

- [Documentation](https://example.com/docs)
- [GitHub Repository](https://github.com/example/repo)
- [API Reference](https://api.example.com)

> **Note**: This is a preview of all supported markdown features including tables, syntax highlighting, and GitHub Flavored Markdown.

---

How can I help you today?`}
                />
            </div>
        </div>
    );
}
