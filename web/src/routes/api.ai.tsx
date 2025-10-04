import { createFileRoute } from '@tanstack/react-router';
import { validateRequestBody } from '../lib/api';
import z from 'zod';

const inputSchema = z.object({
    name: z.string(),
});

async function handler({ request }: { request: Request }) {
    const result = await validateRequestBody(request, inputSchema);

    if ('error' in result) {
        return new Response(JSON.stringify({ error: result.error }), { status: result.status });
    }

    return new Response(JSON.stringify({ message: `Hello, ${result.data.name}!` }));
}

export const Route = createFileRoute('/api/ai')({
    server: {
        handlers: {
            POST: handler,
        },
    },
});
