import { window,StatusBarAlignment, ExtensionContext, languages, commands, workspace } from 'vscode';
import RobustaFormattingProvider from './formatter/robusta-formatting-provider';
import { compileFunction, runJarFunction, onDocumentSave } from './runner/runner';

export function activate(context: ExtensionContext): void {
    context.subscriptions.push(languages.registerDocumentFormattingEditProvider({ scheme: 'file', language: 'jvs' }, new RobustaFormattingProvider()));
    context.subscriptions.push(commands.registerCommand('robusta.compile', compileFunction));
    context.subscriptions.push(commands.registerCommand('robusta.runJar', runJarFunction));
    workspace.onDidSaveTextDocument(onDocumentSave);
    
    const robustaOpenOptionsCmd = 'robusta.openOptions';
	context.subscriptions.push(commands.registerCommand(robustaOpenOptionsCmd, () => {
		commands.executeCommand('workbench.action.openSettings', '@ext:meshredded.robusta')
	}));
    const robustaOpenOptionsBtn = window.createStatusBarItem(StatusBarAlignment.Left);
    robustaOpenOptionsBtn.command = robustaOpenOptionsCmd;
    robustaOpenOptionsBtn.text = 'Open Robusta Settings';
    context.subscriptions.push(robustaOpenOptionsBtn);
    robustaOpenOptionsBtn.show();
}

