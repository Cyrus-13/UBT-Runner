const vscode = require('vscode');
const path = require('path');

async function GetUnrealProjectName() {
    if (!vscode.workspace.workspaceFolders?.length) {
        return { success: false };
    }

    const files = await vscode.workspace.findFiles('**/*.uproject', null, 1);
    if (files.length === 0) {
        return { success: false };
    }

    return {
        success: true,
        name: path.basename(files[0].fsPath, '.uproject'),
        fsPath: files[0].fsPath, // Full path to the .uproject file
        projectPath: path.dirname(files[0].fsPath) // Path to the directory containing it
    };
}


function GetUnrealBuildToolLocation() {
    const config = vscode.workspace.getConfiguration('ubt-runner');
    const uePath = config.get('unrealEngineInstallation');

    if (!uePath) return null;

    return path.join(uePath, 'Engine', 'Binaries', 'DotNET', 'UnrealBuildTool', 'UnrealBuildTool.exe');
}

function GetTargetPlatform() {
    return vscode.workspace.getConfiguration('ubt-runner').get('targetPlatform') || 'Win64';
}

function GetAdditionalFlags() {
    return vscode.workspace.getConfiguration('ubt-runner').get('additionalFlags') || '';
}

module.exports = {
    GetUnrealProjectName,
    GetUnrealBuildToolLocation,
    GetTargetPlatform,
    GetAdditionalFlags
};