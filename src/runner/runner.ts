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
    const javascoolJarPath: string = getConf("path");
    if (!javascoolJarPath) {
        let response = await window.showErrorMessage("Can't find javascool-light.jar file, please specify the location of the file in user\'s settings.json", 'Open User Settings');
        if (response === 'Open User Settings') {
            await commands.executeCommand('workbench.action.openGlobalSettings', 'javascool');
        }
    } else {
        const fileFullPath = uri.fsPath;
        await compileJvs(javascoolJarPath as string, fileFullPath, false);
    }
}

export async function runJarFunction(uri: Uri) {
    closeAllTerminals();
    const fileFullPath = uri.fsPath;
    const terminal: Terminal = (<any>window).createTerminal({ name: `javascool` });
    terminal.show();
    terminal.sendText(`java -jar "${fileFullPath}"`, true);
}

export async function onDocumentSave(document: TextDocument) {
    const javascoolJarPath: string = getConf("path");
    const shouldFormatOnSave: boolean = getConf("formatOnSave");
    const shouldCompileOnSave: boolean = getConf("compileOnSave");
    if (document.fileName.endsWith('jvs')) {
        closeAllTerminals();
        shouldFormatOnSave && await commands.executeCommand('editor.action.format');
        if (javascoolJarPath && shouldCompileOnSave) {
            await compileJvs(javascoolJarPath, document.uri.fsPath, true);
        }
    }
}

function compileJvs(javascoolJarPath: string, fileFullPath: string, isBackground: boolean): Thenable<TaskExecution> {

    const args: (ShellQuotedString | string)[] = ['-jar'];
    args.push(quotedCommand(javascoolJarPath))
    args.push('compile')
    args.push(quotedCommand(fileFullPath));

    const task = new Task(
        {
            type: "jvscompile"
        },
        TaskScope.Workspace,
        "compile",
        "javascool",
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
    const javascoolConfig = workspace.getConfiguration("javascool-light");
    return javascoolConfig.get(key);
}

function closeAllTerminals(): void {
    (<any>window).terminals.forEach((t: Terminal) => t.dispose());
}