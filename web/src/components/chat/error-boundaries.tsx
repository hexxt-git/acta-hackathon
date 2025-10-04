import React from 'react';
import { Button } from '../ui/button';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}

class BaseErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by error boundary:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
            }

            return (
                <div className="border-destructive/20 bg-destructive/5 rounded-md border p-4">
                    <p className="text-destructive text-sm">
                        Something went wrong.{' '}
                        <button onClick={this.resetError} className="text-primary underline-offset-2 hover:underline">
                            Try again
                        </button>
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export function ChatBodyErrorBoundary({ children }: { children: React.ReactNode }) {
    return (
        <BaseErrorBoundary
            fallback={({ error, resetError }) => (
                <div className="flex h-full items-center justify-center p-4">
                    <div className="space-y-3 text-center">
                        <h3 className="text-destructive text-sm font-medium">Chat Error</h3>
                        <p className="text-muted-foreground max-w-md text-xs">
                            Something went wrong while loading the chat. This might be due to corrupted data or a
                            rendering issue.
                        </p>
                        {error && (
                            <details className="text-muted-foreground text-left text-xs">
                                <summary className="hover:text-foreground cursor-pointer">Technical details</summary>
                                <pre className="bg-muted mt-2 max-h-32 overflow-auto rounded p-2 text-xs whitespace-pre-wrap">
                                    {error.message}
                                </pre>
                            </details>
                        )}
                        <div className="flex justify-center gap-2">
                            <Button variant="outline" onClick={resetError} size="sm">
                                New Chat
                            </Button>
                            <Button onClick={resetError} size="sm">
                                Reload Chat
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        >
            {children}
        </BaseErrorBoundary>
    );
}
