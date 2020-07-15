// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { detailsViewCommandButtons } from 'DetailsView/components/details-view-command-bar.scss';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { StartOverDeps } from 'DetailsView/components/start-over-dropdown';
import { ITooltipHostStyles, Link, TooltipHost } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';

import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { CommandBarButtonsMenu } from 'DetailsView/components/command-bar-buttons-menu';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { StartOverFactoryProps } from 'DetailsView/components/start-over-component-factory';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import * as styles from './details-view-command-bar.scss';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';
import { ReportExportComponentDeps } from './report-export-component';

export type DetailsViewCommandBarDeps = {
    getCurrentDate: () => Date;
    reportGenerator: ReportGenerator;
    getDateFromTimestamp: (timestamp: string) => Date;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & ReportExportComponentDeps &
    StartOverDeps;

export type CommandBarProps = DetailsViewCommandBarProps;

export type ReportExportComponentFactory = (props: CommandBarProps) => JSX.Element;

export type StartOverComponentFactory = (props: StartOverFactoryProps) => JSX.Element;

export interface DetailsViewCommandBarProps {
    deps: DetailsViewCommandBarDeps;
    featureFlagStoreData: FeatureFlagStoreData;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
    assessmentsProvider: AssessmentsProvider;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    visualizationStoreData: VisualizationStoreData;
    visualizationScanResultData: VisualizationScanResultData;
    cardsViewData: CardsViewModel;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    scanMetadata: ScanMetadata;
    narrowModeStatus: NarrowModeStatus;
}

export class DetailsViewCommandBar extends React.Component<DetailsViewCommandBarProps> {
    public render(): JSX.Element {
        if (this.props.tabStoreData.isClosed) {
            return null;
        }

        return (
            <div className={styles.detailsViewCommandBar}>
                {this.renderTargetPageInfo()}
                {this.renderFarItems()}
            </div>
        );
    }

    private renderTargetPageInfo(): JSX.Element {
        const targetPageTitle: string = this.props.scanMetadata.targetAppInfo.name;
        const tooltipContent = `Switch to target page: ${targetPageTitle}`;
        const hostStyles: Partial<ITooltipHostStyles> = {
            root: { display: 'inline-block', minWidth: 0 },
        };
        return (
            <div className={styles.detailsViewTargetPage} aria-labelledby="switch-to-target">
                <span id="switch-to-target">Target page:&nbsp;</span>
                <TooltipHost content={tooltipContent} styles={hostStyles}>
                    <Link
                        role="link"
                        className={css('insights-link', styles.targetPageLink)}
                        onClick={this.props.deps.detailsViewActionMessageCreator.switchToTargetTab}
                        aria-label={tooltipContent}
                    >
                        <span className={styles.targetPageTitle}>{targetPageTitle}</span>
                    </Link>
                </TooltipHost>
            </div>
        );
    }

    private renderFarItems(): JSX.Element {
        if (this.props.narrowModeStatus.isCommandBarCollapsed) {
            return this.renderCommandButtonsMenu();
        } else {
            return this.renderCommandButtons();
        }
    }

    private renderCommandButtons(): JSX.Element {
        const reportExportElement: JSX.Element = this.renderExportComponent();
        const startOverElement: JSX.Element = this.renderStartOverComponent();

        if (reportExportElement || startOverElement) {
            return (
                <div className={detailsViewCommandButtons}>
                    {reportExportElement}
                    {startOverElement}
                </div>
            );
        }

        return null;
    }

    private renderCommandButtonsMenu(): JSX.Element {
        return <CommandBarButtonsMenu {...this.props} />;
    }

    private renderExportComponent(): JSX.Element {
        return this.props.switcherNavConfiguration.ReportExportComponentFactory(this.props);
    }

    private renderStartOverComponent(): JSX.Element {
        const startOverFactoryProps: StartOverFactoryProps = {
            ...this.props,
            dropdownDirection: 'down',
        };
        return this.props.switcherNavConfiguration.StartOverComponentFactory(startOverFactoryProps);
    }
}
