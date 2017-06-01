import * as vscode from 'vscode';
import * as path from 'path';

export class GoToFilePosition {
    textFile: string;
    textPosition: vscode.Position;
}

export class GoToSymbolStack {
    crtStackIndex = 0;
    maxStackIndex = 0;
    filePosStack: GoToFilePosition[] = [];

    private _statusBarItem: vscode.StatusBarItem;
    constructor() {
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }
        /* get the current text editor */
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        this.updateCurrent();
        this._statusBarItem.show();
    }

    getRelativePath(filePath: string) {
        if (!path.isAbsolute(filePath)) {
            // path invalid so ignore
            return "(invalid) " + filePath;
        }
        if (filePath.indexOf(vscode.workspace.rootPath) == 0) {
            filePath = path.relative(vscode.workspace.rootPath, filePath);
        }

        return filePath;
    }

    updateToolTip() {
        let tooltip = "";
        let stackCnt = 1;
        this.filePosStack.forEach(filePos => {
            tooltip = (stackCnt++) + ") " + this.getRelativePath(filePos.textFile) + " (" + filePos.textPosition.line + ")" + "\n" + tooltip;
        });
        this._statusBarItem.tooltip = tooltip; 
    }

    updateCurrent() {
        if (this.crtStackIndex > 0) {
            this._statusBarItem.text = "Stack: " + this.getRelativePath(this.filePosStack[this.crtStackIndex - 1].textFile) + " (" + this.crtStackIndex + "/" + this.maxStackIndex + ")"; 
        } else {
            this._statusBarItem.text = "Stack: " + this.crtStackIndex + "/" + this.maxStackIndex;
        }
    }
    goToFilePosition(vStackIdx: number) {
        if (vscode.window.activeTextEditor.document.fileName === this.filePosStack[vStackIdx].textFile) {
            vscode.window.activeTextEditor.selection = new vscode.Selection(this.filePosStack[vStackIdx].textPosition, this.filePosStack[vStackIdx].textPosition);
        } else {
            vscode.workspace.openTextDocument( this.filePosStack[vStackIdx].textFile )
                .then( ( doc ) => {
                        return vscode.window.showTextDocument( doc );
                    } )
                .then( textEditor => {
                        textEditor.selection = new vscode.Selection(this.filePosStack[vStackIdx].textPosition, this.filePosStack[vStackIdx].textPosition);
                    } );
        }
        vscode.window.activeTextEditor.revealRange(new vscode.Range(this.filePosStack[vStackIdx].textPosition,
                    this.filePosStack[vStackIdx].textPosition), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    }
    saveFilePosition(vTextEditor: vscode.TextEditor, vStackIdx: number) {
        this.filePosStack[vStackIdx] = new GoToFilePosition();
        this.filePosStack[vStackIdx].textFile = vTextEditor.document.fileName;
        this.filePosStack[vStackIdx].textPosition = vTextEditor.selection.active;
        this.updateToolTip();
    }
    logFilePosition(vTextMsg: string, vStackIdx: number) {
        return;
        /**
        console.log("GoToSymbolStack - " + vTextMsg + ": " + JSON.stringify(this.filePosStack[vStackIdx].textFile)
                + " : " + JSON.stringify(this.filePosStack[vStackIdx].textPosition));
        **/
    }
    testTopFilePosition(vTextEditor: vscode.TextEditor) {
        /* if same postion as previous one, return true, otherwise false */
        if (this.crtStackIndex<=0) {
            return false;
        }
        if ((this.filePosStack[this.crtStackIndex-1].textFile !== vTextEditor.document.fileName)
                || (this.filePosStack[this.crtStackIndex-1].textPosition !== vTextEditor.selection.active)) {
            return false;
        }
        return true;
    }
    clearFilePosStack() {
        this.filePosStack = [];
        this.crtStackIndex = 0;
        this.maxStackIndex = 0;
        this.updateCurrent();
    }
    showCrtStackIndex() {
        vscode.window.showInformationMessage("GoToSymbolStack: (" + this.crtStackIndex + ":" + this.maxStackIndex + ")")
    }
    goToSymbolDeclaration(crtTextEditor: vscode.TextEditor) {
        let nextIdx = this.crtStackIndex + 1;
        if(this.testTopFilePosition(crtTextEditor)) {
            this.logFilePosition("stop to", this.crtStackIndex - 1);
            vscode.commands.executeCommand('editor.action.goToDeclaration');
            return;
        }
        this.saveFilePosition(crtTextEditor, this.crtStackIndex);
        this.logFilePosition("jump to", this.crtStackIndex);
        vscode.commands.executeCommand('editor.action.goToDeclaration');
        /* update stack index details only if position changed */
        if (nextIdx >= 100) {
            /* todo: shift back items */
            nextIdx = 100;
        }
        if (this.maxStackIndex < nextIdx) {
            this.maxStackIndex = nextIdx;
        }
        this.crtStackIndex = nextIdx;

        this.updateCurrent();
    }
    goPrevOnStack() {
        if(this.crtStackIndex<=0) {
            return;
        }
        this.goToFilePosition(this.crtStackIndex - 1);
        this.logFilePosition("prev to", this.crtStackIndex - 1);
        this.crtStackIndex = this.crtStackIndex - 1;
        this.updateCurrent();
    }
    goNextOnStack() {
        if(this.crtStackIndex>=this.maxStackIndex) {
            return;
        }
        this.goToFilePosition(this.crtStackIndex);
        this.logFilePosition("next to", this.crtStackIndex);
        this.crtStackIndex = this.crtStackIndex + 1;
        this.updateCurrent();
    }
    applyTextChanges(changes: vscode.TextDocumentChangeEvent) {
        const textEditor = vscode.window.activeTextEditor;
        const textDocument = changes.document;
        changes.contentChanges.forEach(change => {
            console.log(change);
            // check if changes happened in a text editor
            let saveFilePosStack = this.filePosStack
                .filter((point, i) => point && point.textFile === textDocument.fileName)
                .filter(point => change.range.start.line < point.textPosition.line);
            let lines = change.text.split("\n");
            let lineDiference = Math.max(lines.length - 1, 0);

            saveFilePosStack.forEach(point => {
                point.textPosition = point.textPosition.with(point.textPosition.line + lineDiference + (change.range.start.line - change.range.end.line))
            })
        });
    }
}