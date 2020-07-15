// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import * as React from 'react';

export type TargetPageHiddenBarProps = {
    isTargetPageHidden: boolean;
};

export const TargetPageHiddenBar = NamedFC<TargetPageHiddenBarProps>(
    'TargetPageHiddenBar',
    props => {
        if (!props.isTargetPageHidden) {
            return null;
        }

        return (
            <MessageBar messageBarType={MessageBarType.warning}>
                The Target page is in a hidden state. For better performance, use the Target page
                link above to make the page visible.
            </MessageBar>
        );
    },
);
