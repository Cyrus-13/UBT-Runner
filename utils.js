const vscode = require('vscode');
const path = require('path');

async function GetUnrealProjectName() {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders && workspaceFolders.length > 0) {
        const files = await vscode.workspace.findFiles('**/*.uproject');

        if (files.length > 0) {
            const fileName = path.basename(files[0].fsPath, '.uproject');
            vscode.window.showInformationMessage(`UProject: ${fileName}`);
            return { success: true, name: fileName, fsPath: files[0].fsPath };
        } else {
            vscode.window.showWarningMessage('No .uproject file found');
            return { success: false };
        }
    } else {
        vscode.window.showWarningMessage('No folder is open');
        return { success: false };
    }
}

function GetUnrealBuildToolLocation() {
    const config = vscode.workspace.getConfiguration('ubt-runner');
    const uePath = config.get('unrealEngineInstallation');

    if (uePath) {
        return path.join(uePath, 'Engine', 'Binaries', 'DotNET', 'UnrealBuildTool', 'UnrealBuildTool.exe');
    }

    return null;
}



module.exports = {
    GetUnrealProjectName
};
