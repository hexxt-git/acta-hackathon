import { widthStore } from '@/stores/width';
import { ChatBody } from './body';
import { ChatInput } from './input';
import { useStore } from '@tanstack/react-store';
import { cn } from '@/lib/utils';

export function Chat() {
    const width = useStore(widthStore);
    return (
        <div
            className={cn('flex w-full flex-col gap-2 max-md:grow-1', width === 'narrow' ? 'md:max-w-xl' : 'max-w-6xl')}
        >
            <ChatBody />
            <ChatInput />
        </div>
    );
}
