const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { GetUnrealProjectName, GetUnrealBuildToolLocation } = require('./utils');

// All supported build configurations — single source of truth
const UBT_CONFIGS = ['Development', 'DebugGame', 'Debug', 'Test', 'Shipping'];

function activate(context) {

	// Prompt for UE installation path if not set
	const config = vscode.workspace.getConfiguration('ubt-runner');
	const uePath = config.get('unrealEngineInstallation');
	if (!uePath || uePath.trim() === '') {
		vscode.window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: 'Select UE Installation',
			title: 'Select Unreal Engine Installation Folder'
		}).then(uri => {
			if (uri && uri[0]) {
				config.update('unrealEngineInstallation', uri[0].fsPath, vscode.ConfigurationTarget.Global);
				vscode.window.showInformationMessage('Unreal Engine installation path saved!');
			}
		});
	}

	// generate launch.json if ue
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
		vscode.workspace.findFiles('**/*.uproject', null, 1).then(files => {
			if (files.length > 0) {
				generateLaunchJson(workspaceFolders[0].uri.fsPath);
			}
		});
	}

	// tkhrbi9 dialek a zamel
	const runUBTDisposable = vscode.commands.registerCommand('ubt-runner.RunUBT', async () => {
		const paths = await promptForFiles();
		if (!paths) return;

		const { ubtLocation, projectLocation } = paths;
		const projectName = path.basename(projectLocation, '.uproject');
		const platform = 'Win64';
		const buildConfig = 'Development';
		const command = `"${ubtLocation}" ${projectName} ${platform} ${buildConfig} "${projectLocation}"`;

		const terminal = vscode.window.createTerminal('UBT Runner');
		terminal.show();
		terminal.sendText(command);
	});

	// compile button
	const compileDisposable = vscode.commands.registerCommand('ubt-runner.TestRun', () => {
		const defaultConfig = vscode.workspace.getConfiguration('ubt-runner').get('defaultBuildConfiguration') || 'Development';
		BuildUnrealProject(defaultConfig);
	});

	// debug & run config
	const debugProvider = {
		resolveDebugConfiguration(folder, config, token) {
			const buildConfig = config.buildConfiguration || 'Development';
			BuildUnrealProject(buildConfig);
			return undefined;
		}
	};
	context.subscriptions.push(
		vscode.debug.registerDebugConfigurationProvider('ubt-runner', debugProvider),
		runUBTDisposable,
		compileDisposable
	);
}





//Select UE path
async function promptForFiles() {
	const ubtUri = await vscode.window.showOpenDialog({
		canSelectMany: false,
		openLabel: 'Select UnrealBuildTool.exe',
		title: 'Step 1/2: Select UBT Executable'
	});
	if (!ubtUri?.[0]) return undefined;

	const projectUri = await vscode.window.showOpenDialog({
		canSelectMany: false,
		openLabel: 'Select .uproject file',
		title: 'Step 2/2: Select your Project file',
		filters: { 'Unreal Projects': ['uproject'] }
	});
	if (!projectUri?.[0]) return undefined;

	return {
		ubtLocation: ubtUri[0].fsPath,
		projectLocation: projectUri[0].fsPath
	};
}






//build project
function BuildUnrealProject(buildConfig) {
	const config = buildConfig || 'Development';
	vscode.window.showInformationMessage(`Building Unreal Project [${config}]`);
}












//gnerate launch.json
function generateLaunchJson(workspaceRoot) {
	const vscodeDir = path.join(workspaceRoot, '.vscode');
	const launchPath = path.join(vscodeDir, 'launch.json');

	const ubtConfigs = UBT_CONFIGS.map(cfg => ({
		name: `UBT: ${cfg}`,
		type: 'ubt-runner',
		request: 'launch',
		buildConfiguration: cfg
	}));

	if (fs.existsSync(launchPath)) {
		try {
			const existing = JSON.parse(fs.readFileSync(launchPath, 'utf8'));
			const hasUbt = existing.configurations?.some(c => c.type === 'ubt-runner');
			if (hasUbt) return;
			existing.configurations = [...(existing.configurations || []), ...ubtConfigs];
			fs.writeFileSync(launchPath, JSON.stringify(existing, null, 4));
		} catch {
			// Malformed launch.json — skip to avoid corrupting user's file
		}
		return;
	}

	if (!fs.existsSync(vscodeDir)) {
		fs.mkdirSync(vscodeDir);
	}
	fs.writeFileSync(launchPath, JSON.stringify({ version: '0.2.0', configurations: ubtConfigs }, null, 4));
}





// Called when the extension is deactivated
function deactivate() { }

module.exports = { activate, deactivate, BuildUnrealProject };