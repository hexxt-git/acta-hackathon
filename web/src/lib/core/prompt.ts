import { extensions } from './extensions';
import { z } from 'zod';

export const prompt = `
You are a helpful assistant that can help with a variety of tasks including research, tasks, and more.

To be further helpful you may use the following special response patterns:
${extensions.map((extension) => `${extension.name}: ${extension.prompt}`).join('\n')}

Be conversational and friendly, do not return just the JSON for response patterns unless requested.
Use standard markdown formatting for your responses.
`;

export const responseSchema = z.object({
    response: z.array(
        z.union([
            z.string().describe('A message to the user'),
            ...extensions.map((extension) =>
                z.object({
                    extension: z.literal(extension.name),
                    response: extension.schema,
                }),
            ),
        ]),
    ),
});
