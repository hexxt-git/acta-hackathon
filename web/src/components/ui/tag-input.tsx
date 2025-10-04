import * as React from 'react';
import { useId, useState } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface TagItem {
    id: string;
    text: string;
}

export interface TagInputProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    tags?: TagItem[];
    onChange?: (tags: TagItem[]) => void;
    placeholder?: string;
    maxTags?: number;
    allowDuplicates?: boolean;
    disabled?: boolean;
}

const TagInputComponent = React.forwardRef<HTMLDivElement, TagInputProps>(
    (
        {
            className,
            tags = [],
            onChange,
            placeholder = 'Add a tag',
            maxTags,
            allowDuplicates = false,
            disabled = false,
            ...props
        },
        ref,
    ) => {
        const id = useId();
        const [currentTags, setCurrentTags] = useState<TagItem[]>(tags);
        const [inputValue, setInputValue] = useState('');
        const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
        const inputRef = React.useRef<HTMLInputElement>(null);

        React.useEffect(() => {
            setCurrentTags(tags);
        }, [tags]);

        const handleTagsChange = (newTags: TagItem[]) => {
            setCurrentTags(newTags);
            onChange?.(newTags);
        };

        const addTag = (text: string) => {
            if (!text.trim()) return;
            if (maxTags && currentTags.length >= maxTags) return;

            const tagExists = currentTags.some((tag) => tag.text.toLowerCase() === text.toLowerCase());

            if (!allowDuplicates && tagExists) return;

            const newTag = { id: crypto.randomUUID(), text: text.trim() };
            handleTagsChange([...currentTags, newTag]);
            setInputValue('');
        };

        const removeTag = (id: string) => {
            handleTagsChange(currentTags.filter((tag) => tag.id !== id));
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && inputValue) {
                e.preventDefault();
                addTag(inputValue);
            } else if (e.key === 'Backspace' && !inputValue && currentTags.length > 0) {
                if (activeTagIndex !== null) {
                    removeTag(currentTags[activeTagIndex].id);
                    setActiveTagIndex(null);
                } else {
                    setActiveTagIndex(currentTags.length - 1);
                }
            } else if (e.key === 'Escape' && activeTagIndex !== null) {
                setActiveTagIndex(null);
            }
        };

        const containerClasses = cn(
            'border border-input rounded-md dark:bg-input/30 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 flex flex-wrap',
            className,
        );

        const renderTags = () => {
            return currentTags.map((tag, index) => (
                <div
                    key={tag.id}
                    className={cn(
                        'bg-background border-input dark:bg-input/30 hover:bg-background relative flex h-7 items-center rounded-md border ps-2 pe-7 text-xs font-medium',
                        activeTagIndex === index && 'ring-ring ring-2',
                    )}
                >
                    {tag.text}
                    <button
                        type="button"
                        className="focus-visible:border-ring focus-visible:ring-ring/50 text-muted-foreground/80 hover:text-foreground absolute end-1 top-1/2 flex size-4 -translate-y-1/2 rounded-s-sm rounded-e-sm p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                        onClick={() => removeTag(tag.id)}
                        disabled={disabled}
                    >
                        <X className="size-full" />
                        <span className="sr-only">Remove {tag.text}</span>
                    </button>
                </div>
            ));
        };

        return (
            <div ref={ref} className={containerClasses} {...props}>
                {renderTags()}
                <input
                    ref={inputRef}
                    id={id}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                        if (inputValue) {
                            addTag(inputValue);
                        }
                        setActiveTagIndex(null);
                    }}
                    className={cn('h-7 min-w-[80px] flex-1 bg-transparent px-2 text-sm shadow-none outline-none')}
                    placeholder={placeholder}
                    disabled={disabled || (maxTags !== undefined && currentTags.length >= maxTags)}
                />
            </div>
        );
    },
);

TagInputComponent.displayName = 'TagInput';

export { TagInputComponent as TagInput };
