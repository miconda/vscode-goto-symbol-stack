'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {GoToSymbolStack} from './gotosymbolstack';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let goToSymbolStack = new GoToSymbolStack();

    context.subscriptions.push(vscode.commands.registerCommand('extension.goto-symbol-stack.goToSymbolDeclaration',
                    () => goToSymbolStack.goToSymbolDeclaration(vscode.window.activeTextEditor)));
    context.subscriptions.push(vscode.commands.registerCommand('extension.goto-symbol-stack.goPrevOnStack',
                    () => goToSymbolStack.goPrevOnStack()));
    context.subscriptions.push(vscode.commands.registerCommand('extension.goto-symbol-stack.goNextOnStack',
                    () => goToSymbolStack.goNextOnStack()));
    context.subscriptions.push(vscode.commands.registerCommand('extension.goto-symbol-stack.clearFilePosStack',
                    () => goToSymbolStack.clearFilePosStack()));
    vscode.workspace.onDidChangeTextDocument((textChanges) => { goToSymbolStack.applyTextChanges(textChanges); } );
}

// this method is called when your extension is deactivated
export function deactivate() {
}
