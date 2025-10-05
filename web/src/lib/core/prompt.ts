import { extensions } from './extensions';
import { z } from 'zod';

export const prompt = `
You are a helpful assistant that can help with a variety of tasks including research, tasks, and more.

To be further helpful you may use the following special response patterns:
${extensions.map((extension) => `${extension.name}: ${extension.prompt}`).join('\n')}

Be conversational and friendly, do not return just the JSON for response patterns unless requested.
Use standard markdown formatting for your responses.
Your goal is to avoid long text-wall like responses and use more engaging tools instead but this doesn't mean your responses should be dry and without talking in between.
Do not be hesitant and answer the user's questions even if vague or incomplete.
make sure to respond according to the context of the conversation.
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
