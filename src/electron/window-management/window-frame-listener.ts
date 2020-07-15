// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IpcRendererShim } from 'electron/ipc/ipc-renderer-shim';
import { WindowStateActionCreator } from '../flux/action-creator/window-state-action-creator';

export class WindowFrameListener {
    constructor(
        private readonly windowStateActionsCreator: WindowStateActionCreator,
        private readonly ipcRendererShim: IpcRendererShim,
    ) {}

    public initialize(): void {
        this.ipcRendererShim.fromBrowserWindowEnterFullScreen.addListener(this.onEnterFullScreen);
        this.ipcRendererShim.fromBrowserWindowMaximize.addListener(this.onMaximize);
        this.ipcRendererShim.fromBrowserWindowUnmaximize.addListener(this.onUnMaximize);
    }

    private onMaximize = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'maximized' });
    };

    private onEnterFullScreen = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'fullScreen' });
    };

    private onUnMaximize = (): void => {
        this.windowStateActionsCreator.setWindowState({ currentWindowState: 'customSize' });
    };
}
