// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { WindowFrameActions } from 'electron/flux/action/window-frame-actions';
import { SetSizePayload } from 'electron/flux/action/window-frame-actions-payloads';

export class WindowFrameActionCreator {
    constructor(private readonly windowFrameActions: WindowFrameActions) {}

    public setWindowSize(size: SetSizePayload): void {
        this.windowFrameActions.setWindowSize.invoke(size);
    }

    public maximize(): void {
        this.windowFrameActions.maximize.invoke();
    }

    public minimize(): void {
        this.windowFrameActions.minimize.invoke();
    }
    public restore(): void {
        this.windowFrameActions.restore.invoke();
    }

    public close(): void {
        this.windowFrameActions.close.invoke();
    }
}
