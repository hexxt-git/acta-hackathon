import { responseSchema } from '../prompt';
import { z } from 'zod';

export type Message =
    | {
          id: string;
          content: z.infer<typeof responseSchema>;
          role: 'assistant';
      }
    | {
          id: string;
          content: string;
          role: 'user';
      };
