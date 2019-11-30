
const fs = require('fs');
import { ExtensionContext } from 'vscode';

export function findJdkHome(context: ExtensionContext) {
    const javaPath1 = "C:\\PROGRA~1\\Java\\";
    const javaPath2 = "C:\\PROGRA~2\\Java\\";
    fs.exists(javaPath1, (exists: boolean) => exists && setJdkHome(context, javaPath1));
    fs.exists(javaPath2, (exists: boolean) => exists && setJdkHome(context, javaPath2));

}

function setJdkHome(context: ExtensionContext, javaPath: string) {
    fs.readdir(javaPath, (err: any, files: string[]) => {
        if (err) {
            return;
        } else {
            files.forEach(file => {
                if (file.indexOf('jdk') > -1) {
                    context.globalState.update('jdk', file);
                }
            });
        }
    });
}