import { Uri, workspace } from 'vscode';

export function requireFallback(id: string, path: string | null): any {
    try {
        return require(require.resolve(id, { paths: (path && [path]) || undefined }));
    } catch (e) {
        return require(id);
    }
}

export function findBaseDir(uri: Uri, fallback: string | null = null): string | null {
    return 'file' === uri.scheme
        ? uri.fsPath
        : workspace.workspaceFolders
            ? workspace.workspaceFolders[0].uri.fsPath
            : fallback;
}