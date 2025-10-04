import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card"
            className={cn('bg-background text-card-foreground space-y-4 rounded-lg p-4 shadow-xs', className)}
            {...props}
        />
    );
}

export { Card };
