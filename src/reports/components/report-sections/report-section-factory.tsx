// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommonInstancesSectionDeps } from 'common/components/cards/common-instances-section-props';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { ReactFCWithDisplayName } from 'common/react/named-fc';

import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { CardsViewModel } from '../../../common/types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../../common/types/store-data/user-configuration-store';
import { NotApplicableChecksSectionDeps } from './not-applicable-checks-section';
import { PassedChecksSectionDeps } from './passed-checks-section';

export type SectionDeps = NotApplicableChecksSectionDeps &
    CommonInstancesSectionDeps &
    PassedChecksSectionDeps;

export type SectionProps = {
    deps: SectionDeps;
    fixInstructionProcessor: FixInstructionProcessor;
    description: string;
    toUtcString: (date: Date) => string;
    getCollapsibleScript: () => string;
    getGuidanceTagsFromGuidanceLinks: GetGuidanceTagsFromGuidanceLinks;
    cardsViewData: CardsViewModel;
    userConfigurationStoreData: UserConfigurationStoreData;
    shouldAlertFailuresCount?: boolean;
    scanMetadata: ScanMetadata;
};

export const ResultSectionTypes = {
    failed: 'FailedInstancesSection',
    passed: 'PassedChecksSection',
    notApplicable: 'NotApplicableChecksSection',
};

export type ReportSectionFactory<SectionPropsType = SectionProps> = {
    HeadSection: ReactFCWithDisplayName;
    BodySection: ReactFCWithDisplayName;
    ContentContainer: ReactFCWithDisplayName;
    HeaderSection: ReactFCWithDisplayName<SectionPropsType>;
    TitleSection: ReactFCWithDisplayName;
    SummarySection: ReactFCWithDisplayName<SectionPropsType>;
    DetailsSection: ReactFCWithDisplayName<SectionPropsType>;
    ResultsContainer: ReactFCWithDisplayName<SectionPropsType>;
    FailedInstancesSection: ReactFCWithDisplayName<SectionPropsType>;
    PassedChecksSection: ReactFCWithDisplayName<SectionPropsType>;
    NotApplicableChecksSection: ReactFCWithDisplayName<SectionPropsType>;
    FooterSection: ReactFCWithDisplayName;
    FooterText: ReactFCWithDisplayName<SectionPropsType>;
    resultSectionsOrder: (keyof typeof ResultSectionTypes)[];
};
