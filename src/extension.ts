import { window, StatusBarAlignment, ExtensionContext, languages, commands, workspace, env, Uri } from 'vscode';
import RobustaFormattingProvider from './formatter/robusta-formatting-provider';
import { compileFunction, runJarFunction, onDocumentSave } from './runner/runner';
import { findJdkHome } from './utils';

export function activate(context: ExtensionContext): void {

    // show a message box on activation

    let MESSAGE = 'Hi there! Robusta is ready to use! If you like it, please give it a star ⭐ on GitHub! and follow FrenchTechLead on Twitter 𝕏';
    let Twitter = 'Twitter';
    let GitHub = 'GitHub';
    window.showInformationMessage(MESSAGE, Twitter, GitHub )
    .then(selection => {
      if (selection === GitHub) {
        env.openExternal(Uri.parse(
            'https://github.com/FrenchTechLead/robusta'));
      } else if (selection === Twitter) {
        env.openExternal(Uri.parse(
            'https://twitter.com/FrenchTechLead'));
      }
    });
    context.subscriptions.push(languages.registerDocumentFormattingEditProvider({ scheme: 'file', language: 'jvs' }, new RobustaFormattingProvider(context)));
    context.subscriptions.push(commands.registerCommand('robusta.compile', (uri) => compileFunction(uri, context)));
    context.subscriptions.push(commands.registerCommand('robusta.runJar', (uri) => runJarFunction(uri, context)));
    workspace.onDidSaveTextDocument((x) => onDocumentSave(x, context));

    const robustaOpenOptionsCmd = 'robusta.openOptions';
    context.subscriptions.push(commands.registerCommand(robustaOpenOptionsCmd, () => {
        commands.executeCommand('workbench.action.openSettings', '@ext:meshredded.robusta')
    }));
    const robustaOpenOptionsBtn = window.createStatusBarItem(StatusBarAlignment.Left);
    robustaOpenOptionsBtn.command = robustaOpenOptionsCmd;
    robustaOpenOptionsBtn.text = 'Open Robusta Settings';
    context.subscriptions.push(robustaOpenOptionsBtn);
    robustaOpenOptionsBtn.show();
    findJdkHome(context);
}

