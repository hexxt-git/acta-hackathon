import { Extension } from '../types/extensions';
import { z } from 'zod';

const optionsSchema = z.object({
    options: z.array(z.string().max(150)).max(10),
});

const optionsRenderer = ({
    options,
    onInteract,
}: Partial<z.infer<typeof optionsSchema>> & {
    onInteract: (interaction: string, props: unknown[]) => void;
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {options?.map((option) => (
                <button
                    key={option}
                    className="bg-background dark:bg-input/30 dark:border-border hover:bg-background/80 cursor-pointer rounded-md border border-transparent px-2 py-1 text-start text-sm/[1.2] transition-colors"
                    onClick={() => onInteract('select', [option])}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export const optionsExtension = {
    name: 'options',
    prompt: "use when you want to give the user a list of options to choose from. use this when you are giving the user a choice. or are in a situation where you can't continue without the user's choice. make sure to include a text paragraph above the options to explain the options and why you are giving them to the user.",
    schema: optionsSchema,
    renderer: optionsRenderer,
} satisfies Extension<z.infer<typeof optionsSchema>>;
