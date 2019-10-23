'use strict';

import { workspace, window, commands, languages, tasks, Uri, Terminal, TextDocument, TaskExecution, TaskScope, ShellExecution, Task, TaskRevealKind } from 'vscode';

export async function compileFunction(uri: Uri) {
    closeAllTerminals();
    const javascoolConfig = workspace.getConfiguration("javascool-light");
    if (!javascoolConfig.has('path') || !javascoolConfig.get("path")) {
        let response = await window.showErrorMessage("Can't find javascool-light.jar file, please specify the location of the file in user\'s settings.json", 'Open User Settings');
        if (response === 'Open User Settings') {
            await commands.executeCommand('workbench.action.openGlobalSettings');
        }
    } else {
        const javascoolJarPath = javascoolConfig.get("path");
        const fileFullPath = uri.fsPath;
        await compileJvs(javascoolJarPath as string, fileFullPath, false);
        const cc = languages.getLanguages();
        console.log(cc);

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
    closeAllTerminals();
    await commands.executeCommand('editor.action.format');
    const javascoolConfig = workspace.getConfiguration("javascool-light");
    if (javascoolConfig.has('path') && javascoolConfig.get("path")) {
        await compileJvs(javascoolConfig.get("path") as string, document.uri.fsPath, true);
    }
}



function closeAllTerminals(): void {
    (<any>window).terminals.forEach((t: Terminal) => t.dispose());
}

function compileJvs(javascoolJarPath: string, fileFullPath: string, isBackground: boolean): Thenable<TaskExecution> {
    const task = new Task(
        {
            type: "jvscompile"
        },
        TaskScope.Workspace,
        "compile",
        "javascool",
        new ShellExecution(`java -jar  "${javascoolJarPath}" compile "${fileFullPath}"`)
    );
    task.presentationOptions.clear = true;
    task.presentationOptions.reveal = isBackground ? TaskRevealKind.Never : TaskRevealKind.Always;
    task.presentationOptions.echo = true;
    task.presentationOptions.showReuseMessage = false;
    task.problemMatchers = ["jvscompile"];
    task.isBackground = isBackground;
    return tasks.executeTask(task);
}