import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import oneDark from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark';
import oneLight from 'react-syntax-highlighter/dist/cjs/styles/prism/one-light';

interface MarkdownProps {
    content: string;
    className?: string;
}

// Custom code component for syntax highlighting
function CodeBlock({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const { theme } = useTheme();

    return !inline && match ? (
        <SyntaxHighlighter
            style={theme === 'dark' ? oneDark : oneLight}
            language={match[1]}
            PreTag="div"
            className="rounded-md p-1.5! text-sm"
            {...props}
            customStyle={{ padding: 0, margin: 0 }}
        >
            {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
    ) : (
        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm" {...props}>
            {children}
        </code>
    );
}

export function Markdown({ content, className = '' }: MarkdownProps) {
    return (
        <div className={cn('prose-custom', className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code: CodeBlock,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
