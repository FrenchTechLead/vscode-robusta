import { ExtensionContext, languages } from 'vscode';

import JavascoolProvider from './javascool-provider';

export function activate(context: ExtensionContext): void {
    const provider = new JavascoolProvider();
    context.subscriptions.push(
        languages.registerDocumentFormattingEditProvider('jvs', provider)
    );
}