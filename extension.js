// hada hir vscode lib mstoriya f const variabl
const vscode = require('vscode');
const path = require('path');
const { GetUnrealProjectName } = require('./utils');










/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Check if Unreal Engine Installation is set
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
				vscode.window.showInformationMessage(`Unreal Engine installation path saved!`);
			}
		});
	}









	// The command has been defined in the package.json file
	const disposable = vscode.commands.registerCommand('ubt-runner.RunUBT', async function () {
		// The code you place here will be executed every time your command is executed

		//wlkin 9bal mt ruunna lcommand hy5ssni n geti user UBT location
		//(hnst3ml user input f bdya wlkin n9d nrdha ka dedicta automatcly mnb3d)
		let finalCommand = '';
		const userPaths = await getFiles();
		if (userPaths) {
			const ubt = userPaths.ubtLocation;
			const uproject = userPaths.projectLocation;
			const projectName = path.basename(uproject, '.uproject')
			const platform = "Win64"
			const configuration = "Development"
			finalCommand = `"${ubt}" ${projectName} ${platform} ${configuration} "${uproject}"`;
			vscode.window.showInformationMessage(`hahiya command dyalk a m3lam ${finalCommand}`);
		}



		async function getFiles() {
			const ubtUri = await vscode.window.showOpenDialog({
				canSelectMany: false, // We only want them to pick one file
				openLabel: 'Select Build.bat',
				title: 'Step 1/2: Select UBT Batch File',

			});

			if (!ubtUri || !ubtUri[0]) {
				return undefined;
			}
			const ubtResult = ubtUri[0].fsPath;


			const projectUri = await vscode.window.showOpenDialog({
				canSelectMany: false,
				openLabel: 'Select .uproject file',
				title: 'step 2/2: Select your Project file',
				Filters: { 'Unreal Projects': ['uproject'] }
			});

			if (!projectUri || !projectUri[0]) {
				return undefined;
			}
			const projectResult = projectUri[0].fsPath;
			return {
				ubtLocation: ubtResult,
				projectLocation: projectResult
			}

		}

		const terminal = vscode.window.createTerminal("UBT Runner");
		terminal.show();
		terminal.sendText(finalCommand);

	});

	const testRunDisposable = vscode.commands.registerCommand('ubt-runner.TestRun', function () {
		BuildUnrealProject();
	});

	context.subscriptions.push(disposable, testRunDisposable);


}



function BuildUnrealProject() {
	vscode.window.showInformationMessage('This is a test message from the Compile button!');
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate,
	BuildUnrealProject
}