import { coinFlipGameExtension } from '../coin-flip-game';

export default {
    title: 'Extensions/CoinFlipGame',
    component: coinFlipGameExtension.renderer,
};

export const Default = () => <coinFlipGameExtension.renderer onInteract={() => {}} />;
