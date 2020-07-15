// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import * as React from 'react';
import * as TelemetryEvents from '../common/extension-telemetry-events';
import { TelemetryData, TelemetryEventSource } from '../common/extension-telemetry-events';
import { Message } from '../common/message';
import { Messages } from '../common/messages';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';

export class TargetPageActionMessageCreator {
    constructor(
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly dispatcher: ActionMessageDispatcher,
    ) {}

    public scrollRequested(): void {
        const message: Message = {
            messageType: Messages.Visualizations.Common.ScrollRequested,
        };
        this.dispatcher.dispatchMessage(message);
    }
    public openIssuesDialog(): void {
        const eventData: TelemetryData = {
            source: TelemetryEventSource.TargetPage,
            triggeredBy: 'N/A',
        };
        this.dispatcher.sendTelemetry(TelemetryEvents.ISSUES_DIALOG_OPENED, eventData);
    }

    public setHoveredOverSelector = (selector: string[]): void => {
        const message: Message = {
            messageType: Messages.Inspect.SetHoveredOverSelector,
            payload: selector,
        };
        this.dispatcher.dispatchMessage(message);
    };

    public copyIssueDetailsClicked = (event: React.MouseEvent<any>): void => {
        const telemetryData = this.telemetryFactory.withTriggeredByAndSource(
            event,
            TelemetryEvents.TelemetryEventSource.TargetPage,
        );
        this.dispatcher.sendTelemetry(TelemetryEvents.COPY_ISSUE_DETAILS, telemetryData);
    };

    public openSettingsPanel = (event: React.MouseEvent<HTMLElement>): void => {
        const messageType = Messages.SettingsPanel.OpenPanel;
        const source = TelemetryEventSource.TargetPage;
        const telemetry = this.telemetryFactory.forSettingsPanelOpen(
            event,
            source,
            'fileIssueSettingsPrompt',
        );
        const payload: BaseActionPayload = {
            telemetry,
        };
        const message: Message = {
            messageType: messageType,
            payload,
        };
        this.dispatcher.dispatchMessage(message);
    };
}
