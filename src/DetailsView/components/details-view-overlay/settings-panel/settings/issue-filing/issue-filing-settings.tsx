// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { IssueFilingSettingsContainer } from 'issue-filing/components/issue-filing-settings-container';
import * as React from 'react';
import { SettingsProps } from '../settings-props';

export const issueFilingTitleId = 'issue-filing-heading';

export const IssueFilingSettings = NamedFC<SettingsProps>('IssueFilingSettings', props => {
    const { deps, userConfigurationStoreState } = props;
    const { issueFilingServiceProvider, userConfigMessageCreator } = deps;
    const selectedIssueFilingService = issueFilingServiceProvider.forKey(
        userConfigurationStoreState.bugService,
    );
    const selectedIssueFilingServiceData = selectedIssueFilingService.getSettingsFromStoreData(
        userConfigurationStoreState.bugServicePropertiesMap,
    );

    return (
        <>
            <h3 id={issueFilingTitleId}>Issue filing</h3>
            <IssueFilingSettingsContainer
                deps={deps}
                selectedIssueFilingService={selectedIssueFilingService}
                selectedIssueFilingServiceData={selectedIssueFilingServiceData}
                onPropertyUpdateCallback={userConfigMessageCreator.setIssueFilingServiceProperty}
                onSelectedServiceChange={userConfigMessageCreator.setIssueFilingService}
            />
        </>
    );
});
