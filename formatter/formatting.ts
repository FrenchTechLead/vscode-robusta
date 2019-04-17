import * as path from 'path';
import * as tslint from 'tslint';
import * as ts from 'typescript';
import * as tsfmt from 'typescript-formatter';
import { env, Uri } from 'vscode';

import { configPath, tsconfigConfigPath, tslintConfigPath } from './configuration';
import { findBaseDir, requireFallback } from './util';

export function diagnose(input: string, uri: Uri): ts.Diagnostic[] {
    const { transpileModule } = requireFallback(
        'typescript',
        findBaseDir(uri, path.resolve(env.appRoot, 'extensions/node_modules'))!
    ) as typeof ts;
    return transpileModule(input, {
        compilerOptions: { noEmit: true },
        reportDiagnostics: true
    }).diagnostics!;
}

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

export function tslintFix(input: string, uri: Uri): string {
    if ('untitled' === uri.scheme) {
        return input;
    }
    const baseDir = findBaseDir(uri);
    const { Configuration, Linter, Replacement } = requireFallback(
        'tslint',
        baseDir
    ) as typeof tslint;
    const linter = new Linter({ fix: false, formatter: 'json' });
    linter.lint(uri.fsPath, input, Configuration.findConfiguration(null, uri.fsPath).results);
    const fixes: tslint.Fix[] = [];
    for (const failure of linter.getResult().failures) {
        failure.hasFix() && fixes.push(failure.getFix()!);
    }
    return Replacement.applyFixes(input, fixes);
}