import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import superjson from 'superjson';

const t = initTRPC.create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        // Log errors to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('TRPC Error:', {
                code: error.code,
                message: error.message,
                cause: error.cause,
                stack: error.stack,
            });
        }

        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

// Middleware for logging requests
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
    const start = Date.now();

    if (process.env.NODE_ENV === 'development') {
        console.log(`TRPC Request: ${type.toUpperCase()} ${path}`);
    }

    const result = await next();

    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
        if (result.ok) {
            console.log(`TRPC Success: ${path} (${duration}ms)`);
        } else {
            console.error(`TRPC Error: ${path} (${duration}ms)`, result.error);
        }
    }

    return result;
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(loggerMiddleware);
