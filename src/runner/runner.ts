import {
    workspace, window, commands, tasks, Uri,
    Terminal, TextDocument, TaskExecution, TaskScope,
    ShellExecution, Task, TaskRevealKind,
    ShellQuotedString, ShellQuoting, TaskPanelKind
} from 'vscode';

export async function compileFunction(uri: Uri) {
    const robustaJarPath: string = getConf("path");
    if (!robustaJarPath) {
        let response = await window.showErrorMessage("Can't find robusta.jar file, please specify the location of the file in user\'s settings.json", 'Open User Settings');
        if (response === 'Open User Settings') {
            await commands.executeCommand('workbench.action.openGlobalSettings', `@ext:meshredded.robusta`);
        }
    } else {
        const fileFullPath = uri.fsPath;
        !isCompileTaskCurrentlyExecuting() && await compileJvs(robustaJarPath as string, fileFullPath);
    }
}

export async function runJarFunction(uri: Uri) {
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
        shouldFormatOnSave && await commands.executeCommand('editor.action.format');
        if (robustaJarPath && shouldCompileOnSave) {
            !isCompileTaskCurrentlyExecuting() && await compileJvs(robustaJarPath, document.uri.fsPath);
        }
    }
}

function compileJvs(robustaJarPath: string, fileFullPath: string): Thenable<TaskExecution> {

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
    task.presentationOptions.panel = TaskPanelKind.Shared;
    task.presentationOptions.reveal = TaskRevealKind.Always;
    task.presentationOptions.echo = true;
    task.presentationOptions.showReuseMessage = false;
    task.problemMatchers = ["jvscompile"];
    task.isBackground = false;

    return tasks.executeTask(task);

}

// To prevent running compilation task in parallel
function isCompileTaskCurrentlyExecuting(): boolean {
    return tasks.taskExecutions.some(taskExec => taskExec.task.name === "compile");
}

function quotedCommand(command: string): ShellQuotedString {
    return { value: command, quoting: ShellQuoting.Strong };
}

function getConf(key: string): any {
    const robustaConfig = workspace.getConfiguration("robusta");
    return robustaConfig.get(key);
}