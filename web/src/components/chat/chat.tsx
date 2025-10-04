import { ChatBody } from './body';
import { ChatInput } from './input';

export function Chat() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-2 max-md:grow-1">
            <ChatBody />
            <ChatInput />
        </div>
    );
}
