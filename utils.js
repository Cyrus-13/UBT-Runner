const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function GetUnrealProjectName() {
    if (!vscode.workspace.workspaceFolders?.length) {
        return { success: false };
    }

    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    function findUProjectSync(dir) {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                if (['Intermediate', 'Binaries', 'Saved', 'DerivedDataCache', '.git', 'Plugins'].includes(file.name)) continue;
                const result = findUProjectSync(path.join(dir, file.name));
                if (result) return result;
            } else if (file.name.endsWith('.uproject')) {
                return path.join(dir, file.name);
            }
        }
        return null;
    }

    const uprojectFile = findUProjectSync(rootPath);
    if (!uprojectFile) {
        return { success: false };
    }

    const rawProjectName = path.basename(uprojectFile, '.uproject');
    const targetType = vscode.workspace.getConfiguration('ubt-runner').get('targetType') || 'Editor';

    let finalProjectName = rawProjectName;
    if (targetType === 'Editor') finalProjectName += 'Editor';
    else if (targetType === 'Client') finalProjectName += 'Client';
    else if (targetType === 'Server') finalProjectName += 'Server';

    return {
        success: true,
        name: finalProjectName,
        fsPath: uprojectFile, // Full path to the .uproject file
        projectPath: path.dirname(uprojectFile) // Path to the directory containing it
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