// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { CardsViewModel } from 'common/types/store-data/card-view-model';

import {
    ScanMetadata,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { CommandBarButtonsMenu } from 'DetailsView/components/command-bar-buttons-menu';
import { detailsViewCommandButtons } from 'DetailsView/components/details-view-command-bar.scss';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { ExportDialogDeps } from 'DetailsView/components/export-dialog';
import {
    LoadAssessmentButton,
    LoadAssessmentButtonProps,
    LoadAssessmentButtonDeps,
} from 'DetailsView/components/load-assessment-button';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { ReportExportButton } from 'DetailsView/components/report-export-button';
import { ReportExportDialogFactoryProps } from 'DetailsView/components/report-export-dialog-factory';
import {
    SaveAssessmentFactoryDeps,
    SaveAssessmentFactoryProps,
} from 'DetailsView/components/save-assessment-factory';
import { ShouldShowReportExportButtonProps } from 'DetailsView/components/should-show-report-export-button';
import { StartOverFactoryDeps } from 'DetailsView/components/start-over-component-factory';
import {
    dialogClosedState,
    StartOverDialog,
    StartOverDialogProps,
    StartOverDialogState,
    StartOverDialogType,
} from 'DetailsView/components/start-over-dialog';
import { IButton, ITooltipHostStyles, Link, TooltipHost } from 'office-ui-fabric-react';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { AssessmentStoreData } from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import * as styles from './details-view-command-bar.scss';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';

export type DetailsViewCommandBarDeps = {
    getCurrentDate: () => Date;
    reportGenerator: ReportGenerator;
    getDateFromTimestamp: (timestamp: string) => Date;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & ExportDialogDeps &
    SaveAssessmentFactoryDeps &
    StartOverFactoryDeps &
    LoadAssessmentButtonDeps;

export type CommandBarProps = DetailsViewCommandBarProps;

export type DetailsViewCommandBarState = {
    isReportExportDialogOpen: boolean;
    startOverDialogState: StartOverDialogState;
};

export type ReportExportDialogFactory = (props: ReportExportDialogFactoryProps) => JSX.Element;

export type SaveAssessmentFactory = (props: SaveAssessmentFactoryProps) => JSX.Element;

export interface DetailsViewCommandBarProps {
    deps: DetailsViewCommandBarDeps;
    featureFlagStoreData: FeatureFlagStoreData;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
    assessmentsProvider: AssessmentsProvider;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    visualizationStoreData: VisualizationStoreData;
    unifiedScanResultStoreData: UnifiedScanResultStoreData;
    cardsViewData: CardsViewModel;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    scanMetadata: ScanMetadata;
    narrowModeStatus: NarrowModeStatus;
    visualizationConfigurationFactory: VisualizationConfigurationFactory;
    selectedTest: VisualizationType;
}
export class DetailsViewCommandBar extends React.Component<
    DetailsViewCommandBarProps,
    DetailsViewCommandBarState
> {
    public exportDialogCloseFocus?: IButton;
    public startOverDialogCloseFocus?: IButton;

    public constructor(props) {
        super(props);
        this.state = {
            isReportExportDialogOpen: false,
            startOverDialogState: 'none',
        };
    }

    public render(): JSX.Element {
        if (this.props.tabStoreData.isClosed) {
            return null;
        }

        return (
            <div className={styles.detailsViewCommandBar} role="region" aria-label="command bar">
                {this.renderTargetPageInfo()}
                {this.renderFarItems()}
                {this.renderExportDialog()}
                {this.renderStartOverDialog()}
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
                <NewTabLinkWithTooltip
                    tooltipContent={tooltipContent}
                    role="link"
                    className={styles.targetPageLink}
                    onClick={this.props.deps.detailsViewActionMessageCreator.switchToTargetTab}
                    aria-label={tooltipContent}
                >
                    <span className={styles.targetPageTitle}>{targetPageTitle}</span>
                </NewTabLinkWithTooltip>
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
        const reportExportElement: JSX.Element = this.renderExportButton();
        const startOverElement: JSX.Element = this.renderStartOverButton();
        const saveAssessmentElement: JSX.Element | null = this.renderSaveAssessmentButton();
        const loadAssessmentElement: JSX.Element | null = this.renderLoadAssessmentButton();

        if (
            reportExportElement ||
            saveAssessmentElement ||
            loadAssessmentElement ||
            startOverElement
        ) {
            return (
                <div className={detailsViewCommandButtons}>
                    {reportExportElement}
                    {saveAssessmentElement}
                    {loadAssessmentElement}
                    {startOverElement}
                </div>
            );
        }

        return null;
    }

    private renderCommandButtonsMenu(): JSX.Element {
        return (
            <CommandBarButtonsMenu
                renderExportReportButton={this.renderExportButton}
                renderSaveAssessmentButton={this.renderSaveAssessmentButton}
                renderLoadAssessmentButton={this.renderLoadAssessmentButton}
                featureFlagStoreData={this.props.featureFlagStoreData}
                getStartOverMenuItem={this.getStartOverMenuItem}
                buttonRef={ref => {
                    this.exportDialogCloseFocus = ref;
                    this.startOverDialogCloseFocus = ref;
                }}
            />
        );
    }

    private showReportExportDialog = () => this.setState({ isReportExportDialogOpen: true });

    private dismissReportExportDialog = () => this.setState({ isReportExportDialogOpen: false });

    private focusReportExportButton = () => this.exportDialogCloseFocus?.focus();

    private renderExportButton = () => {
        const shouldShowReportExportButtonProps: ShouldShowReportExportButtonProps = {
            visualizationConfigurationFactory: this.props.visualizationConfigurationFactory,
            selectedTest: this.props.selectedTest,
            unifiedScanResultStoreData: this.props.unifiedScanResultStoreData,
            visualizationStoreData: this.props.visualizationStoreData,
        };

        const showButton = this.props.switcherNavConfiguration.shouldShowReportExportButton(
            shouldShowReportExportButtonProps,
        );

        if (!showButton) {
            return null;
        }
        return (
            <ReportExportButton
                showReportExportDialog={this.showReportExportDialog}
                buttonRef={ref => (this.exportDialogCloseFocus = ref)}
            />
        );
    };

    private renderExportDialog(): JSX.Element {
        return this.props.switcherNavConfiguration.ReportExportDialogFactory({
            ...this.props,
            isOpen: this.state.isReportExportDialogOpen,
            dismissExportDialog: this.dismissReportExportDialog,
            afterDialogDismissed: this.focusReportExportButton,
        });
    }

    private renderSaveAssessmentButton = (): JSX.Element | null => {
        if (this.props.featureFlagStoreData.saveAndLoadAssessment) {
            return this.props.switcherNavConfiguration.SaveAssessmentFactory({
                ...this.props,
            });
        }
        return null;
    };

    private renderLoadAssessmentButton = (): JSX.Element | null => {
        if (this.props.featureFlagStoreData.saveAndLoadAssessment) {
            return <LoadAssessmentButton {...this.props} />;
        }
        return null;
    };

    private showStartOverDialog = (dialogState: StartOverDialogType) => {
        this.setState({ startOverDialogState: dialogState });
    };

    private dismissStartOverDialog = () => {
        this.setState({ startOverDialogState: dialogClosedState });
    };

    private startOverDialogClosed(state: DetailsViewCommandBarState): boolean {
        return state.startOverDialogState === 'none';
    }

    public componentDidUpdate(prevProps, prevState): void {
        // Setting focus after closing the Report Export dialog is handled in the
        // afterDialogDismissed prop, which is called after the closing animation.
        // Since the start over dialog does not play the closing animation (due
        // to flickering issues), we set focus here instead.
        if (this.startOverDialogClosed(this.state) && !this.startOverDialogClosed(prevState)) {
            this.startOverDialogCloseFocus?.focus();
        }
    }

    private renderStartOverButton = () => {
        const startOverProps = this.getStartOverProps();
        const startOverComponentFactory = this.props.switcherNavConfiguration
            .StartOverComponentFactory;
        return startOverComponentFactory.getStartOverComponent(startOverProps);
    };

    private getStartOverMenuItem = () => {
        const startOverProps = this.getStartOverProps();
        const startOverComponentFactory = this.props.switcherNavConfiguration
            .StartOverComponentFactory;
        return startOverComponentFactory.getStartOverMenuItem(startOverProps);
    };

    private getStartOverProps = () => {
        return {
            ...this.props,
            openDialog: this.showStartOverDialog,
            buttonRef: ref => (this.startOverDialogCloseFocus = ref),
        };
    };

    private renderStartOverDialog(): JSX.Element {
        const dialogProps: StartOverDialogProps = {
            ...this.props,
            dialogState: this.state.startOverDialogState,
            dismissDialog: this.dismissStartOverDialog,
        };

        return <StartOverDialog {...dialogProps} />;
    }
}
