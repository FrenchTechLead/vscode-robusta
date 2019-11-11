import {
    CancellationToken,
    DocumentFormattingEditProvider,
    DocumentRangeFormattingEditProvider,
    FormattingOptions,
    Range,
    TextDocument,
    TextEdit
} from 'vscode';

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
        let result = this.format(source.trim());
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







    private format(code: string): string {
        const newLineToken = '-<newLine>-';
        let lines: string[] = code.split('\n');
        lines = lines.map(l => l.trim()).map(l=> l === '' ? newLineToken: l);
        let toReturn: string[] = [];
        let indent: number = 0;
        let isInsideRoundBrackets = false;
        let isInsideString = false;
        let isInsideCommentBlock = false;

        linesLoop:
        for (let i = 0; i < lines.length; i++) {
            let currentLine = lines[i];
            if (currentLine === '') {
                continue;
            }
            lineLoop:
            for (let j = 0; j < currentLine.length; j++) {
                let currentChar = currentLine.charAt(j);

                if (currentChar === '"') {
                    isInsideString = !isInsideString;
                }
                if (currentChar === '(' && !isInsideString) {
                    isInsideRoundBrackets = true;
                }
                if (currentChar === ')' && !isInsideString) {
                    isInsideRoundBrackets = false;
                }
                if (currentLine.indexOf("//") > -1 || currentLine.indexOf("/*") > 0) {
                    isInsideCommentBlock = true;
                }
                if (currentLine.indexOf("*/") > -1) {
                    isInsideCommentBlock = false;
                }

                if (!isInsideString && !isInsideRoundBrackets && !isInsideCommentBlock) {
                    switchCase:
                    switch (currentChar) {
                        case '{':
                            let l1 = currentLine.substring(0, j + 1);
                            let l2 = currentLine.substr(j + 1);
                            if (j !== 0 && l1.charAt(j - 1) !== ' ') {
                                l1 = this.insertCharAt(j, l1, ' ');
                            }
                            toReturn.push(this.indent(indent) + l1);
                            indent = indent + 1;
                            currentLine = l2;
                            break lineLoop;

                        case '}':
                            if (currentLine.length - 1 > j && currentLine.charAt(j + 1) !== ' ') {
                                currentLine = this.insertCharAt(j + 1, currentLine, ' ');
                            }
                            indent = indent - 1;
                            break switchCase;
                        case ';':
                            let _l1 = this.indent(indent) + currentLine.substring(0, j + 1);
                            let _l2 = currentLine.substr(j + 1);
                            currentLine = _l2;
                            toReturn.push(_l1);
                            break switchCase;

                    }

                } else if (isInsideRoundBrackets && !isInsideString && !isInsideCommentBlock) {
                    if (currentChar === ';' && currentLine.charAt(j + 1) !== ' ') {
                        currentLine = this.insertCharAt(j + 1, currentLine, ' ');
                    }
                }

            } // end of line iterator


            if (currentLine.trim()) {
                currentLine = this.indent(indent) + currentLine;
                toReturn.push(currentLine);
            }


        } // end of code iterator



        const str = toReturn.map(l => l.trim() === newLineToken ? '\n' : l + '\n').join('');
        return str;
    }



    private indent(x: number): string {
        let indents = '';
        for (let i = 0; i < x; i++)
            indents = indents + '\t';
        return indents;
    }

    private insertCharAt(index: number, str: string, char: string): string {
        return str.substr(0, index) + char + str.substr(index);
    }
}