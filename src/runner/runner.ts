import {
    workspace, window, commands, tasks, Uri,
    Terminal, TextDocument, TaskExecution, TaskScope,
    ShellExecution, Task, TaskRevealKind,
    ShellQuotedString, ShellQuoting, TaskPanelKind, ExtensionContext
} from 'vscode';
import { isWindows } from '../utils';

export async function compileFunction(uri: Uri, context: ExtensionContext) {
    const robustaJarPath: string = getConf("path");
    if (!robustaJarPath) {
        let response = await window.showErrorMessage("Can't find robusta.jar file, please specify the location of the file in user\'s settings.json", 'Open User Settings');
        if (response === 'Open User Settings') {
            await commands.executeCommand('workbench.action.openSettings', '@ext:meshredded.robusta');
        }
    } else {
        const fileFullPath = uri.fsPath;
        !isCompileTaskCurrentlyExecuting() && await compileJvs(robustaJarPath as string, fileFullPath, context);
    }
}

export async function runJarFunction(uri: Uri, context: ExtensionContext) {
    const fileFullPath = uri.fsPath;
    const terminal: Terminal = (<any>window).createTerminal({ name: `robusta` });
    terminal.show();
    terminal.sendText(`${getJava(context)} -jar "${fileFullPath}"`, true);
}

export async function onDocumentSave(document: TextDocument, context: ExtensionContext) {
    const robustaJarPath: string = getConf("path");
    const shouldFormatOnSave: boolean = getConf("formatOnSave");
    const shouldCompileOnSave: boolean = getConf("compileOnSave");
    if (document.fileName.endsWith('jvs')) {
        shouldFormatOnSave && await commands.executeCommand('editor.action.format');
        if (robustaJarPath && shouldCompileOnSave) {
            !isCompileTaskCurrentlyExecuting() && await compileJvs(robustaJarPath, document.uri.fsPath, context);
        }
    }
}

function compileJvs(
    robustaJarPath: string,
    fileFullPath: string,
    context: ExtensionContext
): Thenable<TaskExecution> {

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
        new ShellExecution(getJava(context), args)
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

export function formatJvs(
    fileFullPath: string,
    context: ExtensionContext
): Thenable<TaskExecution> {
    const robustaJarPath: string = getConf("path");

    const args: (ShellQuotedString | string)[] = ['-jar'];
    args.push(quotedCommand(robustaJarPath))
    args.push('format')
    args.push(quotedCommand(fileFullPath));

    const task = new Task(
        {
            type: "jvsFormat"
        },
        TaskScope.Workspace,
        "format",
        "robusta",
        new ShellExecution(getJava(context), args)
    );

    task.presentationOptions.clear = false;
    task.presentationOptions.panel = TaskPanelKind.Dedicated;
    task.presentationOptions.reveal = TaskRevealKind.Never;
    task.presentationOptions.echo = true;
    task.presentationOptions.showReuseMessage = false;
    task.isBackground = true;
    return tasks.executeTask(task);
}

// To prevent running compilation task in parallel
function isCompileTaskCurrentlyExecuting(): boolean {
    return tasks.taskExecutions.some(taskExec => taskExec.task.name === "compile");
}

function quotedCommand(command: string): ShellQuotedString {
    return { value: command, quoting: ShellQuoting.Escape };
}

function getConf(key: string): any {
    const robustaConfig = workspace.getConfiguration("robusta");
    return robustaConfig.get(key);
}

function getJava(context: ExtensionContext) {
    const PROGRAMSX86 = "PROGRAM FILES (X86)";
    const PROGRAMS = "PROGRAM FILES";
    const PROGRAMS_1 = "PROGRA~1";
    const PROGRAMS_2 = "PROGRA~2";
    let jdkHomePath: string = getConf('jdkHomePath');
    let java = 'java';
    if (jdkHomePath) {
        if (isWindows) {
            jdkHomePath = jdkHomePath.toUpperCase();
            jdkHomePath = jdkHomePath.replace(PROGRAMSX86, PROGRAMS_2);
            jdkHomePath = jdkHomePath.replace(PROGRAMS, PROGRAMS_1);
            java = jdkHomePath + '\\bin\\java.exe';
        } else {
            java = jdkHomePath + '/bin/java';
        }
    } else {
        const jdkHomePath = context.globalState.get('jdkHome');
        if (jdkHomePath) {
            java = jdkHomePath + '\\bin\\java.exe';
        }
    }
    return java;
}
