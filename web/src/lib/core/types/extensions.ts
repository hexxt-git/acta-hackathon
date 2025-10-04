import React from 'react';
import { z } from 'zod';

type InteractFunction = (interaction: string, props: unknown[]) => void;

export interface Extension<T> {
    name: string;
    prompt: string;
    schema: z.ZodSchema<T>;
    renderer: React.FC<Partial<T>> | React.FC<Partial<T> & { onInteract: InteractFunction }>;
}
