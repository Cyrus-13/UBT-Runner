// hada hir vscode lib mstoriya f const variabl
const vscode = require('vscode');
const path = require('path');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "ubt-runner" is now active!');

	// The command has been defined in the package.json file
	const disposable = vscode.commands.registerCommand('ubt-runner.RunUBT', async function () {
		// The code you place here will be executed every time your command is executed

		//wlkin 9bal mt ruunna lcommand hy5ssni n geti user UBT location
		//(hnst3ml user input f bdya wlkin n9d nrdha ka dedicta automatcly mnb3d)
		const userPaths = await getFiles();
		if (userPaths){
				const ubt = userPaths.ubtLocation;
				const uproject = userPaths.projectLocation;
				const projectName = path.basename(uproject,'.uproject')
				const platform = "Win64"
				const configuration = "Development"
				const finalCommand = `"${ubt}" ${projectName} ${platform} ${configuration} "${uproject}"`;
				vscode.window.showInformationMessage(`hahiya command dyalk a m3lam ${finalCommand}`);
			}

		async function getFiles() {
			const ubtUri =await vscode.window.showOpenDialog({
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
        		Filters: {'Unreal Projects' : ['uproject']}
    		});
    
    		if (!projectUri || !projectUri[0]){
				return undefined;
			} 
			const projectResult = projectUri[0].fsPath;
			return{
				ubtLocation: ubtResult,
				projectLocation: projectResult
			}
 
		}

		
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}