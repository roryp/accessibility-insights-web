// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { generateUID } from 'common/uid-generator';
import { link } from 'content/link';
import {
    AndroidScanResults,
    RuleResultsData,
} from 'electron/platform/android/android-scan-results';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
import { convertScanResultsToUnifiedRules } from 'electron/platform/android/scan-results-to-unified-rules';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import {
    buildRuleInformation,
    buildRuleResultObject,
    buildScanResultsObject,
} from './scan-results-helpers';

describe('ScanResultsToUnifiedRules', () => {
    let ruleInformationProviderMock: IMock<RuleInformationProviderType>;

    let generateGuidMock: IMock<() => string>;
    const deviceName: string = 'Super-duper device';
    const appIdentifier: string = 'Spectacular app';

    function verifyMockCounts(
        expectedRule1Count: number,
        expectedRule2Count: number,
        expectedRule3Count: number,
        expectedRule4Count: number,
        expectedOtherCount: number,
    ): void {
        const totalCalls: number =
            expectedRule1Count +
            expectedRule2Count +
            expectedRule3Count +
            expectedRule4Count +
            expectedOtherCount;

        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(ruleId1),
            Times.exactly(expectedRule1Count),
        );
        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(ruleId2),
            Times.exactly(expectedRule2Count),
        );
        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(ruleId3),
            Times.exactly(expectedRule3Count),
        );
        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(ruleId4),
            Times.exactly(expectedRule4Count),
        );
        ruleInformationProviderMock.verify(
            x => x.getRuleInformation(It.isAnyString()),
            Times.exactly(totalCalls),
        );
    }

    const ruleId1: string = 'Rule #1';
    const ruleId2: string = 'Rule #2';
    const ruleId3: string = 'Rule #3';
    const ruleId4: string = 'Rule #4';

    beforeEach(() => {
        const guidStub = 'gguid-mock-stub';
        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        generateGuidMock.setup(ggm => ggm()).returns(() => guidStub);

        const ruleInformation1: RuleInformation = buildRuleInformation(ruleId1);
        const ruleInformation2: RuleInformation = buildRuleInformation(ruleId2);
        const ruleInformation3: RuleInformation = buildRuleInformation(ruleId3, 'rule-link-3', [
            link.WCAG_1_1_1,
        ]);
        const ruleInformation4: RuleInformation = buildRuleInformation(
            ruleId4,
            'rule-link-4',
            [link.WCAG_1_2_1],
            false,
        );

        ruleInformationProviderMock = Mock.ofType<RuleInformationProviderType>();
        ruleInformationProviderMock
            .setup(x => x.getRuleInformation(ruleId1))
            .returns(() => ruleInformation1);
        ruleInformationProviderMock
            .setup(x => x.getRuleInformation(ruleId2))
            .returns(() => ruleInformation2);
        ruleInformationProviderMock
            .setup(x => x.getRuleInformation(ruleId3))
            .returns(() => ruleInformation3);
        ruleInformationProviderMock
            .setup(x => x.getRuleInformation(ruleId4))
            .returns(() => ruleInformation4);
    });

    test('Null ScanResults input returns empty output', () => {
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(
            null,
            ruleInformationProviderMock.object,
            null,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 0, 0);
    });

    test('ScanResults with no RuleResults returns empty output', () => {
        const scanResults: AndroidScanResults = buildScanResultsObject(deviceName, appIdentifier);
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            null,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 0, 0);
    });

    test('ScanResults with only unsupported rules', () => {
        const ruleResults: RuleResultsData[] = [
            buildRuleResultObject('unsupported 1', 'PASS'),
            buildRuleResultObject('unsupported 2', 'FAIL'),
            buildRuleResultObject('unsupported 3', 'PASS'),
        ];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            deviceName,
            appIdentifier,
            ruleResults,
        );
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(0, 0, 0, 0, 3);
    });

    test('ScanResults with 1 supported rule', () => {
        const ruleResults: RuleResultsData[] = [buildRuleResultObject(ruleId1, 'PASS')];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            deviceName,
            appIdentifier,
            ruleResults,
        );
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(1, 0, 0, 0, 0);
    });

    test('ScanResults with 1 supported rule that repeats', () => {
        const ruleResults: RuleResultsData[] = [
            buildRuleResultObject(ruleId1, 'FAIL'),
            buildRuleResultObject(ruleId1, 'PASS'),
            buildRuleResultObject(ruleId1, 'FAIL'),
        ];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            deviceName,
            appIdentifier,
            ruleResults,
        );
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(1, 0, 0, 0, 0);
    });

    test('ScanResults with a mix of supported rules, unsupported rules, and excluded results', () => {
        const ruleResults: RuleResultsData[] = [
            buildRuleResultObject(ruleId3, 'FAIL'),
            buildRuleResultObject('not supported', 'PASS'),
            buildRuleResultObject(ruleId1, 'FAIL'),
            buildRuleResultObject(ruleId2, 'PASS'),
            buildRuleResultObject(ruleId1, 'FAIL'),
            buildRuleResultObject(ruleId1, 'FAIL'),
            buildRuleResultObject('sorry', 'FAIL'),
            buildRuleResultObject(ruleId2, 'PASS'),
            buildRuleResultObject(ruleId4, 'PASS'),
            buildRuleResultObject(ruleId1, 'PASS'),
            buildRuleResultObject(ruleId3, 'FAIL'),
            buildRuleResultObject('thanks for playing', 'FAIL'),
        ];

        const scanResults: AndroidScanResults = buildScanResultsObject(
            deviceName,
            appIdentifier,
            ruleResults,
        );
        const results: UnifiedRule[] = convertScanResultsToUnifiedRules(
            scanResults,
            ruleInformationProviderMock.object,
            generateGuidMock.object,
        );
        expect(results).toMatchSnapshot();
        verifyMockCounts(1, 1, 1, 1, 3);
    });
});
