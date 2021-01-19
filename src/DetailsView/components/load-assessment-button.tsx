// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentDataParser } from 'common/assessment-data-parser';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
import * as React from 'react';

export type LoadAssessmentButtonDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentDataParser: AssessmentDataParser;
    loadAssessmentHelper: LoadAssessmentHelper;
};
export interface LoadAssessmentButtonProps {
    deps: LoadAssessmentButtonDeps;
}

export class LoadAssessmentButton extends React.Component<LoadAssessmentButtonProps> {
    public render(): JSX.Element {
        return (
            <InsightsCommandButton
                iconProps={{ iconName: 'FabricOpenFolderHorizontal' }}
                onClick={() => this.props.deps.loadAssessmentHelper.getAssessmentForLoad()}
            >
                Load assessment
            </InsightsCommandButton>
        );
    }
}
