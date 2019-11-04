'use strict';

import {
    workspace, window, commands, tasks,
    Uri, Terminal, TextDocument, TaskExecution, TaskScope,
    ShellExecution, Task, TaskRevealKind,
    ShellQuotedString, TextEditor,
    ShellQuoting
} from 'vscode';

export async function compileFunction(uri: Uri) {
    closeAllTerminals();
    const robustaJarPath: string = getConf("path");
    if (!robustaJarPath) {
        let response = await window.showErrorMessage("Can't find robusta.jar file, please specify the location of the file in user\'s settings.json", 'Open User Settings');
        if (response === 'Open User Settings') {
            await commands.executeCommand('workbench.action.openGlobalSettings', 'robusta');
        }
    } else {
        const fileFullPath = uri.fsPath;
        await compileJvs(robustaJarPath as string, fileFullPath, false);
    }
}

export async function runJarFunction(uri: Uri) {
    closeAllTerminals();
    const fileFullPath = uri.fsPath;
    const terminal: Terminal = (<any>window).createTerminal({ name: `robusta` });
    terminal.show();
    terminal.sendText(`java -jar "${fileFullPath}"`, true);
}

export async function onDocumentSave(document: TextDocument) {
    const robustaJarPath: string = getConf("path");
    const shouldFormatOnSave: boolean = getConf("formatOnSave");
    const shouldCompileOnSave: boolean = getConf("compileOnSave");
    if (document.fileName.endsWith('jvs')) {
        closeAllTerminals();
        shouldFormatOnSave && await commands.executeCommand('editor.action.format');
        if (robustaJarPath && shouldCompileOnSave) {
            await compileJvs(robustaJarPath, document.uri.fsPath, true);
        }
    }
}

function compileJvs(robustaJarPath: string, fileFullPath: string, isBackground: boolean): Thenable<TaskExecution> {

    const args: (ShellQuotedString | string)[] = ['-jar'];
    args.push(quotedCommand(robustaJarPath))
    args.push('compile')
    args.push(quotedCommand(fileFullPath));

    const task = new Task(
        {
            type: "jvscompile"
        },
        TaskScope.Workspace,
        "compile",
        "robusta",
        new ShellExecution("java", args)
    );

    task.presentationOptions.clear = true;
    task.presentationOptions.reveal = isBackground ? TaskRevealKind.Never : TaskRevealKind.Always;
    task.presentationOptions.echo = true;
    task.presentationOptions.showReuseMessage = false;
    task.problemMatchers = ["jvscompile"];
    task.isBackground = isBackground;

    return tasks.executeTask(task);

}

function quotedCommand(command: string): ShellQuotedString {
    return { value: command, quoting: ShellQuoting.Strong };
}

function getConf(key: string): any {
    const robustaConfig = workspace.getConfiguration("robusta");
    return robustaConfig.get(key);
}

function closeAllTerminals(): void {
    (<any>window).terminals.forEach((t: Terminal) => t.dispose());
}