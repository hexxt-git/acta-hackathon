import { clickerGameExtension } from '../clicker-game';

export default {
    title: 'Extensions/ClickerGame',
    component: clickerGameExtension.renderer,
};

export const Default = () => <clickerGameExtension.renderer onInteract={() => {}} />;
