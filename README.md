# UBT-Runner

UBT-Runner is a powerful and lightweight Visual Studio Code extension designed for Unreal Engine developers. It streamlines the process of compiling your Unreal Engine projects directly from the VS Code environment, bypassing the need to have Unreal Editor open or manually configuring complex build scripts.

## Features

* **Quick Compile Button**: A convenient play button in the editor navigation area to trigger builds using your default configuration.
* **Auto-generated Debug Configurations**: Detects `.uproject` files in your workspace and automatically scaffolds a `launch.json` file populated with targets for Development, Debug, DebugGame, Test, and Shipping configurations.
* **Dedicated Output Channel**: Monitors the output of `UnrealBuildTool` in real-time inside the `UBT Runner` Output tab.
* **Native Progress Display**: View compile progress dynamically within native VS Code notifications.
* **Clean Cancellation**: Cancel running compile tasks smoothly directly from the progress notification.
* **Post-Build Auto Launch**: Automatically spawn your `.uproject` file if the build finishes successfully (configurable).
* **Automated File Saving**: Saves all your unsaved workspace files whenever a build is initiated (configurable).

## Getting Started

1. **Install the Extension**.
2. **Open your Unreal Engine project folder** in Visual Studio Code.
3. Upon first activation, the extension will ask you to **select your Unreal Engine Installation Directory**. Provide the root folder of your UE installation.
4. Use the automatically generated `.vscode/launch.json` entries to build your game via the Run & Debug panel, or click the **Compile** button in the top right of your open files.

## Requirements

* **Unreal Engine**: Ensure you have Unreal Engine installed natively.
* **C++ Workloads**: Required prerequisites to compile engine codes and headers, usually bundled within Visual Studio or appropriate developer tools depending on your platform.

## Credits
- [Cyrus](https://github.com/Cyrus-13)
