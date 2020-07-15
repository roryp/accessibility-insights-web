// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { buildTestStepsFromRules } from 'assessments/automated-checks/build-test-steps-from-rules';
import { InstanceTableColumn } from 'assessments/types/instance-table-column';
import { Requirement } from 'assessments/types/requirement';
import { InstanceIdentifierGenerator } from 'background/instance-identifier-generator';
import { isMatch } from 'lodash';
import * as React from 'react';
import { It, Mock, MockBehavior, Times } from 'typemoq';
import { HyperlinkDefinition } from 'views/content/content-page';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import { Messages } from '../../../../../common/messages';
import { TelemetryDataFactory } from '../../../../../common/telemetry-data-factory';
import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import {
    AssessmentInstanceRowData,
    AssessmentInstanceTable,
} from '../../../../../DetailsView/components/assessment-instance-table';
import { RequirementLink } from '../../../../../DetailsView/components/requirement-link';
import { RuleAnalyzerConfiguration } from '../../../../../injected/analyzers/analyzer';
import { AnalyzerProvider } from '../../../../../injected/analyzers/analyzer-provider';
import { DecoratedAxeNodeResult, ScannerUtils } from '../../../../../injected/scanner-utils';
import { DrawerProvider } from '../../../../../injected/visualization/drawer-provider';
import { ScannerRuleInfo } from '../../../../../scanner/scanner-rule-info';

describe('buildTestStepsFromRules', () => {
    it('should exist', () => {
        expect(buildTestStepsFromRules).toBeDefined();
    });

    it('should create test step configs for the rule given', () => {
        const rule: ScannerRuleInfo = {
            id: 'test rule',
            help: 'test help',
            a11yCriteria: [{} as HyperlinkDefinition],
            url: 'test url',
        };

        const rulesStub = [rule, rule];
        const expectedDescription = <span>{rule.help}.</span>;
        const expectedHowToTest = (
            <React.Fragment>
                {expectedDescription}{' '}
                <NewTabLink href={rule.url} aria-label={`See more info here about ${rule.id} rule`}>
                    See more info here.
                </NewTabLink>
            </React.Fragment>
        );

        const baseRuleConfig: Requirement = {
            key: rule.id,
            description: expectedDescription,
            name: rule.id,
            isManual: false,
            howToTest: expectedHowToTest,
            guidanceLinks: rule.a11yCriteria,
            generateInstanceIdentifier: InstanceIdentifierGenerator.generateSelectorIdentifier,
            columnsConfig: [],
        };

        const resultTestSteps = buildTestStepsFromRules(rulesStub);
        resultTestSteps.forEach(result => {
            expectResultToContainBase(result, baseRuleConfig);
            validateAnalyzerConfiguration(result, rule);
            validateDrawer(result);
            validateInstanceTableSettings(result);
        });
    });

    function validateAnalyzerConfiguration(actual: Requirement, rule: ScannerRuleInfo): void {
        const analyzerProviderMock = Mock.ofType(AnalyzerProvider, MockBehavior.Strict);
        const getFailingOrPassingInstances = {};
        const forRuleAnalyzerScanStub = {};
        const scannerStub: ScannerUtils = {
            getFailingOrPassingInstances: getFailingOrPassingInstances,
        } as ScannerUtils;
        const telemetryProcessorStub: TelemetryDataFactory = {
            forAssessmentRequirementScan: forRuleAnalyzerScanStub,
        } as TelemetryDataFactory;
        const expectedConfig: Partial<RuleAnalyzerConfiguration> = {
            analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
            rules: [rule.id],
            key: rule.id,
            testType: VisualizationType.AutomatedChecks,
        };

        analyzerProviderMock
            .setup(apm => apm.createBatchedRuleAnalyzer(It.isAny()))
            .callback((result: RuleAnalyzerConfiguration) => {
                expectResultToContainBase(result, expectedConfig);
                expect(result.telemetryProcessor(telemetryProcessorStub)).toBe(
                    forRuleAnalyzerScanStub,
                );
                expect(result.resultProcessor(scannerStub)).toBe(getFailingOrPassingInstances);
            })
            .verifiable();

        actual.getAnalyzer(analyzerProviderMock.object);
        analyzerProviderMock.verifyAll();
    }

    function validateDrawer(actual: Requirement): void {
        const drawerProviderMock = Mock.ofType(DrawerProvider, MockBehavior.Strict);

        drawerProviderMock.setup(dpm => dpm.createHighlightBoxDrawer()).verifiable();

        actual.getDrawer(drawerProviderMock.object);
        drawerProviderMock.verifyAll();
    }

    function validateInstanceTableSettings(actual: Requirement): void {
        expect(actual.getInstanceStatus).toBeDefined();
        expect(actual.getInstanceStatus({ status: true } as DecoratedAxeNodeResult)).toBe(
            ManualTestStatus.PASS,
        );
        expect(actual.getInstanceStatus({ status: false } as DecoratedAxeNodeResult)).toBe(
            ManualTestStatus.FAIL,
        );

        expect(actual.getInstanceStatusColumns).toBeDefined();
        expect(actual.getInstanceStatusColumns()).toHaveLength(0);

        expect(actual.renderInstanceTableHeader).toBeDefined();
        expect(actual.renderInstanceTableHeader({} as AssessmentInstanceTable, [])).toBeNull();

        const linkMock = Mock.ofType(RequirementLink, MockBehavior.Strict);
        const descriptionStub = <div>descriptionWithoutIndexStub</div>;
        linkMock
            .setup(lm => lm.renderRequirementDescriptionWithoutIndex())
            .returns(() => descriptionStub)
            .verifiable(Times.once());
        expect(actual.renderRequirementDescription).toBeDefined();
        expect(actual.renderRequirementDescription(linkMock.object)).toBe(descriptionStub);
        linkMock.verifyAll();

        expect(actual.columnsConfig).toHaveLength(2);
        expect(actual.columnsConfig[0].key).toBe('path');
        expect(actual.columnsConfig[0].name).toBe('Path');
        expect(actual.columnsConfig[1].key).toBe('snippet');
        expect(actual.columnsConfig[1].name).toBe('Snippet');

        validateInstanceColumnsRender(actual.columnsConfig, null, null, 'null');
        validateInstanceColumnsRender(actual.columnsConfig, ['A'], 'X', 'one');
        validateInstanceColumnsRender(actual.columnsConfig, ['A', 'B'], 'XY', 'two');
    }

    function validateInstanceColumnsRender(
        actualColumns: InstanceTableColumn[],
        target: string[],
        html: string,
        message: string,
    ): void {
        const item: AssessmentInstanceRowData = {
            statusChoiceGroup: null,
            visualizationButton: null,
            instance: {
                target: target,
                html: html,
                testStepResults: null,
            },
        };

        expect(actualColumns[0].onRender(item)).toMatchSnapshot(`render path - ${message}`);
        expect(actualColumns[1].onRender(item)).toMatchSnapshot(`render snippet - ${message}`);
    }

    function expectResultToContainBase(result: Object, base: Object): void {
        expect(isMatch(result, base)).toBe(true);
    }
});
