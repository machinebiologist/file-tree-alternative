import { ItemView, TFile, WorkspaceLeaf, App, Menu, TFolder } from 'obsidian';
import React from 'react';
import ReactDOM from 'react-dom';
import FileTreeAlternativePlugin from './main';
import { FileTreeComponent } from './components/FileTreeComponent';

export const VIEW_TYPE = 'file-tree-view';
export const VIEW_DISPLAY_TEXT = 'File Tree View';
export const ICON = 'sheets-in-box';

export class FileTreeView extends ItemView {

    plugin: FileTreeAlternativePlugin;
    currentFolderPath: string;

    constructor(leaf: WorkspaceLeaf, plugin: FileTreeAlternativePlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return VIEW_DISPLAY_TEXT;
    }

    getIcon(): string {
        return ICON;
    }

    async onClose() {
        ReactDOM.unmountComponentAtNode(this.contentEl);
    }

    async onOpen(): Promise<void> {
        ReactDOM.unmountComponentAtNode(this.contentEl);
        this.constructFileTree(this.app.vault.getRoot().path);
    }

    getFilesUnderPath = (path: string, app: App): TFile[] => {
        var filesUnderPath: TFile[] = [];
        recursiveFx(path, app);
        function recursiveFx(path: string, app: App) {
            var folderObj = app.vault.getAbstractFileByPath(path);
            if (folderObj instanceof TFolder && folderObj.children) {
                for (let child of folderObj.children) {
                    if (child instanceof TFile) filesUnderPath.push(child);
                    if (child instanceof TFolder) recursiveFx(child.path, app);
                }
            }
        }
        return filesUnderPath;
    }

    // addContextMenu = () => {
    //     var nodes = document.querySelectorAll('.oz-nav-file');
    //     if (nodes) {
    //         nodes.forEach(node => {
    //             node.addEventListener("contextmenu", (event: MouseEvent) => {
    //                 event.preventDefault();
    //                 const fileMenu = new Menu(this.app);
    //                 const file = this.app.vault.getAbstractFileByPath(node.getAttr('data-path'));
    //                 this.app.workspace.trigger(
    //                     "file-menu",
    //                     fileMenu,
    //                     file,
    //                     "my-context-menu",
    //                     null
    //                 );
    //                 fileMenu.showAtPosition({ x: event.pageX, y: event.pageY });
    //                 return false;
    //             },
    //                 false
    //             );
    //         })
    //     }
    // }

    constructFileTree(folderPath: string, vaultChange?: boolean) {
        var files: TFile[] = [];
        if (vaultChange) {
            files = this.getFilesUnderPath(this.currentFolderPath, this.app);
        } else {
            files = this.getFilesUnderPath(folderPath, this.app);
            this.currentFolderPath = folderPath;
        }
        ReactDOM.unmountComponentAtNode(this.contentEl);
        ReactDOM.render(
            <FileTreeComponent
                files={files}
                app={this.app}
                folderPath={this.currentFolderPath}
            />,
            this.contentEl
        );
    }

}