import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';

export function ChatInput() {
    return (
        <InputGroup>
            <InputGroupInput placeholder="Ask me anything" />
            <InputGroupAddon align="inline-end">
                <InputGroupButton>Ask</InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}
