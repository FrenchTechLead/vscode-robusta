import * as tsfmt from 'typescript-formatter';
import { Uri } from 'vscode';

import { configPath, tsconfigConfigPath, tslintConfigPath } from './configuration';
import { findBaseDir, requireFallback } from './util';

export async function format(input: string, uri: Uri): Promise<string> {
    const untitled = 'untitled' === uri.scheme;
    const baseDir = findBaseDir(uri);
    const { processString } = requireFallback('typescript-formatter', baseDir) as typeof tsfmt;

    return (await processString(uri.fsPath, input, {
        replace: false,
        verify: false,
        baseDir: baseDir || undefined,
        tsconfig: Boolean(!untitled || tsconfigConfigPath()),
        tsconfigFile: tsconfigConfigPath(),
        tslint: Boolean(!untitled || tslintConfigPath()),
        tslintFile: tslintConfigPath(),
        editorconfig: !untitled,
        vscode: !untitled,
        vscodeFile: null,
        tsfmt: Boolean(!untitled || configPath()),
        tsfmtFile: configPath(),
        verbose: false
    })).dest;
}
