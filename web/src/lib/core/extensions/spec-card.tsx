import { z } from 'zod';
import { Extension } from '../types/extensions';
import { SpecCard } from './shared';

const specCardSchema = z.object({
    title: z.string().describe('The main title for the specifications'),
    category: z.string().optional().describe('Optional category/group name'),
    image: z.string().optional().describe('Optional image URL for the product'),
    imageAlt: z.string().optional().describe('Alt text for the image'),
    specs: z
        .array(
            z.object({
                label: z.string().describe('The specification name'),
                value: z.string().describe('The specification value'),
                unit: z.string().optional().describe('The unit of measurement'),
                icon: z
                    .enum([
                        'smartphone',
                        'monitor',
                        'cpu',
                        'camera',
                        'battery',
                        'zap',
                        'weight',
                        'ruler',
                        'palette',
                        'volume',
                        'wifi',
                        'bluetooth',
                        'usb',
                        'settings',
                        'star',
                        'trending-up',
                        'hard-drive',
                        'database',
                        'eye',
                        'maximize',
                        'headphones',
                        'mic',
                        'signal',
                        'radio',
                        'gauge',
                        'activity',
                        'package',
                        'layers',
                        'power',
                        'plug',
                        'archive',
                        'folder',
                        'shield',
                        'lock',
                        'gamepad',
                        'trophy',
                        'car',
                        'fuel',
                        'clock',
                        'calendar',
                        'map-pin',
                        'thermometer',
                        'wind',
                        'sun',
                    ])
                    .describe('Icon to display for this spec'),
                highlight: z.boolean().optional().describe('Whether to highlight this spec'),
            }),
        )
        .describe('Array of specifications to display'),
});

const specCardRenderer = ({
    title,
    category,
    image = 'https://placehold.co/600x400',
    imageAlt,
    specs,
}: Partial<z.infer<typeof specCardSchema>>) => {
    return <SpecCard title={title} category={category} image={image} imageAlt={imageAlt} specs={specs} />;
};

export const specCardExtension = {
    name: 'spec-card',
    prompt: 'use when displaying specifications, product details, or feature comparisons. ideal for phones, laptops, cars, houses, countries, etc. or any product with measurable attributes that benefit from visual icons and organized display.',
    schema: specCardSchema,
    renderer: specCardRenderer,
} satisfies Extension<z.infer<typeof specCardSchema>>;
