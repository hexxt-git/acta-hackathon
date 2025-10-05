import { z } from 'zod';
import { Extension } from '../types/extensions';

const exampleSchema = z.object({
    example: z.string(),
});

const exampleRenderer = ({ example }: Partial<z.infer<typeof exampleSchema>>) => {
    return <div>{example}</div>;
};

export const exampleExtension = {
    type: 'presentation' as const,
    name: 'example',
    prompt: 'use when you ....',
    schema: exampleSchema,
    renderer: exampleRenderer,
} satisfies Extension<z.infer<typeof exampleSchema>>;
