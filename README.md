<img src="https://github.com/Meshredded/robusta/blob/vs-tasks-swing-terminal/img/upec.png?raw=true" alt="upec" width="200"/>

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/meshredded.robusta.svg "Current Release")](https://marketplace.visualstudio.com/items?itemName=meshredded.robusta)
[![Marketplace Version](https://vsmarketplacebadge.apphb.com/installs/meshredded.robusta.svg "Installs")](https://marketplace.visualstudio.com/items?itemName=meshredded.robusta)
[![CircleCI](https://circleci.com/gh/Meshredded/vscode-robusta/tree/master.svg?style=svg)](https://circleci.com/gh/Meshredded/vscode-robusta/tree/master)
# Robusta for Visual Studio Code
This extension provides full Robusta language support for vscode (Code colorization, Formatting, Code execution, Theme, Snippets ...).


# FEATURES
## 1 - Robusta Code Execution :
The extension provides the compile command on right click on .jvs files and run command on clicking on .jar archives.

![](https://user-images.githubusercontent.com/10856604/68254605-3326dc80-002b-11ea-9e00-e4aa701e7773.png)
![](https://user-images.githubusercontent.com/10856604/68254606-3326dc80-002b-11ea-8995-821b717c2999.png)

## 2 - Problem Matcher :
The extension provides a problem matcher to detect compilation errors and display them directly on the editor.

![](https://user-images.githubusercontent.com/10856604/68254838-f0b1cf80-002b-11ea-8ea1-3cd6b316102d.png)

## 3 - Code Formatting / Colorization :
The extension provides the Robusta language configuration that makes code colorizing possible on vscode and a strong code formatter.

![](https://user-images.githubusercontent.com/10856604/68626974-e2a4f880-04dc-11ea-84b3-b18ed8da975f.gif)

## 4 - Code Snippets :
The extension provides some code snippets to auto-complete your code.

![](https://user-images.githubusercontent.com/10856604/68626502-c8b6e600-04db-11ea-8905-d6009420cbe2.gif)

## 5 - File Icon Theme :
The extension provides a set of file icons based on the famous Seti file icon theme.

![](https://user-images.githubusercontent.com/10856604/67438724-8bee8200-f5f4-11e9-94df-dff3d06a3877.png)



## Extension Settings
```json
{
    "robusta.jdkHomePath": "path/to/jdk/home",
    "robusta.path": "path/to/robusta.jar",
    "robusta.formatOnSave": true,
    "robusta.compileOnSave": false
}
```
> Find out about robusta.jar [here.](https://github.com/Meshredded/robusta)

> Examples for `robusta.jdkHomePath` values :  
mac : `/Library/Java/JavaVirtualMachines/jdk1.8.0_162.jdk/Contents/Home`  
windows : `C:\Program Files\Java\jdk1.8.0_162`

## License
This software is released under the terms of the MIT license.
