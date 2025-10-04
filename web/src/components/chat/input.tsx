import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupTextarea,
} from '@/components/ui/input-group';
import { PaperclipIcon, XIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useStore } from '@tanstack/react-store';
import { widthStore } from '@/stores/width';

export function ChatInput({ onSubmit }: { onSubmit: (message: string, files: File[]) => void }) {
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const width = useStore(widthStore);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    const submitMessage = () => {
        if (message.trim() === '') return;
        onSubmit(message, files);
        setMessage('');
        setFiles([]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitMessage();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        setCursorPosition(e.target.selectionStart);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            submitMessage();
        }
    };

    useEffect(() => {
        if (message.length >= 20 && textareaRef.current && cursorPosition !== null) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
        }
    }, [message.length >= 20, cursorPosition]);

    return (
        <motion.form
            onSubmit={handleSubmit}
            layout
            transition={{ duration: 0.2, ease: 'easeOut', delay: width === 'full' ? 0.07 : 0 }}
        >
            <InputGroup>
                {message.length < 20 ? (
                    <InputGroupInput
                        ref={inputRef}
                        placeholder="Ask me anything"
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <InputGroupTextarea
                        ref={textareaRef}
                        placeholder="Ask me anything"
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                )}
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
                        type="button"
                        onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
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
                    <InputGroupButton type="submit">Ask</InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </motion.form>
    );
}
