// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AndroidSetupStepId } from 'electron/platform/android/setup/android-setup-step-id';
import { rightFooterButtonAutomationId } from 'electron/views/device-connect-view/components/android-setup/android-setup-step-layout';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { SpectronAsyncClient } from 'tests/electron/common/view-controllers/spectron-async-client';
import { ViewController } from './view-controller';

export class AndroidSetupViewController extends ViewController {
    constructor(client: SpectronAsyncClient) {
        super(client);
    }

    public async waitForDialogVisible(dialogStep: AndroidSetupStepId): Promise<void> {
        await this.waitForSelector(getAutomationIdSelector(`${dialogStep}-content`), 20000);
    }

    // validates and starts scanning
    public async startTesting(): Promise<void> {
        await this.client.waitForEnabled(getAutomationIdSelector(rightFooterButtonAutomationId));
        await this.client.click(getAutomationIdSelector(rightFooterButtonAutomationId));
    }
}
