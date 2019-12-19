import {
    CancellationToken,
    DocumentFormattingEditProvider,
    DocumentRangeFormattingEditProvider,
    FormattingOptions,
    Range,
    TextDocument,
    TaskExecution,
    TextEdit,
    tasks,
    ExtensionContext
} from 'vscode';

import {formatJvs} from './../runner/runner';

export default class RobustaFormattingProvider
    implements DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider {
        private context: ExtensionContext;
        constructor(context: ExtensionContext){
            this.context = context;
        }
    public provideDocumentFormattingEdits(
        document: TextDocument,
        options: FormattingOptions,
        token: CancellationToken
    ): Promise<TextEdit[]> {
        return this._format(document);
    }

    public provideDocumentRangeFormattingEdits(
        document: TextDocument,
        range: Range,
        options: FormattingOptions,
        token: CancellationToken
    ): Promise<TextEdit[]> {
        return this._format(document, range);
    }

    private async _format(document: TextDocument, range?: Range): Promise<TextEdit[]> {
        this.formatByRobustaJar(document.fileName);
        return [];
    }

    private formatByRobustaJar(jvsFilePath: string): void {
        if( !this.isFormatTaskCurrentlyExecuting()){
            const taskExecPromise : Thenable<TaskExecution> = formatJvs(jvsFilePath, this.context);
            taskExecPromise.then(taskExec => {
                console.log(taskExec);
            });
            
        }
    }

    // To prevent running multiple compilation tasks in parallel
    isFormatTaskCurrentlyExecuting(): boolean {
        return tasks.taskExecutions.some(taskExec => taskExec.task.name === "format");
    }
}