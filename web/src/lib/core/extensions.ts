import { emailExtension } from './extensions/email';
import { todoExtension } from './extensions/todo';
import { draftExtension } from './extensions/draft';
import { reminderExtension } from './extensions/reminder';
import { Extension } from './types/extensions';
import { optionsExtension } from './extensions/options';
import { comparisonExtension } from './extensions/comparison';

export const extensions: Extension<any>[] = [
    emailExtension,
    todoExtension,
    draftExtension,
    reminderExtension,
    optionsExtension,
    comparisonExtension,
];
