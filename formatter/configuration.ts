import { workspace } from 'vscode';

export function configPath(): string | null {
    return workspace.getConfiguration('tsfmt').get('configPath') || null;
}

export function logLevel(): 'error' | 'warning' | 'information' {
    return workspace.getConfiguration('tsfmt').get('logLevel') || 'error';
}

export function showNotification(): boolean {
    return 'enabled' === workspace.getConfiguration('tsfmt').get('notification');
}

export function tsconfigConfigPath(): string | null {
    return workspace.getConfiguration('tsfmt').get('tsconfig.configPath') || null;
}

export function tslintAutoFixEnabled(): boolean {
    return 'enabled' === workspace.getConfiguration('tsfmt').get('tslint.autoFix');
}

export function tslintConfigPath(): string | null {
    return workspace.getConfiguration('tsfmt').get('tslint.configPath') || null;
}