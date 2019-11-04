import { ExtensionContext, languages, commands, workspace } from 'vscode';
import RobustaFormattingProvider from './formatter/robusta-formatting-provider';
import { compileFunction, runJarFunction, onDocumentSave } from './runner/runner';

export function activate(context: ExtensionContext): void {
    context.subscriptions.push(languages.registerDocumentFormattingEditProvider({ scheme: 'file', language: 'jvs' }, new RobustaFormattingProvider()));
    context.subscriptions.push(commands.registerCommand('robusta.compile', compileFunction));
    context.subscriptions.push(commands.registerCommand('robusta.runJar', runJarFunction));
    workspace.onDidSaveTextDocument(onDocumentSave);

}