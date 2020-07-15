// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IContextualMenuItem } from 'office-ui-fabric-react';
import * as React from 'react';

import { LaunchPanelHeader } from '../components/launch-panel-header';

export class LaunchPanelHeaderClickHandler {
    public onClickLink(
        popupWindow: Window,
        ev?: React.MouseEvent<HTMLElement>,
        item?: IContextualMenuItem,
    ): void {
        if (item == null) {
            return;
        }
        const url: string = item.data;
        popupWindow.open(url);
    }

    public onOpenContextualMenu(header: LaunchPanelHeader, event: React.MouseEvent<any>): void {
        header.setState({
            target: event.currentTarget,
            isContextMenuVisible: true,
        });
    }

    public onDismissFeedbackMenu(header: LaunchPanelHeader, event?: any): void {
        header.setState({ isContextMenuVisible: false });
    }

    public openAdhocToolsPanel(header: LaunchPanelHeader): void {
        header.props.openAdhocToolsPanel();
        header.props.deps.launchPanelHeaderClickHandler.onDismissFeedbackMenu(header);
    }
}
