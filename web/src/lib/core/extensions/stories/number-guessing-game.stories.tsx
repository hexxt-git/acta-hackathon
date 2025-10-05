import { numberGuessingGameExtension } from '../number-guessing-game';

export default {
    title: 'Extensions/NumberGuessingGame',
    component: numberGuessingGameExtension.renderer,
};

export const Default = () => <numberGuessingGameExtension.renderer onInteract={() => {}} />;
