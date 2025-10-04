import { z } from 'zod';

export async function validateRequestBody<T extends z.ZodSchema>(
    request: Request,
    schema: T,
): Promise<{ data: z.infer<T> } | { error: string; status: number }> {
    try {
        const body = await request.json();
        const validated = schema.parse(body);
        return { data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                error: error.message,
                status: 400,
            };
        }
        return {
            error: 'Invalid JSON',
            status: 400,
        };
    }
}
