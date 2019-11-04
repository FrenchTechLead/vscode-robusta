import {
    CancellationToken,
    DocumentFormattingEditProvider,
    DocumentRangeFormattingEditProvider,
    FormattingOptions,
    Range,
    TextDocument,
    TextEdit
} from 'vscode';

import { format } from './formatting';

export default class RobustaFormattingProvider
    implements DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider {
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
        const source = document.getText(range);
        let result = await format(source, document.uri);
        range &&
            (result = result
                .split('\n')
                .map((l) => `${' '.repeat(range.start.character)}${l}`)
                .join('\n')
                .slice(range.start.character));
        return [
            TextEdit.replace(
                range ||
                new Range(
                    0,
                    0,
                    document.lineCount - 1,
                    document.lineAt(document.lineCount - 1).text.length
                ),
                result
            )
        ];
    }
}