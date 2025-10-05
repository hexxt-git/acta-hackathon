import { z } from 'zod';
import { Extension } from '../types/extensions';
import { SpecCard, singleSpecCardSchema } from './shared';

// Multi spec card schema - array of spec cards
const multiSpecCardSchema = z.object({
    cards: z.array(singleSpecCardSchema).min(1).describe('Array of specification cards to display horizontally'),
    title: z.string().optional().describe('Optional title for the entire comparison'),
});

// Single card renderer (reused from spec-card.tsx with minor adjustments)
const singleCardRenderer = ({ title, category, image, imageAlt, specs }: z.infer<typeof singleSpecCardSchema>) => {
    return <SpecCard title={title} category={category} image={image} imageAlt={imageAlt} specs={specs} />;
};

// Multi card renderer
const multiSpecCardRenderer = ({ cards, title }: Partial<z.infer<typeof multiSpecCardSchema>>) => {
    if (!cards || cards.length === 0) {
        return (
            <div className="border-muted-foreground/25 rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground text-sm">No cards to display</p>
            </div>
        );
    }

    return (
        <div className="w-full mask-r-from-95% mask-alpha pe-8">
            {/* Optional title */}
            {title && <h2 className="text-foreground mb-4 text-xl font-bold">{title}</h2>}

            {/* Horizontal layout for multiple cards */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {cards.map((card, index) => (
                    <div key={index} className="flex-shrink-0">
                        {singleCardRenderer(card)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const multiSpecCardExtension = {
    type: 'presentation' as const,
    name: 'multi-spec-card',
    prompt: 'use when displaying multiple product specifications for comparison. ideal for comparing phones, laptops, cars, or any products side-by-side with their specifications, images, and feature highlights.',
    schema: multiSpecCardSchema,
    renderer: multiSpecCardRenderer,
} satisfies Extension<z.infer<typeof multiSpecCardSchema>>;
