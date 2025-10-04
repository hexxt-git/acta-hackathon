import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { PaperclipIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export function ChatInput() {
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    return (
        <InputGroup>
            <InputGroupInput
                placeholder="Ask me anything"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <InputGroupAddon align="inline-end" className="gap-1">
                {files.map((file) => (
                    <InputGroupButton
                        key={file.name}
                        onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
                    >
                        <span className="max-w-20 truncate">{file.name}</span>
                        <XIcon />
                    </InputGroupButton>
                ))}
                <InputGroupButton
                    onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = (e) => {
                            const newFiles = (e.target as HTMLInputElement).files;
                            if (newFiles) {
                                setFiles((prevFiles) => [...prevFiles, ...Array.from(newFiles)]);
                            }
                            // Clean up the input element
                            input.remove();
                        };
                        input.click();
                    }}
                >
                    <PaperclipIcon />
                </InputGroupButton>
                <InputGroupButton
                    onClick={() => {
                        console.log(message);
                        setMessage('');
                    }}
                >
                    Ask
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}
