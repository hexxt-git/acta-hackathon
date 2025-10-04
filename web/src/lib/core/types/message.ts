import { responseSchema } from '../prompt';
import { z } from 'zod';

export type Message =
    | {
          content: z.infer<typeof responseSchema>;
          role: 'assistant';
      }
    | {
          content: string;
          role: 'user';
      };
