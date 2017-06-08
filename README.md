# GoTo-Symbol-Stack VSCode Extension

Extension for Visual Studio Code (VSCode) editor to jump to symbol (function, variable, ...) declaration, track the positions in a stack, navigate back and forth.

It is relying on the same function used natively by VSCode to jump to the symbol (the one with default key `F12`), but the native jump back (default `Cmd/Ctrl+-`) is tracking differently the positions (eg., storing when editing or when scrolling and making a short break), therefore this module provides an alternative, storing the positions only when jump to symbol is triggered.

The behaviour is somehow similar to jumping to `ctags` symbols in `Vim` editor and back to initial position (however, to make it clear, this extension does not require `ctags` at all).

The code for this extension is hosted at:

  * https://github.com/miconda/vscode-goto-symbol-stack

## Features

The navigation operations are:

  * **jump to symbol** (go to declaration) - `Alt+]` - save current position on top of the stack and jump to symbol definition
  * **go to previous position** (down on stack) - `Alt+[` - jump to previous position saved in stack
  * **got to next position** (up on stack) - `Alt+Shift+]` - jump to next position save in stack

Note: for MacOS, use `Option` key instead of `Alt`.

A screenshot while jumping to declaration of symbols and back with this extension enabled:

![Usage Example](https://raw.githubusercontent.com/miconda/vscode-goto-symbol-stack/master/images/vscode-goto-symbol-stack.gif)

### Navigation Notes

The position is saved on stack only when pressing `Alt+]`. It is not saving the position when being on top of the stack and pressing `Alt+[` (go back), so navigation forward (`Alt+Shift+]`) goes up to the position when last `Alt+]` was pressed, not to the postion where cursor jumped after pressing last `Alt+]`.

If there is no symbol at the position when `Alt+]` is pressed, the position is saved on top of the stack, so it can be used to keep track of other wanted placed in edited files.

## Requirements

Initial version has been developed using VSCode v1.11.2, but it should work for earlier versions.

## Extension Settings

Following VSCode commands with key bindings are exported by this extension.

```
    {
        "command": "extension.goto-symbol-stack.goToSymbolDeclaration",
        "key": "alt+]"
    },
    {
        "command": "extension.goto-symbol-stack.goPrevOnStack",
        "key": "alt+["
    },
    {
        "command": "extension.goto-symbol-stack.goNextOnStack",
        "key": "alt+shift+]"
    }
```

Key bindings can be changed via VSCode preferences.

All the VSCommands exported by this extension are presented next.

```
    {
        "command": "extension.goto-symbol-stack.goToSymbolDeclaration",
        "title": "GoToSymbolStack: goToSymbolDeclaration - save position on top of the stack and go to symbol declaration"
    },
    {
        "command": "extension.goto-symbol-stack.goPrevOnStack",
        "title": "GoToSymbolStack: goPrevOnStack - go to previous position in stack"
    },
    {
        "command": "extension.goto-symbol-stack.goNextOnStack",
        "title": "GoToSymbolStack: goNextOnStack - go to next position in stack"
    },
    {
        "command": "extension.goto-symbol-stack.clearFilePosStack",
        "title": "GoToSymbolStack: clearFilePosStack - empty the file positions stack"
    }
```

## Installation

The extension is published on VSCode Marketplace at:

  * https://marketplace.visualstudio.com/items?itemName=miconda.goto-symbol-stack

To install it from the marketplace, launch VS Code Quick Open (`Cmd+P` or `⌘+P`), paste the following command, and press enter.

```
ext install goto-symbol-stack
```

To install from Git repository, clone it to your account VSCode folder (on MacOS or Linux, that is `~/.vscode/extensions`):

```
cd ~/.vscode/extensions
git clone https://github.com/miconda/vscode-goto-symbol-stack
```

The extension needs to be enabled from VSCode preferences.

## Known Issues

Tested only on MacOS on files with C code.

## ToDo

  * command to show details of the positions stored in the stack
  * ...

Contributions are welcome, use Github.com pull requests of the project:

  * https://github.com/miconda/vscode-goto-symbol-stack

## Developers

Initial Author:

  * Daniel-Constantin Mierla ([@miconda](https://github.com/miconda))

Contributors:

  * [@newro](https://github.com/newro)

## Copyright

Daniel-Constantin Mierla (asipto.com)

License: MIT

## Release Notes

### 1.1.0 (2017-06-08)

  * added the ability to save and load stack information for workspace
  * improved multi-editor group behavior
  * support to move stack info with multiple view column

For release notes of older versions, see [CHANGELOG.md](https://github.com/miconda/vscode-goto-symbol-stack/blob/master/CHANGELOG.md) file.

**Enjoy!**
