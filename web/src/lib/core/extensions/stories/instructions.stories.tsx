import type { Meta, StoryObj } from '@storybook/react';
import { instructionsExtension } from '../instructions';

const meta: Meta<typeof instructionsExtension.renderer> = {
    title: 'Extensions/Instructions',
    component: instructionsExtension.renderer,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Instructions: Story = {
    args: {
        name: 'Recipe Instructions',
        instructions: [
            {
                text: 'Preheat oven to 375°F (190°C)',
                duration: '10 minutes',
            },
            {
                text: 'Mix flour, baking soda, and salt in a bowl',
                duration: '5 minutes',
            },
            {
                text: 'Cream butter and sugars until fluffy',
                duration: '3 minutes',
            },
            {
                text: 'Bake for 9-11 minutes until golden brown',
                duration: '10 minutes',
            },
        ],
    },
};
