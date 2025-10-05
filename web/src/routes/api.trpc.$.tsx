import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { trpcRouter } from '@/integrations/trpc/router';
import { createFileRoute } from '@tanstack/react-router';

async function handler({ request }: { request: Request }) {
    try {
        const response = await fetchRequestHandler({
            req: request,
            router: trpcRouter,
            endpoint: '/api/trpc',
        });

        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`TRPC Response: ${request.method} ${request.url} - ${response.status}`);
        }

        return response;
    } catch (error) {
        // Log errors in the API handler
        console.error('TRPC API Handler Error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            url: request.url,
            method: request.method,
        });

        // Return a proper error response
        return new Response(
            JSON.stringify({
                error: {
                    message: 'Internal server error',
                    code: 'INTERNAL_SERVER_ERROR',
                },
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
}

export const Route = createFileRoute('/api/trpc/$')({
    server: {
        handlers: {
            GET: handler,
            POST: handler,
        },
    },
});
