// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { IpcRenderer, OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';
import { AsyncAction } from 'electron/ipc/async-action';
import {
    IPC_FROMBROWSERWINDOW_CLOSE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME,
    IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME,
    IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME,
    IPC_FROMRENDERER_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME,
    IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
    IPC_FROMRENDERER_SHOW_OPEN_FILE_DIALOG,
} from 'electron/ipc/ipc-channel-names';

export class IpcRendererShim {
    public constructor(private readonly ipcRenderer: IpcRenderer) {}

    private readonly invokeScope: string = 'IpcRendererShim';

    public initialize(): void {
        this.ipcRenderer.on(IPC_FROMBROWSERWINDOW_MAXIMIZE_CHANNEL_NAME, this.onMaximize);
        this.ipcRenderer.on(IPC_FROMBROWSERWINDOW_UNMAXIMIZE_CHANNEL_NAME, this.onUnmaximize);
        this.ipcRenderer.on(
            IPC_FROMBROWSERWINDOW_ENTERFULLSCREEN_CHANNEL_NAME,
            this.onEnterFullScreen,
        );
        this.ipcRenderer.on(IPC_FROMBROWSERWINDOW_CLOSE_CHANNEL_NAME, this.onClose);
    }

    private onMaximize = (): void => {
        this.fromBrowserWindowMaximize.invoke(null, this.invokeScope);
    };

    private onEnterFullScreen = (): void => {
        this.fromBrowserWindowEnterFullScreen.invoke(null, this.invokeScope);
    };

    private onUnmaximize = (): void => {
        this.fromBrowserWindowUnmaximize.invoke(null, this.invokeScope);
    };

    private onClose = async (): Promise<void> => {
        await this.fromBrowserWindowClose.invokeAsync();
        this.closeWindow();
    };

    // Listen to these events to receive data sent TO renderer process
    public readonly fromBrowserWindowClose = new AsyncAction();
    public readonly fromBrowserWindowMaximize = new Action<void>();
    public readonly fromBrowserWindowUnmaximize = new Action<void>();
    public readonly fromBrowserWindowEnterFullScreen = new Action<void>();

    public getAppPath = async (): Promise<string> => {
        return await this.ipcRenderer.invoke(IPC_FROMRENDERER_GET_APP_PATH_CHANNEL_NAME);
    };

    public showOpenFileDialog = async (opts: OpenDialogOptions): Promise<OpenDialogReturnValue> => {
        return await this.ipcRenderer.invoke(IPC_FROMRENDERER_SHOW_OPEN_FILE_DIALOG, opts);
    };

    // Call these methods to send data FROM renderer process
    public initializeWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_MAIN_WINDOW_INITIALIZED_CHANNEL_NAME);
    };

    public maximizeWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_MAXIMIZE_BROWSER_WINDOW_CHANNEL_NAME);
    };

    public minimizeWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_MINIMIZE_BROWSER_WINDOW_CHANNEL_NAME);
    };

    public restoreWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_RESTORE_BROWSER_WINDOW_CHANNEL_NAME);
    };

    public closeWindow = (): void => {
        this.ipcRenderer.send(IPC_FROMRENDERER_CLOSE_BROWSERWINDOW_CHANNEL_NAME);
    };

    public setSizeAndCenterWindow = (sizePayload: SetSizePayload): void => {
        this.ipcRenderer.send(
            IPC_FROMRENDERER_SETSIZEANDCENTER_BROWSER_WINDOW_CHANNEL_NAME,
            sizePayload,
        );
    };
}
