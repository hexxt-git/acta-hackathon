import { emailExtension } from './extensions/email';
import { todoExtension } from './extensions/todo';
import { draftExtension } from './extensions/draft';
import { reminderExtension } from './extensions/reminder';
import { Extension } from './types/extensions';
import { optionsExtension } from './extensions/options';
import { comparisonExtension } from './extensions/comparison';
import { listExtension } from './extensions/list';
import { keyValueExtension } from './extensions/key-value';
import { specCardExtension } from './extensions/spec-card';
import { multiSpecCardExtension } from './extensions/multi-spec-card';
import { messageExtension } from './extensions/message';
import { codeExtension } from './extensions/code';

export const extensions: Extension<any>[] = [
    emailExtension,
    todoExtension,
    listExtension,
    draftExtension,
    reminderExtension,
    optionsExtension,
    comparisonExtension,
    keyValueExtension,
    specCardExtension,
    multiSpecCardExtension,
    messageExtension,
    codeExtension,
];
