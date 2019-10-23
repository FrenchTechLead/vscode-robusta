import { ExtensionContext, languages, commands, workspace } from 'vscode';
import JavascoolFormattingProvider from './formatter/javascool-formatting-provider';
import { compileFunction, runJarFunction, onDocumentSave } from './runner/runner';

export function activate(context: ExtensionContext): void {
    context.subscriptions.push(languages.registerDocumentFormattingEditProvider({ scheme: 'file', language: 'jvs' }, new JavascoolFormattingProvider()));
    context.subscriptions.push(commands.registerCommand('javascool.compile', compileFunction));
    context.subscriptions.push(commands.registerCommand('javascool.runJar', runJarFunction));
    workspace.onDidSaveTextDocument(onDocumentSave);

}