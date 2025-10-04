import { widthStore } from '@/stores/width';
import { Button } from './button';
import { Maximize, Minimize } from 'lucide-react';
import { useStore } from '@tanstack/react-store';
import { cn } from '@/lib/utils';

export function WidthToggle() {
    const width = useStore(widthStore);

    return (
        <Button
            variant="ghost"
            className="max-md:hidden"
            size="sm"
            onClick={() => widthStore.setState(width === 'full' ? 'narrow' : 'full')}
        >
            <Maximize
                className={cn(
                    'h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all',
                    width === 'full' && 'scale-0 -rotate-90',
                )}
            />
            <Minimize
                className={cn(
                    'absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all',
                    width === 'full' && 'scale-100 rotate-0',
                )}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
